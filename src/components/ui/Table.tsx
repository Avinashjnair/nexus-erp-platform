import React from 'react';
import type { ReactNode } from 'react';

interface Column<T> {
  header: string;
  key?: keyof T | string;
  accessor?: keyof T | string | ((item: T) => ReactNode);
  render?: (item: T) => ReactNode;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (item: T) => string | number;
  className?: string;
  onRowClick?: (item: T) => void;
}

function Table<T>({ 
  data, 
  columns, 
  keyExtractor, 
  className = '',
  onRowClick 
}: TableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-separate border-spacing-y-4">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className="text-left px-8 py-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]" 
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, rowIdx) => {
              const key = keyExtractor ? keyExtractor(item) : (item as any).id || rowIdx;
              return (
                <tr 
                  key={key} 
                  onClick={() => onRowClick?.(item)}
                  className="bg-surface/30 hover:bg-card transition-all shadow-sm hover:shadow-xl hover:-translate-y-0.5 cursor-pointer group relative"
                >
                  {columns.map((col, colIdx) => {
                    let content: ReactNode;
                    
                    if (col.render) {
                      content = col.render(item);
                    } else if (typeof col.accessor === 'function') {
                      content = col.accessor(item);
                    } else {
                      const propKey = (col.accessor || col.key) as keyof T;
                      content = item[propKey] as ReactNode;
                    }

                    return (
                      <td key={colIdx} className="px-8 py-6 text-[14px] text-text-primary first:rounded-l-2xl last:rounded-r-2xl border-y border-transparent first:border-l last:border-r group-hover:border-border-subtle tracking-tight">
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td 
                colSpan={columns.length} 
                className="text-center py-12 text-text-tertiary bg-transparent"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
