/**
 * ProgressBar - Animated progress bar with label support
 * Reusable across student and admin views for showing completion rates
 */
export default function ProgressBar({ value = 0, max = 100, size = 'md', color = 'primary', showLabel = false, label = '' }) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
    auto: percentage >= 80 ? 'bg-success' : percentage >= 50 ? 'bg-primary' : percentage >= 30 ? 'bg-warning' : 'bg-danger',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-on-surface-secondary">{label || 'Progress'}</span>
          <span className={`text-xs font-bold font-mono ${percentage >= 80 ? 'text-success' : percentage >= 50 ? 'text-primary' : 'text-warning'}`}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={`w-full bg-surface-dim rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full progress-fill`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
