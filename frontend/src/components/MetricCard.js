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
      bgIcon: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badge: 'text-indigo-700 bg-indigo-50',
      borderHover: 'hover:border-indigo-300',
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: 'text-emerald-700 bg-emerald-50',
      borderHover: 'hover:border-emerald-300',
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'text-amber-700 bg-amber-50',
      borderHover: 'hover:border-amber-300',
    },
    rose: {
      bgIcon: 'bg-rose-50 text-rose-600 border-rose-100',
      badge: 'text-rose-700 bg-rose-50',
      borderHover: 'hover:border-rose-300',
    },
    sky: {
      bgIcon: 'bg-sky-50 text-sky-600 border-sky-100',
      badge: 'text-sky-700 bg-sky-50',
      borderHover: 'hover:border-sky-300',
    },
    purple: {
      bgIcon: 'bg-purple-50 text-purple-600 border-purple-100',
      badge: 'text-purple-700 bg-purple-50',
      borderHover: 'hover:border-purple-300',
    },
  };

  const theme = colorThemes[color] || colorThemes.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${theme.borderHover}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
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
          <span className="text-xs text-slate-500">{subtitle}</span>
        </div>
      )}
    </div>
  );
}
