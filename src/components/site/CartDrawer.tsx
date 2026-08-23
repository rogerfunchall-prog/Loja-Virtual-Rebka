import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { brl } from "@/lib/format";

export function CartDrawer() {
  const { items, count, subtotal, drawerOpen, setDrawerOpen, setQuantity, remove } =
    useCart();

  return (
    <>
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[330px] max-w-[90vw] flex-col bg-card transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-[12px] font-semibold uppercase tracking-wider">
            Meu carrinho ({count})
          </span>
          <button
            type="button"
            aria-label="Fechar carrinho"
            onClick={() => setDrawerOpen(false)}
            className="text-ink-soft hover:text-brand"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-ink-soft">
              Seu carrinho está vazio.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="size-16 shrink-0 object-cover"
                  />
                  <div className="flex-1">
                    <Link
                      to="/produtos/$slug"
                      params={{ slug: item.slug }}
                      onClick={() => setDrawerOpen(false)}
                      className="line-clamp-2 text-[12px] hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label="Diminuir"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          className="px-[6px] text-ink-soft hover:text-brand"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-[12px]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Aumentar"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          className="px-[6px] text-ink-soft hover:text-brand"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="text-[13px] font-bold text-brand">
                        {brl(item.price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        aria-label="Remover"
                        onClick={() => remove(item.id)}
                        className="text-ink-soft hover:text-destructive"
                      >
                        <Trash2 className="size-[14px]" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t border-border px-4 py-4">
          <div className="mb-3 flex items-center justify-between text-[13px]">
            <span className="font-semibold uppercase tracking-wide">Total</span>
            <strong className="text-[16px] text-brand">{brl(subtotal)}</strong>
          </div>
          <Link
            to="/carrinho"
            onClick={() => setDrawerOpen(false)}
            className="mb-2 block bg-ink py-[10px] text-center text-[11px] font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-brand"
          >
            Ver carrinho
          </Link>
          <Link
            to="/checkout"
            onClick={() => setDrawerOpen(false)}
            className="block bg-brand py-[10px] text-center text-[11px] font-semibold uppercase tracking-wider text-brand-foreground transition-colors hover:bg-brand-dark"
          >
            Finalizar compra
          </Link>
        </footer>
      </aside>
    </>
  );
}
