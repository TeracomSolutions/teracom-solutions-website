// The pure parts of the Photos and text page and the Catalog's Go live
// message (Robert, 2026-10-08): products without a photo and a description
// are not put live; they are looked up on the manufacturer's website first.

export const STATUS_LABELS = {
  queued: 'Waiting to be looked up',
  working: 'Being looked up',
  review: 'Check this one',
  not_found: 'Not found',
  done: 'Done',
  left: 'Left offline',
};

// The short tag on a Catalog row.
export function contentStatusLabel(status) {
  if (status === 'queued' || status === 'working') return 'Finding photo…';
  if (status === 'review') return 'Check photo';
  if (status === 'not_found') return 'No photo found';
  if (status === 'left') return 'Left offline';
  return '';
}

// What the count in the Store tabs says.
export function tabLabel(count) {
  return count > 0 ? `Photos & text (${count})` : 'Photos & text';
}

function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

// What the Catalog says after Go live or Take offline.
export function publishNotice(result, published = true) {
  const changed = Number(result?.changed) || 0;
  if (!published) return changed ? `${plural(changed, 'product', 'products')} taken off the website.` : 'Nothing changed.';
  const queued = Number(result?.queued) || 0;
  const waiting = Number(result?.already_waiting) || 0;
  const parts = [];
  if (changed) parts.push(`${plural(changed, 'product', 'products')} went live.`);
  if (queued) {
    parts.push(
      `${plural(queued, 'product has', 'products have')} no photo or description yet, so ${queued === 1 ? 'it is' : 'they are'} not live. ` +
        `We are finding ${queued === 1 ? 'it' : 'them'} on the manufacturers' websites, and each goes live as soon as it has both.`
    );
  }
  if (waiting) parts.push(`${plural(waiting, 'more was', 'more were')} already being looked up.`);
  return parts.length ? parts.join(' ') : 'Nothing changed.';
}

// What the Catalog says after Find photos and text.
export function queueNotice(result) {
  const queued = Number(result?.queued) || 0;
  const waiting = Number(result?.already) || 0;
  const ready = Number(result?.ready) || 0;
  const parts = [];
  if (queued) parts.push(`${plural(queued, 'product is', 'products are')} being looked up on the manufacturers' websites.`);
  if (waiting) parts.push(`${waiting} already ${waiting === 1 ? 'was' : 'were'} waiting.`);
  if (ready) parts.push(`${ready} already ${ready === 1 ? 'has' : 'have'} a photo and description.`);
  return parts.length ? parts.join(' ') : 'Nothing to look up.';
}

// How sure the match is, in a sentence.
export function confidenceText(confidence) {
  if (confidence === 'high') return 'The part number is on this page.';
  return 'The part number is not clearly on this page, so check it is the right product.';
}

// What a Photos and text row says about what was found.
export function foundText(candidate) {
  if (!candidate) return '';
  const photo = candidate.image_url ? 'a photo' : null;
  const words = candidate.description ? 'a description' : null;
  const found = [photo, words].filter(Boolean);
  return found.length ? `Found ${found.join(' and ')}.` : 'Found a page, but no usable photo or text.';
}

// What the manual form says after a try.
export function manualNotice(result) {
  const got = [];
  if (result?.photo) got.push('the photo');
  if (result?.description) got.push('the description');
  const problems = Array.isArray(result?.problems) ? result.problems.filter(Boolean) : [];
  if (got.length === 0) return problems.length ? problems.join(' ') : 'Nothing usable was found.';
  const done = `Saved ${got.join(' and ')}.`;
  const live = result?.status === 'done' ? '' : ' It still needs a photo and a description before it can go live.';
  return done + live + (problems.length ? ` ${problems.join(' ')}` : '');
}