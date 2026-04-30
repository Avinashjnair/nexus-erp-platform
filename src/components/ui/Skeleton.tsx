import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, width, height }) => (
  <div
    className={clsx('skeleton-pulse', className)}
    style={{ width, height }}
  />
);

/** A full table row skeleton — pass `cols` to match your table's column count. */
export const SkeletonRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr className="skeleton-row">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} style={{ padding: '12px 16px' }}>
        <Skeleton height={14} width={i === 0 ? '60%' : i % 2 === 0 ? '80%' : '50%'} />
      </td>
    ))}
  </tr>
);

/** Drop-in replacement while a table's data is loading. */
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => (
  <tbody>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} cols={cols} />
    ))}
  </tbody>
);

/** Card-level skeleton for stat cards / dashboards. */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('stat-card', className)} style={{ gap: 12, display: 'flex', flexDirection: 'column' }}>
    <Skeleton height={12} width="40%" />
    <Skeleton height={28} width="60%" />
    <Skeleton height={10} width="80%" />
  </div>
);
