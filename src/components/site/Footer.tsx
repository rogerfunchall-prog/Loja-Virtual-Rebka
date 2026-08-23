import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  footerAbout,
  footerCategories,
  footerHelp,
  site,
} from "@/lib/site";

function Newsletter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ name: name.trim() || null, email: email.trim().toLowerCase() });
    setLoading(false);
    if (error) {
      toast.error(
        error.code === "23505"
          ? "Este e-mail já está cadastrado."
          : "Não foi possível cadastrar agora.",
      );
      return;
    }
    toast.success("Cadastro realizado! Em breve você recebe nossas novidades.");
    setName("");
    setEmail("");
  }

  return (
    <form
      onSubmit={subscribe}
      className="flex w-full flex-col items-center gap-2 sm:flex-row"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome"
        className="w-full border border-border bg-card px-3 py-[9px] text-[12px] outline-none sm:w-[170px]"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Seu e-mail"
        className="w-full border border-border bg-card px-3 py-[9px] text-[12px] outline-none sm:w-[210px]"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ink px-6 py-[9px] text-[11px] font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
      >
        OK
      </button>
    </form>
  );
}

export function Footer() {
  return (
    <footer>
      {/* instagram */}
      <div className="bg-footer py-9 text-center text-footer-foreground">
        <a
          href={site.instagram}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-col items-center gap-2"
        >
          <Instagram className="size-6" />
          <span className="text-[11px] opacity-80">Siga-nos no Instagram</span>
          <span className="text-[13px] font-semibold">{site.instagramHandle}</span>
        </a>
      </div>

      {/* newsletter */}
      <div className="bg-brand py-6">
        <div className="flex-container flex flex-col items-center justify-between gap-4 lg:flex-row">
          <img
            src={site.logo}
            alt={site.name}
            className="h-[34px] w-auto brightness-0 invert"
          />
          <div className="flex items-center gap-4 text-brand-foreground">
            <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram className="size-[15px]" />
            </a>
            <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook className="size-[15px]" />
            </a>
            <a href={site.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
              <Youtube className="size-[15px]" />
            </a>
          </div>
          <div className="flex-1 lg:max-w-[620px]">
            <p className="mb-2 text-center text-[12px] text-brand-foreground lg:text-left">
              Receba nossas novidades por e-mail. Cadastre-se agora!
            </p>
            <Newsletter />
          </div>
        </div>
      </div>

      {/* colunas */}
      <div className="bg-card py-10">
        <div className="flex-container grid gap-8 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-brand">
              Porque escolher o Tema Flex?
            </h3>
            <p className="text-[12px] leading-[1.7] text-ink-soft">{footerAbout}</p>
          </div>

          <div>
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-brand">
              Categorias
            </h3>
            <ul className="space-y-2">
              {footerCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/categoria/$slug"
                    params={{ slug: c.slug }}
                    className="text-[12px] text-ink-soft hover:text-brand"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-brand">
              Ajuda e Suporte
            </h3>
            <ul className="space-y-2">
              {footerHelp.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[12px] text-ink-soft hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-brand">
              Entre em contato
            </h3>
            <ul className="space-y-2 text-[12px] text-ink-soft">
              <li>
                <a href={`https://wa.me/${site.whatsapp}`} className="hover:text-brand">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`tel:+${site.whatsapp}`} className="hover:text-brand">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-brand">
                  {site.email}
                </a>
              </li>
              <li>{site.city}</li>
              <li>{site.hours}</li>
            </ul>
          </div>
        </div>

        <div className="flex-container mt-9 grid gap-6 border-t border-border pt-6 text-[11px] text-ink-soft lg:grid-cols-3">
          <div>
            <p className="mb-2 font-semibold uppercase tracking-wider text-brand">
              Formas de pagamento
            </p>
            <p>Pix, boleto e cartão de crédito em até 12x</p>
          </div>
          <div>
            <p className="mb-2 font-semibold uppercase tracking-wider text-brand">
              Meios de envio
            </p>
            <p>Correios, Jadlog, transportadora e motoboy</p>
          </div>
          <div>
            <p className="mb-2 font-semibold uppercase tracking-wider text-brand">
              Segurança
            </p>
            <p>Site protegido com certificado SSL</p>
          </div>
        </div>

        <div className="flex-container mt-6 text-center text-[11px] text-ink-soft">
          {site.name} — {site.tagline}
        </div>
      </div>
    </footer>
  );
}
