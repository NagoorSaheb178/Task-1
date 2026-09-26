/**
 * StatusBadge - Colored badge for assignment/submission status
 */
import { Check, Star, Hourglass } from 'lucide-react';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Submission',
    bg: 'bg-[#fef3c7]',
    text: 'text-[#b45309]',
    icon: <Hourglass className="w-3 h-3" />,
  },
  submitted: {
    label: 'Submitted',
    bg: 'bg-[#d1fae5]',
    text: 'text-[#047857]',
    icon: <Check className="w-3.5 h-3.5 stroke-[3]" />,
  },
  graded: {
    label: 'Graded',
    bg: 'bg-[#e0e7ff]',
    text: 'text-[#4338ca]',
    icon: <Star className="w-3.5 h-3.5 fill-current" />,
  },
  archived: {
    label: 'Completed',
    bg: 'bg-surface-dim',
    text: 'text-on-surface-secondary',
    icon: <Check className="w-3.5 h-3.5" />,
  },
  upcoming: {
    label: 'Upcoming',
    bg: 'bg-info-light',
    text: 'text-info',
    icon: null,
  },
  'in-progress': {
    label: 'In Progress',
    bg: 'bg-warning-light',
    text: 'text-warning-dark',
    icon: null,
  },
  missing: {
    label: 'Missing',
    bg: 'bg-danger-light',
    text: 'text-danger-dark',
    icon: null,
  },
};

export default function StatusBadge({ status, customLabel }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full text-[11px] font-bold px-2.5 py-1 ${config.bg} ${config.text}`}
    >
      {config.icon}
      {customLabel || config.label}
    </span>
  );
}
