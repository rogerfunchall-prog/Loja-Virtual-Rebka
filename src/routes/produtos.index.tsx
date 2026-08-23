import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/produtos/")({
  head: () => ({
    meta: [
      { title: "Todos os produtos | Rebka" },
      { name: "description", content: "Veja todos os perfumes, skin care, maquiagem e cuidados com o cabelo da Rebka." },
      { property: "og:title", content: "Todos os produtos | Rebka" },
      { property: "og:description", content: "Catálogo completo de beleza e cosméticos da Rebka." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: products = [] } = useQuery(productsQuery);
  return (
    <div className="flex-container py-12">
      <h1 className="section-title mb-8">Todos os produtos</h1>
      <div className="grid grid-cols-2 gap-[14px] sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
