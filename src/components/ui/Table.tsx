import type { ReactNode } from 'react';

type AccessorFn<T> = (item: T) => ReactNode;

interface Column<T> {
  header: string;
  key?: string;
  /** String key, accessor function, or inline render */
  accessor?: keyof T | string | AccessorFn<T>;
  render?: (item: T) => ReactNode;
  width?: string;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (item: T) => string | number;
  className?: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

function Table<T extends object>({
  data,
  columns,
  keyExtractor,
  className = '',
  onRowClick,
  emptyMessage = 'No records found.',
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
              const key = keyExtractor
                ? keyExtractor(item)
                : (item as Record<string, unknown>).id != null
                ? String((item as Record<string, unknown>).id)
                : rowIdx;

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
                      content = (col.accessor as AccessorFn<T>)(item);
                    } else {
                      const propKey = (col.accessor ?? col.key) as keyof T | undefined;
                      content =
                        propKey != null
                          ? (item[propKey] as ReactNode)
                          : null;
                    }

                    const isFirst = colIdx === 0;
                    const cellClass = [
                      isFirst ? 'td-main' : '',
                      col.className ?? '',
                    ]
                      .filter(Boolean)
                      .join(' ');

                    return (
                      <td key={colIdx} className={cellClass}>
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
                style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
