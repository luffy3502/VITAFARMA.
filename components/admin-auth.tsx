"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { ensureAdminProfile } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";
import { authStorageKey } from "@/lib/supabase-auth-storage";

function withTimeout<T>(promise: Promise<T>, message: string, timeoutMs = 9000) {
  return new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error(message)), timeoutMs);
    promise
      .then((value) => resolve(value))
      .catch((error) => reject(error))
      .finally(() => window.clearTimeout(timeout));
  });
}

export function AdminAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function boot() {
      const { data } = await withTimeout(
        supabase.auth.getSession(),
        "A verificacao de sessao demorou demais. Confira a conexao com o Supabase ou limpe a sessao e tente novamente.",
      );
      if (data.session) {
        try {
          await withTimeout(
            ensureAdminProfile(),
            "A verificacao do perfil administrativo demorou demais. Limpe a sessao e faca login novamente.",
          );
        } catch (profileError) {
          await supabase.auth.signOut();
          throw profileError;
        }
        router.replace("/admin/dashboard");
        return;
      }

      if (!mounted) return;
      setLoading(false);
    }

    boot().catch((bootError: Error) => {
      if (!mounted) return;
      setError(bootError.message);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [router]);

  async function clearSession() {
    setError("");
    setLoading(true);
    try {
      await withTimeout(supabase.auth.signOut(), "Nao foi possivel encerrar a sessao pelo Supabase.", 5000).catch((clearError) => {
        console.error("Erro real ao sair do Supabase:", clearError);
      });
      window.localStorage.removeItem(authStorageKey);
      document.cookie = `${authStorageKey}=; Path=/; Max-Age=0; SameSite=Lax`;
      router.refresh();
      window.location.assign("/admin");
    } catch (clearError) {
      setError(clearError instanceof Error ? clearError.message : "Nao foi possivel sair.");
      setLoading(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      if (!data.session) throw new Error("Login realizado, mas a sessao nao foi retornada.");
      try {
        await ensureAdminProfile();
      } catch (profileError) {
        await supabase.auth.signOut();
        throw profileError;
      }

      router.replace("/admin/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Nao foi possivel autenticar.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-ice p-4">
        <div className="w-full max-w-md rounded-[8px] border border-slate-200 bg-white p-7 text-center shadow-[0_24px_70px_rgba(6,23,47,0.12)]">
          <div className="font-display text-xl font-extrabold text-royal">Carregando acesso...</div>
          <button type="button" onClick={clearSession} className="mt-5 min-h-10 rounded-[8px] border border-slate-200 px-5 text-sm font-extrabold text-slate-600 hover:border-royal/30 hover:text-royal">Sair e limpar sessao</button>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ice p-4">
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[8px] border border-slate-200 bg-white p-7 shadow-[0_24px_70px_rgba(6,23,47,0.12)]">
        <Image src="/logo-vitafarma.png" alt="VitaFarma" width={190} height={100} className="mx-auto h-auto w-48" />
        <div className="mt-8 flex justify-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-royal text-white">
            <ShieldCheck size={22} />
          </span>
        </div>
        <h1 className="mt-4 text-center font-display text-2xl font-extrabold text-midnight">
          Painel Administrativo
        </h1>
        <p className="mt-2 text-center text-sm font-semibold text-slate-500">
          Entre com seu e-mail e senha.
        </p>

        <div className="mt-7 grid gap-3">
          <input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" placeholder="E-mail" className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-royal" />
          <input value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} type="password" placeholder="Senha" className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-royal" />
          {error ? <span className="text-sm font-bold text-signal">{error}</span> : null}
          <button disabled={submitting} className="shine mt-2 min-h-12 rounded-full bg-royal px-6 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-70">
            {submitting ? "Aguarde..." : "Entrar"}
          </button>
          <button type="button" onClick={clearSession} className="min-h-10 rounded-full border border-slate-200 px-5 text-xs font-extrabold text-slate-500 hover:border-royal/30 hover:text-royal">Sair / limpar sessao</button>
        </div>
      </motion.form>
    </main>
  );
}
