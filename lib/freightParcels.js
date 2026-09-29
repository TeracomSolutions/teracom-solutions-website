// What a freight quote needs from each cart line: only the physical items,
// with their shipping weight (kg) and packed size (cm) when the catalogue
// has them. A missing size goes as null and the backend uses its default
// parcel. Shared by the cart, the checkout route and the quote route.

export const POSTCODE_PATTERN = /^\d{4}$/;

export function freightItems(lines) {
  return (lines || [])
    .filter(({ product }) => product && product.type === 'hardware')
    .map(({ item, product }) => ({
      quantity: item.quantity,
      weight_kg: product.weightKg ?? null,
      length_cm: product.lengthCm ?? null,
      width_cm: product.widthCm ?? null,
      height_cm: product.heightCm ?? null,
    }));
}

export function cleanPostcode(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 4);
  return POSTCODE_PATTERN.test(digits) ? digits : '';
}