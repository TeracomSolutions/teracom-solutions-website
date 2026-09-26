// Editing an existing discount code: the API object becomes form strings,
// and the form goes back as a PATCH holding only what actually changed.
// Money is typed in dollars and stored in cents; blank means "none".

function centsToDollars(cents) {
  return cents ? (cents / 100).toFixed(2) : '';
}

function dollarsToCents(value) {
  const n = Number(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null;
}

export function couponToForm(coupon) {
  return {
    label: coupon.label || '',
    max_discount_cents: centsToDollars(coupon.max_discount_cents),
    min_subtotal_cents: centsToDollars(coupon.min_subtotal_cents),
    expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 10) : '',
    max_redemptions: coupon.max_redemptions ? String(coupon.max_redemptions) : '',
    internal_note: coupon.internal_note || '',
  };
}

export function couponPatch(coupon, form) {
  const patch = {};

  const label = (form.label || '').trim();
  if (label && label !== coupon.label) patch.label = label;

  for (const field of ['max_discount_cents', 'min_subtotal_cents']) {
    const wanted = form[field] === '' || form[field] == null ? null : dollarsToCents(form[field]);
    const current = coupon[field] || null;
    if (wanted !== current) patch[field] = wanted;
  }

  const wantedDate = form.expires_at || null;
  const currentDate = coupon.expires_at ? coupon.expires_at.slice(0, 10) : null;
  if (wantedDate !== currentDate) {
    // A date with no time expires at the end of that day, as the create form does.
    patch.expires_at = wantedDate ? new Date(`${wantedDate}T23:59:59`).toISOString() : null;
  }

  const wantedUses = form.max_redemptions === '' || form.max_redemptions == null ? null : Number(form.max_redemptions);
  if (wantedUses !== (coupon.max_redemptions || null)) patch.max_redemptions = wantedUses;

  const note = (form.internal_note || '').trim() || null;
  if (note !== (coupon.internal_note || null)) patch.internal_note = note;

  return patch;
}
