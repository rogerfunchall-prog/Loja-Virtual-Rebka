import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { brl, pixPrice } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar compra | Flex Cosmetics" },
      { name: "description", content: "Informe seus dados de entrega e escolha a forma de pagamento para concluir seu pedido." },
      { property: "og:title", content: "Finalizar compra | Flex Cosmetics" },
      { property: "og:description", content: "Informe seus dados e conclua seu pedido na Flex Cosmetics." },
    ],
  }),
  component: Page,
});

function Page() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    cep: "",
    address: "",
    payment_method: "pix",
  });

  const shipping = subtotal >= 299 ? 0 : 24.9;
  const total = form.payment_method === "pix" ? pixPrice(subtotal) + shipping : subtotal + shipping;

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    const { data: order, error } = await supabase
      .from("orders")
      .insert({ ...form, user_id: session.session?.user.id ?? null, subtotal, shipping, total })
      .select("id")
      .single();

    if (error || !order) {
      setLoading(false);
      toast.error("Não foi possível registrar seu pedido.");
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        product_id: i.id,
        product_name: i.name,
        image_url: i.image_url,
        unit_price: i.price,
        quantity: i.quantity,
      })),
    );
    setLoading(false);
    if (itemsError) {
      toast.error("Não foi possível salvar os itens do pedido.");
      return;
    }
    clear();
    toast.success("Pedido realizado com sucesso! Em breve entraremos em contato.");
    navigate({ to: "/" });
  }

  return (
    <div className="flex-container py-12">
      <h1 className="section-title mb-8">Finalizar compra</h1>
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            ["customer_name", "Nome completo"],
            ["email", "E-mail"],
            ["phone", "Telefone"],
            ["cep", "CEP"],
          ] as const).map(([key, label]) => (
            <label key={key} className="text-[12px]">
              <span className="mb-1 block text-ink-soft">{label}</span>
              <input
                required={key === "customer_name" || key === "email"}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                className="w-full border border-border px-3 py-[9px] outline-none"
              />
            </label>
          ))}
          <label className="text-[12px] sm:col-span-2">
            <span className="mb-1 block text-ink-soft">Endereço completo</span>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className="w-full border border-border px-3 py-[9px] outline-none"
            />
          </label>
          <label className="text-[12px] sm:col-span-2">
            <span className="mb-1 block text-ink-soft">Forma de pagamento</span>
            <select
              value={form.payment_method}
              onChange={(e) => set("payment_method", e.target.value)}
              className="w-full border border-border px-3 py-[9px] outline-none"
            >
              <option value="pix">Pix (5% de desconto)</option>
              <option value="boleto">Boleto bancário</option>
              <option value="cartao">Cartão de crédito em até 12x</option>
            </select>
          </label>
        </div>

        <aside className="h-fit border border-border p-5 text-[13px]">
          <div className="mb-2 flex justify-between">
            <span className="text-ink-soft">Subtotal</span>
            <span>{brl(subtotal)}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span className="text-ink-soft">Frete</span>
            <span>{shipping === 0 ? "Grátis" : brl(shipping)}</span>
          </div>
          <div className="mb-4 flex justify-between border-t border-border pt-3">
            <span className="font-semibold uppercase tracking-wide">Total</span>
            <strong className="text-[17px] text-brand">{brl(total)}</strong>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand py-3 text-[11px] font-semibold uppercase tracking-wider text-brand-foreground hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Concluir pedido"}
          </button>
        </aside>
      </form>
    </div>
  );
}
