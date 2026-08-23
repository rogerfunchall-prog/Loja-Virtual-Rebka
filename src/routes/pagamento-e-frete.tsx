import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pagamento-e-frete")({
  head: () => ({
    meta: [
      { title: "Pagamento e Frete | Rebka" },
      { name: "description", content: "Formas de pagamento e prazos de entrega." },
      { property: "og:title", content: "Pagamento e Frete | Rebka" },
      { property: "og:description", content: "Formas de pagamento e prazos de entrega." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="flex-container py-14">
      <h1 className="section-title mb-6">Pagamento e Frete</h1>
      <p className="mx-auto max-w-[720px] text-center text-[13px] leading-[1.9] text-ink-soft">
        Aceitamos Pix, boleto e cartão de crédito em até 12x. Enviamos para todo o Brasil via Correios e Jadlog. Frete grátis para Sul e Sudeste a partir de R$299.
      </p>
    </div>
  );
}
