import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Rebka" },
      { name: "description", content: "Como tratamos os seus dados." },
      { property: "og:title", content: "Política de Privacidade | Rebka" },
      { property: "og:description", content: "Como tratamos os seus dados." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="flex-container py-14">
      <h1 className="section-title mb-6">Política de Privacidade</h1>
      <p className="mx-auto max-w-[720px] text-center text-[13px] leading-[1.9] text-ink-soft">
        Seus dados são utilizados apenas para processar pedidos e melhorar sua experiência de compra. Não compartilhamos informações com terceiros.
      </p>
    </div>
  );
}
