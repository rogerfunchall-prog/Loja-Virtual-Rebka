import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Artigo do blog | Rebka" },
      { name: "description", content: "Leia dicas de beleza e cosméticos no blog da Rebka." },
      { property: "og:title", content: "Artigo do blog | Rebka" },
      { property: "og:description", content: "Leia dicas de beleza e cosméticos no blog da Rebka." },
    ],
  }),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { data: posts = [] } = useQuery(postsQuery);
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return <div className="flex-container py-16 text-center text-[13px] text-ink-soft">Carregando artigo...</div>;
  }
  return (
    <article className="flex-container py-12">
      <h1 className="section-title mb-6">{post.title}</h1>
      <img src={post.image_url} alt={post.title} className="mx-auto mb-8 w-full max-w-[860px] object-cover" />
      <div className="mx-auto max-w-[720px] text-[13px] leading-[1.9] text-ink-soft">
        <p className="mb-4 font-medium text-foreground">{post.excerpt}</p>
        <p>{post.content}</p>
      </div>
    </article>
  );
}
