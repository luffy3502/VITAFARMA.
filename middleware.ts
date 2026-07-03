import { NextResponse, type NextRequest } from "next/server";
import { authStorageKey, readAccessTokenFromStoredSession } from "@/lib/supabase-auth-storage";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getAuthenticatedAdmin(request: NextRequest) {
  try {
    const token = readAccessTokenFromStoredSession(request.cookies.get(authStorageKey)?.value);
    if (!token || !supabaseUrl || !supabaseAnonKey) return { hasSession: false, isAdmin: false };

    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!authResponse.ok) {
      console.error("Supabase Auth middleware falhou:", authResponse.status, await authResponse.text());
      return { hasSession: false, isAdmin: false };
    }

    const user = await authResponse.json() as { id?: string };
    if (!user.id) return { hasSession: false, isAdmin: false };

    const profileUrl = new URL(`${supabaseUrl}/rest/v1/admin_profiles`);
    profileUrl.searchParams.set("select", "user_id,access_type,status");
    profileUrl.searchParams.set("user_id", `eq.${user.id}`);
    profileUrl.searchParams.set("limit", "1");

    const profileResponse = await fetch(profileUrl, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!profileResponse.ok) {
      console.error("Supabase admin_profiles middleware falhou:", profileResponse.status, await profileResponse.text());
      return { hasSession: true, isAdmin: false };
    }

    const profiles = await profileResponse.json() as Array<{ access_type?: string | null; status?: string | null }>;
    const profile = profiles[0];
    const isAdmin = Boolean(profile && profile.status !== "Inativo" && (!profile.access_type || profile.access_type === "Administrador"));

    return { hasSession: true, isAdmin };
  } catch (error) {
    console.error("Erro real no middleware de autenticacao:", error);
    return { hasSession: false, isAdmin: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = await getAuthenticatedAdmin(request);

  if (pathname === "/admin") {
    if (auth.isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !auth.isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
