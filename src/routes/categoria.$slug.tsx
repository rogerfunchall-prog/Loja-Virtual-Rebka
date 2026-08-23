import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { categoriesQuery, productsQuery } from "@/lib/catalog";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/categoria/$slug")({
  head: () => ({
    meta: [
      { title: "Categoria | Rebka" },
      { name: "description", content: "Produtos selecionados de beleza e cosméticos por categoria na Rebka." },
      { property: "og:title", content: "Categoria | Rebka" },
      { property: "og:description", content: "Produtos selecionados de beleza e cosméticos por categoria." },
    ],
  }),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: products = [] } = useQuery(productsQuery);
  const category = categories.find((c) => c.slug === slug);
  const list = category ? products.filter((p) => p.category_id === category.id) : [];

  return (
    <div className="flex-container py-12">
      <h1 className="section-title mb-8">{category?.name ?? slug}</h1>
      {list.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-ink-soft">Nenhum produto nesta categoria por enquanto.</p>
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
