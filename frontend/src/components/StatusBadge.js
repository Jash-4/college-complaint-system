import React from 'react';
import {
  Clock,
  Eye,
  UserCheck,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
} from 'lucide-react';

/**
 * StatusBadge Component
 * Color mapping:
 * - Submitted: Blue
 * - Under Review: Yellow
 * - Assigned: Purple
 * - In Progress: Orange
 * - Resolved: Green
 * - Closed: Gray
 *
 * @param {string} status - Complaint status
 * @param {string} priority - Complaint priority
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export default function StatusBadge({ status, priority, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
    lg: 'text-sm px-3 py-1.5 font-semibold gap-2',
  };

  // Priority Badge Rendering
  if (priority) {
    const priorityConfig = {
      Low: {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        icon: null,
      },
      Medium: {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        icon: null,
      },
      High: {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        icon: AlertTriangle,
      },
      Critical: {
        bg: 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse',
        dot: 'bg-rose-600',
        icon: Flame,
      },
    };

    const config = priorityConfig[priority] || priorityConfig.Medium;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center rounded-full border shadow-sm ${config.bg} ${sizeClasses[size]}`}
      >
        {Icon ? (
          <Icon className="w-3.5 h-3.5" />
        ) : (
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        )}
        <span>{priority} Priority</span>
      </span>
    );
  }

  // Status Badge Rendering with exact requested color themes
  const statusConfig = {
    Submitted: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Clock,
      dot: 'bg-blue-500',
    },
    'Under Review': {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Eye,
      dot: 'bg-amber-500',
    },
    Assigned: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: UserCheck,
      dot: 'bg-purple-500',
    },
    'In Progress': {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: Activity,
      dot: 'bg-orange-500',
    },
    Resolved: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      dot: 'bg-emerald-500',
    },
    Closed: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: XCircle,
      dot: 'bg-slate-400',
    },
  };

  const config = statusConfig[status] || statusConfig.Submitted;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${config.bg} ${sizeClasses[size]}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{status}</span>
    </span>
  );
}
