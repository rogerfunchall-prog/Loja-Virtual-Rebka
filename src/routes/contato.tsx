import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato | Flex Cosmetics" },
      { name: "description", content: "Fale com a nossa equipe." },
      { property: "og:title", content: "Contato | Flex Cosmetics" },
      { property: "og:description", content: "Fale com a nossa equipe." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="flex-container py-14">
      <h1 className="section-title mb-6">Contato</h1>
      <p className="mx-auto max-w-[720px] text-center text-[13px] leading-[1.9] text-ink-soft">
        Atendimento de segunda a sexta, das 9h às 18h. WhatsApp (11) 99673-9701 ou cosmeticos@temaflex.com.br.
      </p>
    </div>
  );
}
