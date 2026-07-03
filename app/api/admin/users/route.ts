import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { authStorageKey, readAccessTokenFromStoredSession } from "@/lib/supabase-auth-storage";
import type { AdminAccessType, AdminUser } from "@/lib/admin-service";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

type AdminProfileRow = {
  user_id: string;
  email: string;
  name: string | null;
  role: string | null;
  access_type: AdminAccessType | null;
  status: "Ativo" | "Inativo" | null;
  created_at?: string;
};

function getAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY nao configurada no servidor.");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function mapAdminUser(row: AdminProfileRow): AdminUser {
  return {
    userId: row.user_id,
    name: row.name ?? "",
    email: row.email,
    role: row.role ?? "",
    accessType: row.access_type ?? "Administrador",
    status: row.status ?? "Ativo",
    createdAt: row.created_at,
  };
}

async function getRequester(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase nao configurado.");

  const token = readAccessTokenFromStoredSession(request.cookies.get(authStorageKey)?.value);
  if (!token) throw new Error("Usuario nao autenticado.");

  const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!authResponse.ok) {
    throw new Error("Sessao invalida ou expirada.");
  }

  const user = await authResponse.json() as { id?: string; email?: string };
  if (!user.id) throw new Error("Usuario nao autenticado.");

  return user;
}

async function requireAdmin(request: NextRequest) {
  const requester = await getRequester(request);
  const supabaseAdmin = getAdminClient();

  const { data, error } = await supabaseAdmin
    .from("admin_profiles")
    .select("user_id, access_type, status")
    .eq("user_id", requester.id)
    .maybeSingle();

  if (error) {
    console.error("Erro real do Supabase ao validar administrador:", error);
    throw error;
  }

  if (!data || data.status === "Inativo" || (data.access_type && data.access_type !== "Administrador")) {
    throw new Error("Apenas administradores ativos podem gerenciar usuarios.");
  }

  return { requester, supabaseAdmin };
}

export async function GET(request: NextRequest) {
  try {
    const { supabaseAdmin } = await requireAdmin(request);
    const { data, error } = await supabaseAdmin
      .from("admin_profiles")
      .select("user_id, email, name, role, access_type, status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro real do Supabase ao listar usuarios:", error);
      throw error;
    }

    return NextResponse.json({ users: (data ?? []).map((row) => mapAdminUser(row as AdminProfileRow)) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabaseAdmin } = await requireAdmin(request);
    const body = await request.json() as AdminUser & { password?: string };

    if (!body.email || !body.password || !body.name) {
      throw new Error("Informe nome, email e senha para cadastrar o usuario.");
    }

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: {
        name: body.name,
        role: body.role,
        access_type: body.accessType,
      },
    });

    if (createError) {
      console.error("Erro real do Supabase Auth ao criar usuario:", createError);
      throw createError;
    }

    if (!created.user) throw new Error("Supabase Auth nao retornou o usuario criado.");

    const profile = {
      user_id: created.user.id,
      email: body.email,
      name: body.name,
      role: body.role || body.accessType,
      access_type: body.accessType,
      status: body.status,
    };

    const { data, error } = await supabaseAdmin
      .from("admin_profiles")
      .upsert(profile)
      .select("user_id, email, name, role, access_type, status, created_at")
      .single();

    if (error) {
      console.error("Erro real do Supabase ao salvar perfil administrativo:", error);
      throw error;
    }

    return NextResponse.json({ user: mapAdminUser(data as AdminProfileRow) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { supabaseAdmin } = await requireAdmin(request);
    const body = await request.json() as AdminUser & { password?: string };

    if (!body.userId) throw new Error("Usuario invalido.");

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(body.userId, {
      email: body.email,
      password: body.password || undefined,
      user_metadata: {
        name: body.name,
        role: body.role,
        access_type: body.accessType,
      },
    });

    if (authError) {
      console.error("Erro real do Supabase Auth ao atualizar usuario:", authError);
      throw authError;
    }

    const { data, error } = await supabaseAdmin
      .from("admin_profiles")
      .update({
        email: body.email,
        name: body.name,
        role: body.role || body.accessType,
        access_type: body.accessType,
        status: body.status,
      })
      .eq("user_id", body.userId)
      .select("user_id, email, name, role, access_type, status, created_at")
      .single();

    if (error) {
      console.error("Erro real do Supabase ao atualizar perfil administrativo:", error);
      throw error;
    }

    return NextResponse.json({ user: mapAdminUser(data as AdminProfileRow) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { requester, supabaseAdmin } = await requireAdmin(request);
    const body = await request.json() as { userId?: string };

    if (!body.userId) throw new Error("Usuario invalido.");
    if (body.userId === requester.id) throw new Error("Nao e permitido excluir o proprio usuario logado.");

    const { error: profileError } = await supabaseAdmin.from("admin_profiles").delete().eq("user_id", body.userId);
    if (profileError) {
      console.error("Erro real do Supabase ao excluir perfil administrativo:", profileError);
      throw profileError;
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(body.userId);
    if (authError) {
      console.error("Erro real do Supabase Auth ao excluir usuario:", authError);
      throw authError;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Nao foi possivel concluir a acao.";
  console.error("Erro real no gerenciamento de usuarios:", error);
  return NextResponse.json({ message, error }, { status: message.includes("autenticado") ? 401 : 400 });
}
