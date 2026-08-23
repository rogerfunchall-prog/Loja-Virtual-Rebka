import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quem-somos")({
  head: () => ({
    meta: [
      { title: "Quem Somos | Rebka" },
      { name: "description", content: "Conheça a história da Rebka." },
      { property: "og:title", content: "Quem Somos | Rebka" },
      { property: "og:description", content: "Conheça a história da Rebka." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="flex-container py-14">
      <h1 className="section-title mb-6">Quem Somos</h1>
      <p className="mx-auto max-w-[720px] text-center text-[13px] leading-[1.9] text-ink-soft">
        Rebka é uma marca de skin care e beleza com a missão de conectar cuidado, ciência e autoestima — produtos desenvolvidos para revelar a sua melhor pele com leveza e confiança.
      </p>
    </div>
  );
}
