import { supabase } from "@/lib/supabase";

export async function currentUserIsAdmin() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) return false;

  const { data, error } = await supabase
    .from("admin_profiles")
    .select("user_id, access_type, status")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return false;

  return (
    data.status !== "Inativo" &&
    data.status !== "inactive" &&
    (
      !data.access_type ||
      ["admin", "Administrador"].includes(data.access_type)
    )
  );
}

export async function ensureAdminProfile() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;

  const user = userData.user;

  if (!user) {
    throw new Error("Nenhum usuario autenticado.");
  }

  const { data: existingProfile, error } = await supabase
    .from("admin_profiles")
    .select("user_id, access_type, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  if (!existingProfile) {
    throw new Error("Usuario sem perfil administrativo cadastrado.");
  }

  if (
    existingProfile.status === "Inativo" ||
    existingProfile.status === "inactive"
  ) {
    throw new Error("Usuario administrativo inativo.");
  }

  if (
    existingProfile.access_type &&
    !["admin", "Administrador"].includes(existingProfile.access_type)
  ) {
    throw new Error("Apenas administradores podem acessar o painel.");
  }

  return true;
}
