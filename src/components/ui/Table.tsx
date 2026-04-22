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
    <div className={`table-wrap ${className}`}>
      <table>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={{ width: col.width }}>
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
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
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
                      <td key={colIdx} className={colIdx === 0 ? 'td-main' : ''}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>
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
