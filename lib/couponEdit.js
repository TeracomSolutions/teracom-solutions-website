export function couponToForm(coupon) {
  return {
    label: coupon.label || '',
    max_discount_cents: coupon.max_discount_cents ? (coupon.max_discount_cents / 100).toFixed(2) : '',
    min_subtotal_cents: coupon.min_subtotal_cents ? (coupon.min_subtotal_cents / 100).toFixed(2) : '',
    expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 10) : '',
    max_redemptions: coupon.max_redemptions ? String(coupon.max_redemptions) : '',
    internal_note: coupon.internal_note || '',
  };
}

export function couponPatch(coupon, form) {
  const patch = {};

  if (form.label.trim() !== coupon.label) {
    patch.label = form.label.trim();
  }

  if (form.max_discount_cents === '') {
    // Field was cleared
    patch.max_discount_cents = null;
  } else if (form.max_discount_cents && Number(form.max_discount_cents) * 100 !== coupon.max_discount_cents) {
    patch.max_discount_cents = Math.round(Number(form.max_discount_cents) * 100);
  }

  if (form.min_subtotal_cents === '') {
    // Field was cleared
    patch.min_subtotal_cents = null;
  } else if (form.min_subtotal_cents && Number(form.min_subtotal_cents) * 100 !== coupon.min_subtotal_cents) {
    patch.min_subtotal_cents = Math.round(Number(form.min_subtotal_cents) * 100);
  }

  if (form.expires_at === '') {
    // Field was cleared
    patch.expires_at = null;
  } else if (form.expires_at && form.expires_at !== coupon.expires_at?.slice(0, 10)) {
    // Date changed or set - convert to ISO format at end of day
    patch.expires_at = new Date(`${form.expires_at}T23:59:59`).toISOString();
  }

  if (form.max_redemptions === '') {
    // Field was cleared
    patch.max_redemptions = null;
  } else if (form.max_redemptions && Number(form.max_redemptions) !== coupon.max_redemptions) {
    patch.max_redemptions = Number(form.max_redemptions);
  }

  if (form.internal_note.trim() !== coupon.internal_note) {
    patch.internal_note = form.internal_note.trim() || null;
  }

  return patch;
}