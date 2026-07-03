import { supabase } from "@/lib/supabase";

export async function currentUserIsAdmin() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  console.log("========== ADMIN AUTH ==========");
  console.log("Usuário autenticado:", userData.user);
  console.log("Erro usuário:", userError);

  if (userError || !userData.user) {
    console.log("currentUserIsAdmin retornando false: erro ao buscar usuário ou usuário ausente.");
    console.log("===============================");
    return false;
  }

  const { data, error } = await supabase
    .from("admin_profiles")
    .select("user_id, access_type, status")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  console.log("Perfil retornado pelo banco:");
  console.log(data);

  console.log("Erro da consulta:");
  console.log(error);

  console.log("Status recebido:", data?.status);
  console.log("Access Type recebido:", data?.access_type);
  console.log("Role recebida:", (data as { role?: unknown } | null)?.role);

  if (error) {
    console.error("currentUserIsAdmin lançando erro da consulta.");
    console.log("===============================");
    throw error;
  }
  if (!data) {
    console.log("currentUserIsAdmin retornando false: perfil administrativo não encontrado.");
    console.log("===============================");
    return false;
  }

  console.log("Validando status...");
  console.log("Validando access_type...");
  console.log(
    "currentUserIsAdmin resultado:",
    data.status !== "Inativo" &&
      data.status !== "inactive" &&
      (!data.access_type ||
        ["admin", "Administrador"].includes(data.access_type))
  );
  console.log("===============================");

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

  console.log("========== ADMIN AUTH ==========");
  console.log("Usuário autenticado:", userData.user);
  console.log("Erro usuário:", userError);

  if (userError) {
    console.error("Falha ao buscar usuário autenticado.");
    console.log("===============================");
    throw userError;
  }

  const user = userData.user;

  if (!user) {
    console.error("Falha na autenticação: nenhum usuário autenticado.");
    console.log("===============================");
    throw new Error("Nenhum usuario autenticado.");
  }

  const { data: existingProfile, error: selectError } = await supabase
    .from("admin_profiles")
    .select("user_id, access_type, status")
    .eq("user_id", user.id)
    .maybeSingle();

  console.log("Perfil retornado pelo banco:");
  console.log(existingProfile);

  console.log("Erro da consulta:");
  console.log(selectError);

  console.log("Status recebido:", existingProfile?.status);
  console.log("Access Type recebido:", existingProfile?.access_type);
  console.log(
    "Role recebida:",
    (existingProfile as { role?: unknown } | null)?.role
  );

  if (selectError) {
    console.error("Falha na consulta do perfil administrativo.");
    console.log("===============================");
    throw selectError;
  }

  if (!existingProfile) {
    console.error("Falha na autenticação: perfil administrativo não encontrado.");
    console.log("===============================");
    throw new Error("Usuario sem perfil administrativo cadastrado.");
  }

  console.log("Validando status...");
  if (
    existingProfile.status === "Inativo" ||
    existingProfile.status === "inactive"
  ) {
    console.error("Falha na validação de status administrativo.");
    console.error("Valor encontrado:", existingProfile.status);
    console.log("===============================");
    throw new Error("Usuario administrativo inativo.");
  }

  console.log("Validando access_type...");
  if (
    existingProfile.access_type &&
    !["admin", "Administrador"].includes(existingProfile.access_type)
  ) {
    console.error("Falha na validação do administrador.");
    console.error("Valor encontrado:", existingProfile.access_type);
    console.log("===============================");
    throw new Error("Apenas administradores podem acessar o painel.");
  }

  console.log("Administrador validado com sucesso.");
  console.log("===============================");

  return true;
}
