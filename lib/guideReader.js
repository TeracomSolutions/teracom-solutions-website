export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function parseInline(text) {
  const parts = [];
  let lastIndex = 0;
  const regex = /\*\*(.*?)\*\*|\[([^"]*)\]\(([^)]+)\)/g;
  
  let match;
  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: text.slice(lastIndex, match.index) });
    }
    
    // Add the matched element
    if (match[1]) {
      // Bold
      parts.push({ type: 'bold', text: match[1] });
    } else {
      // Link
      parts.push({ type: 'link', text: match[2], href: match[3] });
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ type: 'text', text: text.slice(lastIndex) });
  }
  
  return parts;
}

export function parseGuide(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // a. blank line: skip it
    if (line === '') {
      i++;
      continue;
    }
    
    // b. headings
    if (line.startsWith('#### ')) {
      const text = line.slice(5);
      blocks.push({ type: 'h4', text, id: slugify(text) });
      i++;
      continue;
    } else if (line.startsWith('### ')) {
      const text = line.slice(4);
      blocks.push({ type: 'h3', text, id: slugify(text) });
      i++;
      continue;
    } else if (line.startsWith('## ')) {
      const text = line.slice(3);
      blocks.push({ type: 'h2', text, id: slugify(text) });
      i++;
      continue;
    }
    
    // c. bullet list
    if (line.startsWith('- ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || (lines[i].startsWith('  - ') || lines[i].match(/^\s+\d+\. /)))) {
        const currentLine = lines[i];
        if (currentLine.startsWith('- ')) {
          items.push({ text: currentLine.slice(2), sub: [] });
        } else if (currentLine.startsWith('  - ')) {
          // Add to last item's sub
          if (items.length > 0) {
            const lastItem = items[items.length - 1];
            lastItem.sub.push({ text: currentLine.slice(4) });
          }
        } else if (currentLine.match(/^\s+\d+\. /)) {
          // Add to last item's sub
          if (items.length > 0) {
            const lastItem = items[items.length - 1];
            lastItem.sub.push({ text: currentLine.slice(currentLine.match(/^\s+\d+\. /)[0].length) });
          }
        }
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }
    
    // d. numbered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      
      // Process the numbered list - keep going until we hit a line that doesn't start with a number or sub-item
      while (i < lines.length) {
        const currentLine = lines[i];
        
        // Check if it's a blank line within the list - skip it
        if (currentLine === '') {
          i++;
          continue;
        }
        
        // Check if it's a numbered list item
        if (/^\d+\.\s/.test(currentLine)) {
          items.push({ text: currentLine.slice(currentLine.match(/^\d+\.\s/)[0].length), sub: [] });
          i++;
        } else {
          // Check for sub-items (indented with 2 spaces and starting with - or numbers)
          if (currentLine.startsWith('  ') && (currentLine.includes('- ') || /^\s+\d+\. /.test(currentLine))) {
            const lastItem = items[items.length - 1];
            if (lastItem) {
              if (currentLine.includes('- ')) {
                lastItem.sub.push({ text: currentLine.slice(4) });
              } else {
                // Numbered sub-item
                lastItem.sub.push({ text: currentLine.slice(currentLine.match(/^\s+\d+\. /)[0].length) });
              }
            }
            i++;
          } else {
            // Not a list item anymore, end the list
            break;
          }
        }
      }
      blocks.push({ type: 'ol', items });
      continue;
    }
    
    // e. table
    if (line.startsWith('|')) {
      const rows = [];
      let j = i;
      while (j < lines.length && lines[j].startsWith('|')) {
        rows.push(lines[j]);
        j++;
      }
      
      // Process rows
      const parsedRows = [];
      for (let k = 0; k < rows.length; k++) {
        const row = rows[k];
        if (k === 1 && /^\|\s*[-|:\s]+\|?\s*$/.test(row)) {
          // Skip separator row
          continue;
        }
        
        let cells = row.split('|');
        // Remove first and last empty cells
        if (cells.length > 0) {
          cells = cells.slice(1);
        }
        if (cells.length > 0 && cells[cells.length - 1] === '') {
          cells.pop();
        }
        
        // Trim each cell
        const trimmedCells = cells.map(cell => cell.trim());
        parsedRows.push(trimmedCells);
      }
      
      if (parsedRows.length > 0) {
        const header = parsedRows[0];
        const rowsData = parsedRows.slice(1);
        blocks.push({ type: 'table', header, rows: rowsData });
      }
      
      i = j;
      continue;
    }
    
    // f. note
    if (line.startsWith('> ')) {
      const notes = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        notes.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: 'note', text: notes.join(' ') });
      continue;
    }
    
    // g. paragraph
    const paragraphLines = [line];
    i++;
    
    while (i < lines.length) {
      const nextLine = lines[i];
      if (nextLine === '' ||
          nextLine.startsWith('#') ||
          nextLine.startsWith('- ') ||
          nextLine.startsWith('|') ||
          nextLine.startsWith('> ') ||
          /^\d+\.\s/.test(nextLine) ||
          (nextLine.startsWith('  ') && nextLine.includes('- '))) {
        break;
      }
      paragraphLines.push(nextLine);
      i++;
    }
    
    blocks.push({ type: 'p', text: paragraphLines.join(' ') });
  }
  
  return blocks;
}

export function guideOutline(markdown) {
  const blocks = parseGuide(markdown);
  return blocks
    .filter(block => block.type === 'h3')
    .map(block => ({ id: block.id, text: block.text }));
}