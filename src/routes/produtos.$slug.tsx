import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { productsQuery } from "@/lib/catalog";
import { brl, discountPercent, installment, pixPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/produtos/$slug")({
  head: () => ({
    meta: [
      { title: "Produto | Rebka" },
      { name: "description", content: "Detalhes do produto, preço no Pix e parcelamento sem juros na Rebka." },
      { property: "og:title", content: "Produto | Rebka" },
      { property: "og:description", content: "Detalhes do produto, preço no Pix e parcelamento sem juros." },
    ],
  }),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { data: products = [] } = useQuery(productsQuery);
  const product = products.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();

  if (!product) {
    return <div className="flex-container py-16 text-center text-[13px] text-ink-soft">Carregando produto...</div>;
  }

  const price = Number(product.price);
  const off = discountPercent(price, product.compare_at_price);
  const related = products.filter((p) => p.id !== product.id).slice(0, 10);

  return (
    <>
      <div className="flex-container grid gap-10 py-10 lg:grid-cols-2">
        <img src={product.image_url} alt={product.name} className="w-full object-cover" />
        <div>
          <h1 className="font-heading text-[22px] leading-[1.3] text-ink">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            {product.compare_at_price ? (
              <span className="text-[13px] text-ink-soft line-through">{brl(Number(product.compare_at_price))}</span>
            ) : null}
            <span className="text-[26px] font-bold text-brand">{brl(price)}</span>
            {off > 0 ? (
              <span className="bg-brand px-2 py-[3px] text-[10px] font-bold uppercase tracking-wider text-brand-foreground">{off}% OFF</span>
            ) : null}
          </div>
          <p className="mt-2 text-[13px] text-ink-soft">
            <strong className="text-foreground">{brl(pixPrice(price))}</strong> com Pix
          </p>
          <p className="text-[13px] text-ink-soft">
            ou 4x de <strong className="text-foreground">{brl(installment(price))}</strong> sem juros
          </p>

          <div className="mt-6 flex items-stretch gap-2">
            <div className="flex items-center border border-border">
              <button type="button" aria-label="Diminuir" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 text-ink-soft hover:text-brand">
                <Minus className="size-3" />
              </button>
              <span className="w-8 text-center text-[13px]">{quantity}</span>
              <button type="button" aria-label="Aumentar" onClick={() => setQuantity((q) => q + 1)} className="px-3 text-ink-soft hover:text-brand">
                <Plus className="size-3" />
              </button>
            </div>
            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={() => add({ id: product.id, slug: product.slug, name: product.name, price, image_url: product.image_url }, quantity)}
              className="flex flex-1 items-center justify-center gap-2 bg-brand py-3 text-[11px] font-semibold uppercase tracking-wider text-brand-foreground transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              <ShoppingBag className="size-4" />
              {product.stock > 0 ? "Adicionar ao carrinho" : "Produto esgotado"}
            </button>
          </div>

          <p className="mt-6 text-[13px] leading-[1.9] text-ink-soft">{product.description}</p>
        </div>
      </div>

      <section className="pb-14">
        <div className="flex-container">
          <SectionHeading title="Você também pode gostar" />
          <ProductCarousel products={related} />
        </div>
      </section>
    </>
  );
}
