export function brl(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Preço no Pix: 5% de desconto, como na loja original. */
export function pixPrice(price: number): number {
  return Math.round(price * 0.95 * 100) / 100;
}

/** Parcelamento em 4x sem juros. */
export function installment(price: number, times = 4): number {
  return Math.round((price / times) * 100) / 100;
}

export function discountPercent(price: number, compareAt?: number | null): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
