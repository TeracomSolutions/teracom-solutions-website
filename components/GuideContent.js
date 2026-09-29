import { parseGuide, parseInline } from '@/lib/guideReader';

// Helper component for inline formatting
function Inline({ text }) {
  return parseInline(text).map((part, i) => {
    if (part.type === 'bold') {
      return <strong key={i}>{part.text}</strong>;
    } else if (part.type === 'link') {
      return (
        <a 
          key={i} 
          href={part.href} 
          {...(part.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {part.text}
        </a>
      );
    }
    return <span key={i}>{part.text}</span>;
  });
}

export default function GuideContent({ markdown, idPrefix = '' }) {
  const blocks = parseGuide(markdown || '');

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return <h2 id={idPrefix ? `${idPrefix}-${block.id}` : block.id} key={index}><Inline text={block.text} /></h2>;
          case 'h3':
            return <h3 id={idPrefix ? `${idPrefix}-${block.id}` : block.id} key={index}><Inline text={block.text} /></h3>;
          case 'h4':
            return <h4 id={idPrefix ? `${idPrefix}-${block.id}` : block.id} key={index}><Inline text={block.text} /></h4>;
          case 'p':
            return <p key={index}><Inline text={block.text} /></p>;
          case 'note':
            return <p className="admin-guide-note" key={index}><Inline text={block.text} /></p>;
          case 'ul':
          case 'ol':
            const List = block.type === 'ul' ? 'ul' : 'ol';
            return (
              <List key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Inline text={item.text} />
                    {item.sub && item.sub.length > 0 && (
                      <ul>
                        {item.sub.map((subItem, subIndex) => (
                          <li key={subIndex}><Inline text={subItem} /></li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </List>
            );
          case 'table':
            return (
              <table key={index}>
                <thead>
                  <tr>
                    {block.header.map((cell, i) => (
                      <th key={i}><Inline text={cell} /></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, i) => (
                        <td key={i}><Inline text={cell} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          default:
            return null;
        }
      })}
    </>
  );
}