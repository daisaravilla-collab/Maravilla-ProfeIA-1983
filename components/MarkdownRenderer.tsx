import React, { useMemo } from 'react';

interface MarkdownRendererProps {
  content: string;
}

// A simple but effective parser for Markdown tables and headings to render them nicely without external libs
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderedContent = useMemo(() => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentTable: { headers: string[], rows: string[][] } | null = null;
    let keyCounter = 0;

    const flushTable = () => {
      if (currentTable) {
        elements.push(
          <div key={`table-wrapper-${keyCounter++}`} className="overflow-x-auto my-6 shadow-sm rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-nem-dark text-white">
                <tr>
                  {currentTable.headers.map((h, i) => (
                    <th key={`th-${i}`} className="px-4 py-3 font-semibold tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTable.rows.map((row, rowIndex) => (
                  <tr key={`tr-${rowIndex}`} className="hover:bg-nem-light/30 transition-colors">
                    {row.map((cell, cellIndex) => (
                      <td key={`td-${cellIndex}`} className="px-4 py-3 align-top">
                        {/* Basic bold handling inside table cells */}
                        <span dangerouslySetInnerHTML={{ __html: cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        currentTable = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Heading detection
      if (line.startsWith('#')) {
        flushTable();
        const level = line.match(/^#+/)?.[0].length || 1;
        const text = line.replace(/^#+\s*/, '');
        const Tag = `h${Math.min(level, 6)}` as React.ElementType;
        
        const baseClasses = "font-bold text-gray-800 mt-8 mb-4 tracking-tight";
        let specificClasses = "";
        if (level === 1) specificClasses = "text-3xl border-b-2 border-primary pb-2 text-primary";
        else if (level === 2) specificClasses = "text-2xl text-secondary";
        else if (level === 3) specificClasses = "text-xl text-gray-700";
        else specificClasses = "text-lg text-gray-600";

        elements.push(<Tag key={`h-${keyCounter++}`} className={`${baseClasses} ${specificClasses}`}>{text}</Tag>);
        continue;
      }

      // Strong separator line from prompt
      if (line.includes('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')) {
         flushTable();
         continue; // skip rendering this structural line
      }

      // Table detection (starts with | or contains | but not just a single one)
      if (line.startsWith('|') && line.endsWith('|')) {
        const cells = line.split('|').map(c => c.trim()).filter((_, index, arr) => index !== 0 && index !== arr.length - 1);
        
        // Is it a separator row? (e.g., |---|---|)
        if (cells.every(c => c.replace(/-/g, '').replace(/:/g, '') === '')) {
          continue; // Skip rendering the separator line itself
        }

        if (!currentTable) {
          // Assume first valid line is header
          currentTable = { headers: cells, rows: [] };
        } else {
          currentTable.rows.push(cells);
        }
        continue;
      }

      // Not a table line, but we might be in a table
      if (currentTable && line === '') {
        flushTable();
        continue;
      }

      // If it's just regular text, render it as paragraph if it's not empty
      if (line !== '') {
        flushTable();
        // Check for bold text
        const htmlText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        elements.push(<p key={`p-${keyCounter++}`} className="my-2 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: htmlText }} />);
      }
    }

    flushTable(); // Flush any remaining table

    return elements;
  }, [content]);

  return (
    <div className="prose prose-sm sm:prose-base max-w-none prose-tables:w-full prose-th:bg-gray-100 prose-td:border-b">
      {renderedContent}
    </div>
  );
};