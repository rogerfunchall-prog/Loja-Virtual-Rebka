import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta | Flex Cosmetics" },
      { name: "description", content: "Acesse sua conta para acompanhar pedidos e agilizar suas compras na Flex Cosmetics." },
      { property: "og:title", content: "Minha conta | Flex Cosmetics" },
      { property: "og:description", content: "Acesse sua conta na Flex Cosmetics." },
    ],
  }),
  component: Page,
});

function Page() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/conta`,
              data: { full_name: name },
            },
          });
    setBusy(false);
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    toast.success(mode === "login" ? "Bem-vinda de volta!" : "Cadastro realizado!");
  }

  if (loading) {
    return <div className="flex-container py-16 text-center text-[13px] text-ink-soft">Carregando...</div>;
  }

  if (user) {
    return (
      <div className="flex-container py-14 text-center">
        <h1 className="section-title mb-4">Minha conta</h1>
        <p className="mb-6 text-[13px] text-ink-soft">Você está conectada como {user.email}.</p>
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            toast.success("Você saiu da sua conta.");
          }}
          className="bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground hover:bg-brand"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <div className="flex-container py-14">
      <h1 className="section-title mb-8">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
      <form onSubmit={submit} className="mx-auto max-w-[380px]">
        {mode === "signup" ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="mb-3 w-full border border-border px-3 py-[10px] text-[13px] outline-none"
          />
        ) : null}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="mb-3 w-full border border-border px-3 py-[10px] text-[13px] outline-none"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="mb-4 w-full border border-border px-3 py-[10px] text-[13px] outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="mb-3 w-full bg-brand py-3 text-[11px] font-semibold uppercase tracking-wider text-brand-foreground hover:bg-brand-dark disabled:opacity-60"
        >
          {mode === "login" ? "Entrar" : "Cadastrar"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full text-[12px] text-ink-soft hover:text-brand"
        >
          {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </form>
    </div>
  );
}
