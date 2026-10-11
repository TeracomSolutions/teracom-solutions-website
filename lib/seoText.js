// Collapse runs of whitespace to single spaces and trim the text.
// If its length is max or less, return it.
// Otherwise look at the first max + 1 characters, find the last space in them,
// and keep everything before that space; if there is no space, keep the first max characters.
// Then tidy the end: repeatedly remove trailing characters from the set space, comma, semicolon,
// colon, hyphen, slash and pipe, and also remove a last word that is one of:
// for, to, with, and, of, in, on, the, a, an, or, by, at, suit (compare in lower case;
// only when other words come before it).
export function cutWords(text, max) {
  if (typeof text !== 'string') return '';

  // Collapse runs of whitespace to single spaces and trim
  let result = text.replace(/\s+/g, ' ').trim();

  if (result.length <= max) return result;

  // Look at first max + 1 characters
  const lookAhead = max + 1;
  const cutPoint = result.substring(0, lookAhead).lastIndexOf(' ');

  // If there's no space, just cut at max chars
  if (cutPoint === -1) {
    result = result.substring(0, max);
  } else {
    result = result.substring(0, cutPoint);
  }

  // Tidy the end: repeatedly remove trailing characters and connector words
  const trailingChars = ' ,;:-/|';
  const connectors = ['for', 'to', 'with', 'and', 'of', 'in', 'on', 'the', 'a', 'an', 'or', 'by', 'at', 'suit'];

  // Keep removing trailing characters and connector words until nothing more can be removed
  // but never remove the only word
  while (result.length > 0) {
    // Remove trailing characters
    while (result.length > 0 && trailingChars.includes(result[result.length - 1])) {
      result = result.substring(0, result.length - 1);
    }

    // Check if there's still content and remove a trailing connector word if applicable
    const words = result.split(' ').filter(w => w.length > 0);
    if (words.length <= 1) {
      // If there's only one word or no words, stop removing
      break;
    }

    // Check if the last word is a connector word
    const lastWord = words[words.length - 1].toLowerCase();
    if (connectors.includes(lastWord)) {
      // Remove the connector word
      result = words.slice(0, -1).join(' ');
    } else {
      // No more connector words to remove
      break;
    }
  }

  return result;
}

// Collapse whitespace in main. If suffix is given and main + " | " + suffix is max characters or less,
// return that. Otherwise return cutWords(main, max) with no suffix.
export function fitTitle(main, suffix, max = 65) {
  if (typeof main !== 'string') main = '';

  // Collapse runs of whitespace to single spaces and trim
  main = main.replace(/\s+/g, ' ').trim();

  if (suffix && main.length + 3 + suffix.length <= max) {
    return main + ' | ' + suffix;
  }

  return cutWords(main, max);
}

// Clean the name (collapse whitespace). The part number is added after the name only when
// sku is a non-empty string that does not already appear in the name (compare in lower case).
// Let full be the name, plus a space and the sku when the sku is added.
// The brand suffix is " | Teracom Store".
// - If full plus the suffix is 65 characters or less, return full + suffix.
// - Else if full is 65 characters or less, return full (no suffix).
// - Else cut the name but keep the part number: when the sku was added, return
//   cutWords(name, 65 - sku.length - 1) + " " + sku; when it was not added, return cutWords(name, 65).
export function productTitle(name, sku) {
  if (typeof name !== 'string') name = '';

  // Clean the name
  name = name.replace(/\s+/g, ' ').trim();

  let skuAdded = false;
  if (sku && typeof sku === 'string' && sku.length > 0 && !name.toLowerCase().includes(sku.toLowerCase())) {
    name += ' ' + sku;
    skuAdded = true;
  }

  const brandSuffix = ' | Teracom Store';
  const full = name + brandSuffix;

  if (full.length <= 65) return full;

  if (name.length <= 65) return name;

  // Cut the name but keep the part number
  if (skuAdded) {
    const cutLength = 65 - sku.length - 1; // -1 for space
    return cutWords(name.substring(0, name.length - sku.length - 1), cutLength) + ' ' + sku;
  } else {
    return cutWords(name, 65);
  }
}

// The ending is " Part number " + sku + ". Priced in AUD inclusive of GST." when sku is a non-empty string,
// otherwise just " Priced in AUD inclusive of GST.".
// Let room be 160 minus the length of the ending.
// The body is cutWords(description, room - 1); if the body is not empty and does not end with a full stop,
// exclamation mark or question mark, add a full stop.
// Before cutting at a word, when the cleaned description is longer than room - 1, look for the last sentence end
// inside the first room - 1 characters (a full stop, exclamation mark or question mark followed by a space,
// or the end of that piece) that comes after at least 40 characters; when there is one, use the text up to and
// including that sentence end as the body (no extra full stop is added then, because it already ends with one).
// Otherwise cut at a word as before.
// Return the body + ending, trimmed at the start.
// The result is never longer than 160 characters.
export function productDescription(description, sku) {
  if (typeof description !== 'string') description = '';

  const ending = sku && typeof sku === 'string' && sku.length > 0
    ? ` Part number ${sku}. Priced in AUD inclusive of GST.`
    : ' Priced in AUD inclusive of GST.';

  const room = 160 - ending.length;

  // Clean the description for processing
  let cleanedDescription = description.replace(/ /g, ' ').trim();

  // If the cleaned description is shorter than or equal to room - 1, no need to cut
  if (cleanedDescription.length <= room - 1) {
    var body = cleanedDescription;
  } else {
    // Look for a sentence end in the first room - 1 characters that comes after at least 40 characters
    const lookAhead = room - 1;
    const textToCheck = cleanedDescription.substring(0, lookAhead);

    // Find the last sentence ending (., !, ?) followed by a space within the look ahead range
    // that occurs after at least 40 characters
    let sentenceEndIndex = -1;
    let lastSentenceEndMatch = null;

    // Use regex to find all sentence endings with spaces in textToCheck
    const sentenceEndRegex = /([.!?])\s/g;
    let match;
    while ((match = sentenceEndRegex.exec(textToCheck)) !== null) {
      // Only consider matches that come after at least 40 characters
      if (match.index >= 40) {
        sentenceEndIndex = match.index + 1; // Position of the space after the sentence end
        lastSentenceEndMatch = match;
      }
    }

    // If we found a suitable sentence ending, use text up to and including that point
    if (sentenceEndIndex !== -1 && lastSentenceEndMatch) {
      body = cleanedDescription.substring(0, sentenceEndIndex + 1);
    } else {
      // Otherwise fall back to original behavior: cut at word boundary
      let cutPoint = lookAhead;
      // Find the last space within the look ahead range
      while (cutPoint > 0 && cleanedDescription[cutPoint] !== ' ') {
        cutPoint--;
      }

      if (cutPoint === 0) {
        // No space found, just cut at room - 1
        body = cleanedDescription.substring(0, lookAhead);
      } else {
        // Cut at the last space
        body = cleanedDescription.substring(0, cutPoint);
      }
    }
  }

  // Apply cutWords to clean up the result
  body = cutWords(body, room - 1);

  // Add a full stop if needed (only if there isn't already one)
  if (body && !/[.!?]$/.test(body)) {
    body += '.';
  }

  return (body + ending).trim();
}

// Clean the tagline (collapse whitespace, trim). If it is 70 characters or longer,
// return cutWords(tagline, 160). Otherwise return cutWords(the tagline, a space, then "Buy " + name + " from Teracom Solutions in Melbourne: supplier and installer with local support and fast Australian delivery.", 160).
// When the tagline is empty use only the "Buy ..." sentence.
// When name is empty use "our range" in place of the name.
export function brandDescription(name, tagline) {
  if (typeof tagline !== 'string') tagline = '';
  if (typeof name !== 'string') name = '';

  tagline = tagline.replace(/\s+/g, ' ').trim();

  if (tagline.length >= 70) {
    return cutWords(tagline, 160);
  }

  const buySentence = `Buy ${name || 'our range'} from Teracom Solutions in Melbourne: supplier and installer with local support and fast Australian delivery.`;

  return cutWords(tagline + ' ' + buySentence, 160);
}