export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseInt(price.replace(/\D/g, "")) : price;
  if (isNaN(num)) return String(price);
  return num.toLocaleString("vi-VN") + "đ";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
