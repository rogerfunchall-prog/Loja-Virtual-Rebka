import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Meu carrinho | Rebka" },
      { name: "description", content: "Revise os itens do seu carrinho e finalize sua compra na Rebka." },
      { property: "og:title", content: "Meu carrinho | Rebka" },
      { property: "og:description", content: "Revise os itens do seu carrinho e finalize sua compra." },
    ],
  }),
  component: Page,
});

function Page() {
  const { items, subtotal, setQuantity, remove } = useCart();

  return (
    <div className="flex-container py-12">
      <h1 className="section-title mb-8">Meu carrinho</h1>
      {items.length === 0 ? (
        <div className="text-center">
          <p className="mb-5 text-[13px] text-ink-soft">Seu carrinho está vazio.</p>
          <Link to="/produtos" className="inline-block bg-brand px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-brand-foreground">
            Ver produtos
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-border border border-border">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 p-4">
                <img src={item.image_url} alt={item.name} className="size-20 object-cover" />
                <div className="flex-1">
                  <Link to="/produtos/$slug" params={{ slug: item.slug }} className="text-[13px] hover:text-brand">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-[12px] text-ink-soft">{brl(item.price)}</p>
                </div>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.id, Number(e.target.value))}
                  className="w-14 border border-border px-2 py-1 text-center text-[12px]"
                />
                <strong className="w-24 text-right text-[13px] text-brand">{brl(item.price * item.quantity)}</strong>
                <button type="button" aria-label="Remover" onClick={() => remove(item.id)} className="text-ink-soft hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <aside className="h-fit border border-border p-5">
            <div className="mb-4 flex items-center justify-between text-[13px]">
              <span className="font-semibold uppercase tracking-wide">Subtotal</span>
              <strong className="text-[17px] text-brand">{brl(subtotal)}</strong>
            </div>
            <Link to="/checkout" className="block bg-brand py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-brand-foreground hover:bg-brand-dark">
              Finalizar compra
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
