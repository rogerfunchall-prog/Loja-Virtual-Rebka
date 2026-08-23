import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { brl, discountPercent, installment, pixPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();
  const off = discountPercent(product.price, product.compare_at_price);
  const soldOut = product.stock <= 0;

  return (
    <div className="group flex h-full flex-col border border-border bg-card">
      <div className="relative overflow-hidden">
        <Link
          to="/produtos/$slug"
          params={{ slug: product.slug }}
          className="block bg-white"
        >
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-0 top-2 flex flex-col items-start gap-1">
          {soldOut ? (
            <span className="bg-ink px-2 py-[3px] text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              Esgotado
            </span>
          ) : null}
          {off > 0 ? (
            <span className="bg-brand px-2 py-[3px] text-[10px] font-bold uppercase tracking-wider text-brand-foreground">
              {off}% OFF
            </span>
          ) : null}
        </div>
        {product.free_shipping ? (
          <span className="absolute right-0 top-2 bg-brand-soft px-2 py-[3px] text-[10px] font-semibold uppercase tracking-wider text-brand-dark">
            Frete grátis
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-3 text-center">
        <Link
          to="/produtos/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 min-h-[34px] text-[12px] leading-[1.4] text-foreground hover:text-brand"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-baseline justify-center gap-2">
          {product.compare_at_price ? (
            <span className="text-[11px] text-ink-soft line-through">
              {brl(Number(product.compare_at_price))}
            </span>
          ) : null}
          <span className="text-[15px] font-bold text-brand">
            {brl(Number(product.price))}
          </span>
        </div>

        <p className="mt-1 text-[11px] text-ink-soft">
          <strong className="font-semibold text-foreground">
            {brl(pixPrice(Number(product.price)))}
          </strong>{" "}
          com Pix
        </p>
        <p className="text-[11px] text-ink-soft">
          ou 4x de{" "}
          <strong className="font-semibold text-foreground">
            {brl(installment(Number(product.price)))}
          </strong>{" "}
          sem juros
        </p>

        <div className="mt-auto flex items-stretch gap-1 pt-3">
          <div className="flex items-center border border-border">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-2 text-ink-soft transition-colors hover:text-brand"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-6 text-center text-[12px]">{quantity}</span>
            <button
              type="button"
              aria-label="Aumentar quantidade"
              onClick={() => setQuantity((q) => q + 1)}
              className="px-2 text-ink-soft transition-colors hover:text-brand"
            >
              <Plus className="size-3" />
            </button>
          </div>
          <button
            type="button"
            disabled={soldOut}
            onClick={() =>
              add(
                {
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: Number(product.price),
                  image_url: product.image_url,
                },
                quantity,
              )
            }
            className="flex flex-1 items-center justify-center gap-1 bg-ink px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag className="size-3" />
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
