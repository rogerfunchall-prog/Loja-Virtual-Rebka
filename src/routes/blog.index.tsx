import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog | Rebka" },
      { name: "description", content: "Dicas de beleza, skin care, maquiagem e cuidados com o cabelo no blog da Rebka." },
      { property: "og:title", content: "Blog | Rebka" },
      { property: "og:description", content: "Dicas de beleza, skin care e maquiagem da Rebka." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: posts = [] } = useQuery(postsQuery);
  return (
    <div className="flex-container py-12">
      <h1 className="section-title mb-8">Blog</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article key={p.id}>
            <Link to="/blog/$slug" params={{ slug: p.slug }} className="block overflow-hidden">
              <img src={p.image_url} alt={p.title} className="aspect-square w-full object-cover" />
            </Link>
            <h2 className="mt-3 text-[13px] font-semibold uppercase tracking-wide text-ink">
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-brand">{p.title}</Link>
            </h2>
            <p className="mt-2 line-clamp-3 text-[12px] leading-[1.7] text-ink-soft">{p.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
