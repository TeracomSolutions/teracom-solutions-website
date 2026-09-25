export function sellPriceCents(buyCents, markupPercent) {
  if (!Number.isInteger(buyCents) || buyCents < 0 || !Number.isFinite(buyCents)) {
    throw new TypeError('buyCents must be a non-negative finite integer');
  }
  
  // Checked before the comparison below: a non-numeric markup makes
  // `markupPercent < 0` false, so it would sail past that guard and come out
  // the far end as NaN -- a silently wrong price rather than a refusal.
  if (typeof markupPercent !== 'number' || !Number.isFinite(markupPercent)) {
    throw new TypeError('markupPercent must be a finite number');
  }

  if (markupPercent < 0) {
    throw new RangeError('markupPercent cannot be negative');
  }

  // Calculate the sell price with markup
  const sellPrice = buyCents * (1 + markupPercent / 100);
  
  // Round to nearest whole cent
  return Math.round(sellPrice);
}

export function applyGst(exGstCents) {
  if (!Number.isInteger(exGstCents) || exGstCents < 0 || !Number.isFinite(exGstCents)) {
    throw new TypeError('exGstCents must be a non-negative finite integer');
  }

  // Apply 10% GST (multiply by 1.1)
  const incGst = exGstCents * 1.1;
  
  // Round to nearest whole cent
  return Math.round(incGst);
}

export function gstComponentCents(incGstCents) {
  if (!Number.isInteger(incGstCents) || incGstCents < 0 || !Number.isFinite(incGstCents)) {
    throw new TypeError('incGstCents must be a non-negative finite integer');
  }

  // GST is 1/11 of the inclusive amount (since 10% GST means 11 parts total, 1 part GST)
  const gstComponent = incGstCents / 11;
  
  // Round to nearest whole cent
  return Math.round(gstComponent);
}

export function freightCents({ weightGrams, cubicCm, zone }) {
  if (!['metro', 'regional', 'remote'].includes(zone)) {
    throw new RangeError('Unknown zone');
  }

  // If no weight and no volume, return zero
  if ((!weightGrams || weightGrams === 0) && (!cubicCm || cubicCm === 0)) {
    return 0;
  }

  // Calculate dead weight (actual weight)
  const deadWeight = weightGrams || 0;

  // Calculate volumetric weight (cubic cm / 5)
  const volumetricWeight = cubicCm ? cubicCm / 5 : 0;

  // Use the greater of the two weights
  const chargeableWeight = Math.max(deadWeight, volumetricWeight);

  // Base rates per zone for first 5kg (5000g)
  let baseRate;
  switch (zone) {
    case 'metro':
      baseRate = 995;
      break;
    case 'regional':
      baseRate = 1495;
      break;
    case 'remote':
      baseRate = 2495;
      break;
  }

  // If chargeable weight is 5kg or less, return base rate
  if (chargeableWeight <= 5000) {
    return baseRate;
  }

  // Calculate additional weight above 5kg in 1kg increments
  const additionalWeight = chargeableWeight - 5000;
  const additionalKilos = Math.ceil(additionalWeight / 1000);
  
  // Additional cost is 250 cents per kilo (or part thereof)
  const additionalCost = additionalKilos * 250;

  return baseRate + additionalCost;
}

export function roundToNearestFiveCents(cents) {
  if (!Number.isInteger(cents) || cents < 0 || !Number.isFinite(cents)) {
    throw new TypeError('cents must be a non-negative finite integer');
  }

  // Divide by 5, round to nearest whole number, then multiply back by 5
  return Math.round(cents / 5) * 5;
}