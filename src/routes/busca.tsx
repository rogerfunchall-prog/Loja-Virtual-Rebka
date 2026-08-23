import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/busca")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Busca | Rebka" },
      { name: "description", content: "Busque perfumes, skin care, maquiagem e mais na Rebka." },
      { property: "og:title", content: "Busca | Rebka" },
      { property: "og:description", content: "Busque perfumes, skin care, maquiagem e mais." },
    ],
  }),
  component: Page,
});

function Page() {
  const { q } = Route.useSearch();
  const { data: products = [] } = useQuery(productsQuery);
  const term = q.toLowerCase();
  const list = products.filter((p) => p.name.toLowerCase().includes(term));

  return (
    <div className="flex-container py-12">
      <h1 className="section-title mb-8">Resultados para "{q}"</h1>
      {list.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-ink-soft">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 gap-[14px] sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
