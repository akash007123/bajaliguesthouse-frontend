import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'New' | 'Pending' | 'Approved' | 'Cancelled' | 'Completed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  New: 'bg-blue-100 text-blue-700 border-blue-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
  Completed: 'bg-green-100 text-green-700 border-green-200',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
};
