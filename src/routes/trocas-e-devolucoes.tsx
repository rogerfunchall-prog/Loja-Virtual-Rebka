import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trocas-e-devolucoes")({
  head: () => ({
    meta: [
      { title: "Trocas e Devoluções | Flex Cosmetics" },
      { name: "description", content: "Como trocar ou devolver seu pedido." },
      { property: "og:title", content: "Trocas e Devoluções | Flex Cosmetics" },
      { property: "og:description", content: "Como trocar ou devolver seu pedido." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="flex-container py-14">
      <h1 className="section-title mb-6">Trocas e Devoluções</h1>
      <p className="mx-auto max-w-[720px] text-center text-[13px] leading-[1.9] text-ink-soft">
        Você tem até 7 dias corridos após o recebimento para solicitar a troca ou devolução. A primeira troca é gratuita.
      </p>
    </div>
  );
}
