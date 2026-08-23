import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  User,
  X,
  Youtube,
} from "lucide-react";
import { announcements, menu, site } from "@/lib/site";
import { useCart } from "@/lib/cart";

function TopBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % announcements.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-brand py-[7px] text-center text-[11px] font-medium tracking-wide text-brand-foreground">
      {announcements[index]}
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.13-.129.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.889-9.884a9.82 9.82 0 016.99 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [term, setTerm] = useState("");
  const { count, setDrawerOpen } = useCart();
  const navigate = useNavigate();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!term.trim()) return;
    navigate({ to: "/busca", search: { q: term.trim() } });
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-card">
      <TopBar />

      {/* linha de contato */}
      <div className="hidden border-b border-border bg-surface py-[6px] lg:block">
        <div className="flex-container flex items-center justify-between text-[11px] text-ink-soft">
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-brand"
            >
              <WhatsAppIcon className="size-[13px]" /> Whatsapp
            </a>
            <a
              href={`tel:+${site.whatsapp}`}
              className="flex items-center gap-1 hover:text-brand"
            >
              <Phone className="size-[13px]" /> {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-1 hover:text-brand"
            >
              <Mail className="size-[13px]" /> {site.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/blog" className="hover:text-brand">
              Blog
            </Link>
            <Link to="/contato" className="hover:text-brand">
              Contato
            </Link>
            <span className="flex items-center gap-3">
              <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram className="size-[13px] hover:text-brand" />
              </a>
              <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <Facebook className="size-[13px] hover:text-brand" />
              </a>
              <a href={site.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                <Youtube className="size-[13px] hover:text-brand" />
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* linha principal */}
      <div className="border-b border-border">
        <div className="flex-container flex items-center gap-4 py-3">
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <Link to="/" className="shrink-0">
            <img
              src={site.logo}
              alt={site.name}
              className="h-[38px] w-auto object-contain"
            />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-[22px] lg:flex">
            {menu.map((item) => (
              <Link
                key={item.slug}
                to="/categoria/$slug"
                params={{ slug: item.slug }}
                className="text-[12px] font-medium uppercase tracking-[0.08em] text-foreground transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form
            onSubmit={submitSearch}
            className="ml-auto hidden items-center border border-border lg:flex"
          >
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Buscar..."
              className="w-[190px] px-3 py-[7px] text-[12px] outline-none"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="px-3 py-[7px] text-ink-soft hover:text-brand"
            >
              <Search className="size-4" />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-4 lg:ml-0">
            <Link to="/conta" aria-label="Minha conta" className="hover:text-brand">
              <User className="size-[18px]" />
            </Link>
            <button
              type="button"
              aria-label="Abrir carrinho"
              onClick={() => setDrawerOpen(true)}
              className="relative hover:text-brand"
            >
              <ShoppingBag className="size-[18px]" />
              {count > 0 ? (
                <span className="absolute -right-2 -top-2 flex size-[15px] items-center justify-center rounded-full bg-brand text-[9px] font-bold text-brand-foreground">
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>

      {/* menu mobile */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[280px] bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <img src={site.logo} alt={site.name} className="h-8 w-auto" />
              <button type="button" aria-label="Fechar menu" onClick={() => setMobileOpen(false)}>
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={submitSearch} className="mb-4 flex items-center border border-border">
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Buscar..."
                className="w-full px-3 py-2 text-[12px] outline-none"
              />
              <button type="submit" aria-label="Buscar" className="px-3">
                <Search className="size-4" />
              </button>
            </form>
            <nav className="flex flex-col">
              {menu.map((item) => (
                <Link
                  key={item.slug}
                  to="/categoria/$slug"
                  params={{ slug: item.slug }}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border py-3 text-[13px] uppercase tracking-wide"
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/blog" onClick={() => setMobileOpen(false)} className="border-b border-border py-3 text-[13px] uppercase tracking-wide">
                Blog
              </Link>
              <Link to="/contato" onClick={() => setMobileOpen(false)} className="border-b border-border py-3 text-[13px] uppercase tracking-wide">
                Contato
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
