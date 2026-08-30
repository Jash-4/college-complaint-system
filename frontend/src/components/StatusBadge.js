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
        bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        dot: 'bg-slate-400 dark:bg-slate-500',
        icon: null,
      },
      Medium: {
        bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        dot: 'bg-blue-500',
        icon: null,
      },
      High: {
        bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
        icon: AlertTriangle,
      },
      Critical: {
        bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800 animate-pulse',
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
      bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      icon: Clock,
      dot: 'bg-blue-500',
    },
    'Under Review': {
      bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: Eye,
      dot: 'bg-amber-500',
    },
    Assigned: {
      bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      icon: UserCheck,
      dot: 'bg-purple-500',
    },
    'In Progress': {
      bg: 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      icon: Activity,
      dot: 'bg-orange-500',
    },
    Resolved: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2,
      dot: 'bg-emerald-500',
    },
    Closed: {
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      icon: XCircle,
      dot: 'bg-slate-400 dark:bg-slate-500',
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
