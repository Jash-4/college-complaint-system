import React from 'react';

/**
 * MetricCard Component
 * @param {string} title - Card title
 * @param {string|number} value - Metric value
 * @param {string} subtitle - Subtitle/trend text
 * @param {React.ComponentType} icon - Lucide icon component
 * @param {string} color - Theme color key: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple'
 */
export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
  onClick,
}) {
  const colorThemes = {
    indigo: {
      bgIcon: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900',
      badge: 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50',
      borderHover: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    },
    emerald: {
      bgIcon: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900',
      badge: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50',
      borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    },
    amber: {
      bgIcon: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900',
      badge: 'text-amber-700 bg-amber-50 dark:bg-amber-950/50',
      borderHover: 'hover:border-amber-300 dark:hover:border-amber-700',
    },
    rose: {
      bgIcon: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900',
      badge: 'text-rose-700 bg-rose-50 dark:bg-rose-950/50',
      borderHover: 'hover:border-rose-300 dark:hover:border-rose-700',
    },
    sky: {
      bgIcon: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900',
      badge: 'text-sky-700 bg-sky-50 dark:bg-sky-950/50',
      borderHover: 'hover:border-sky-300 dark:hover:border-sky-700',
    },
    purple: {
      bgIcon: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900',
      badge: 'text-purple-700 bg-purple-50 dark:bg-purple-950/50',
      borderHover: 'hover:border-purple-300 dark:hover:border-purple-700',
    },
  };

  const theme = colorThemes[color] || colorThemes.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${theme.borderHover}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value ?? 0}
          </p>
        </div>
        {Icon && (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl border shadow-inner ${theme.bgIcon}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      {subtitle && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</span>
        </div>
      )}
    </div>
  );
}
