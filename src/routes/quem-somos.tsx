import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quem-somos")({
  head: () => ({
    meta: [
      { title: "Quem Somos | Flex Cosmetics" },
      { name: "description", content: "Conheça a história da Flex Cosmetics." },
      { property: "og:title", content: "Quem Somos | Flex Cosmetics" },
      { property: "og:description", content: "Conheça a história da Flex Cosmetics." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="flex-container py-14">
      <h1 className="section-title mb-6">Quem Somos</h1>
      <p className="mx-auto max-w-[720px] text-center text-[13px] leading-[1.9] text-ink-soft">
        Flex é uma marca de beleza e cosméticos com a missão de redefinir o bem-estar de maneira única, com produtos meticulosamente desenvolvidos para proporcionar confiança e bem-estar.
      </p>
    </div>
  );
}
