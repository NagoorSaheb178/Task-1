/**
 * StatsCards - Bento-grid stat cards for student dashboard overview
 * Shows: completion rate, upcoming deadlines, verified submissions
 */
import { useApp } from '../../context/AppContext';
import ProgressBar from '../shared/ProgressBar';
import { BarChart3, Clock, PartyPopper, Award, Key } from 'lucide-react';

export default function StatsCards() {
  const { studentProgress, completionPercentage, studentAssignments } = useApp();

  // Find the nearest pending assignment
  const pendingAssignments = studentAssignments
    .filter((a) => a.status === 'pending' && (!a.submission || a.submission.status !== 'submitted'))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const nextDeadline = pendingAssignments[0];

  // Calculate time remaining
  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;
    if (diff <= 0) return 'Overdue';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    return `${hours}h`;
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Stat 1: Overall Completion */}
      <div className="animate-fade-in stagger-1 relative overflow-hidden rounded-2xl bg-surface-card p-6 shadow-sm card-hover border border-surface-border">
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/5" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.1em] text-on-surface-secondary font-bold">
              Course Progress
            </span>
            <h2 className="font-heading text-base font-semibold text-on-surface mt-0.5">
              Overall Completion
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary text-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-heading text-4xl font-bold text-on-surface">
            {completionPercentage}%
          </span>
          <span className="text-xs text-on-surface-secondary font-medium">
            {studentProgress.submitted} of {studentAssignments.length} done
          </span>
        </div>
        <ProgressBar value={completionPercentage} color="auto" size="md" />
        <div className="flex justify-between mt-2 text-[10px] font-mono text-on-surface-secondary">
          <span>{studentProgress.submitted} Verified</span>
          <span>{studentProgress.inReview} In Review</span>
          <span>{studentProgress.pending} Pending</span>
        </div>
      </div>

      {/* Stat 2: Critical Deadlines */}
      <div className="animate-fade-in stagger-2 relative overflow-hidden rounded-2xl bg-surface-card p-6 shadow-sm card-hover border border-surface-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.1em] text-on-surface-secondary font-bold">
              Ticking Clock
            </span>
            <h2 className="font-heading text-base font-semibold text-on-surface mt-0.5">
              Critical Deadlines
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning-light flex items-center justify-center text-warning text-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-2.5">
          {nextDeadline ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-warning-light/60">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-warning animate-pulse-dot shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-semibold text-on-surface truncate">
                    {nextDeadline.title}
                  </p>
                  <p className="text-[10px] font-mono text-warning-dark">
                    Due: {new Date(nextDeadline.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-surface-card text-warning-dark font-bold whitespace-nowrap shadow-sm">
                {getTimeRemaining(nextDeadline.dueDate)}
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-success-light/50 text-center flex items-center justify-center gap-2">
              <PartyPopper className="w-4 h-4 text-success-dark" />
              <p className="text-xs font-semibold text-success-dark">All caught up!</p>
            </div>
          )}
          {pendingAssignments[1] && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-hover">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-on-surface-muted shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-semibold text-on-surface truncate">
                    {pendingAssignments[1].title}
                  </p>
                  <p className="text-[10px] text-on-surface-secondary">Scheduled</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-surface-dim text-on-surface-secondary font-medium whitespace-nowrap">
                {new Date(pendingAssignments[1].dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stat 3: Verified Submissions */}
      <div className="animate-fade-in stagger-3 relative overflow-hidden rounded-2xl bg-surface-card p-6 shadow-sm card-hover border border-surface-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.1em] text-on-surface-secondary font-bold">
              Integrity Archive
            </span>
            <h2 className="font-heading text-base font-semibold text-on-surface mt-0.5">
              Verified Submissions
            </h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success-light flex items-center justify-center text-success text-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-heading text-4xl font-bold text-on-surface">
            {studentProgress.submitted}
          </span>
          <span className="text-xs text-on-surface-secondary font-medium">
            Dual-Key Certified
          </span>
        </div>
        <div className="p-3 rounded-xl bg-surface-hover flex items-center gap-2.5">
          <Key className="w-4 h-4 text-success" />
          <div className="text-[10px] font-mono text-on-surface-secondary truncate">
            SHA-256 verified • All receipts generated
          </div>
        </div>
      </div>
    </section>
  );
}
