export const formatPrice = (amount: number | null, currency: string) => {
  if (amount === null) return "Free";
  const price = amount / 100;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(price);
};

export const formatInterval = (interval: string, count: number) => {
  if (count === 1) {
    return `/ ${interval}`;
  }
  return `/ ${count} ${interval}s`;
};
