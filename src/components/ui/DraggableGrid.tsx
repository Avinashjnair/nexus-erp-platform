import React, { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import ReactGridLayout, { Responsive } from 'react-grid-layout';

// @ts-ignore
const ResponsiveGridLayout = ReactGridLayout.WidthProvider ? ReactGridLayout.WidthProvider(Responsive) : Responsive;

interface GridItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

interface DraggableGridProps {
  layouts: { lg: GridItem[] };
  children: ReactNode;
  rowHeight?: number;
}

const DraggableGrid: React.FC<DraggableGridProps> = ({ layouts: initialLayouts, children, rowHeight = 100 }) => {
  const [layouts, setLayouts] = useState<any>(initialLayouts);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <ResponsiveGridLayout
        className="layout"
        width={width}
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={rowHeight}
        onLayoutChange={(_current: any, all: any) => setLayouts(all)}
        draggableHandle=".drag-handle"
        margin={[20, 20]}
      >
        {children}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DraggableGrid;
