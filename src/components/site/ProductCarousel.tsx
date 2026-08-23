import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

export function ProductCarousel({ products }: { products: Product[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: false });
  const [snaps, setSnaps] = useState<number[]>([]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
  }, [embla, onSelect]);

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 shrink-0 grow-0 basis-1/2 px-[7px] sm:basis-1/3 lg:basis-1/5"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Anterior"
        onClick={() => embla?.scrollPrev()}
        className="absolute -left-2 top-[38%] hidden size-8 items-center justify-center rounded-full bg-card text-ink shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-colors hover:text-brand lg:flex"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Próximo"
        onClick={() => embla?.scrollNext()}
        className="absolute -right-2 top-[38%] hidden size-8 items-center justify-center rounded-full bg-card text-ink shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-colors hover:text-brand lg:flex"
      >
        <ChevronRight className="size-4" />
      </button>

      <div className="mt-4 flex items-center justify-center gap-[6px]">
        {snaps.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para o slide ${i + 1}`}
            onClick={() => embla?.scrollTo(i)}
            className={
              i === selected
                ? "size-[7px] rounded-full bg-brand"
                : "size-[7px] rounded-full bg-border"
            }
          />
        ))}
      </div>
    </div>
  );
}
