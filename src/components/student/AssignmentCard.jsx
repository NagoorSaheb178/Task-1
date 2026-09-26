/**
 * AssignmentCard - Individual assignment card for student view
 * Displays: title, description, status, drive link, rubric, feedback
 */
import StatusBadge from '../shared/StatusBadge';
import { Folder, Key, FileText, Users, Triangle, FileDown, Link } from 'lucide-react';

export default function AssignmentCard({ assignment, onSubmit }) {
  const isPending = assignment.status === 'pending' && (!assignment.submission || assignment.submission.status !== 'submitted');
  const isSubmitted = assignment.status === 'submitted' || assignment.submission?.status === 'submitted';
  const isGraded = assignment.status === 'graded';
  const isArchived = assignment.status === 'archived';
  const isUpcoming = assignment.status === 'upcoming';

  // Determine current display status
  const displayStatus = (() => {
    if (assignment.submission?.status === 'submitted' && assignment.status === 'pending') return 'submitted';
    return assignment.status;
  })();

  // Time remaining & Overdue check
  const isOverdue = isPending && new Date(assignment.dueDate) < new Date();

  return (
    <article
      className={`relative rounded-3xl bg-white dark:bg-surface-card p-6 sm:p-7 shadow-sm border ${isPending ? 'border-surface-border' : 'border-surface-border/60'} hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden`}
    >
      {/* Left Accent Bar for Pending/Overdue (as in the design) */}
      {isPending && (
        <div className="absolute left-0 top-6 bottom-6 w-[5px] bg-[#eab308] rounded-r-md opacity-90" />
      )}

      {/* Top Header Section */}
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-mono font-medium text-on-surface-secondary tracking-widest uppercase">
            CS 342 <span className="mx-1">•</span> MODULE {assignment.moduleNumber}
          </span>
          <StatusBadge status={displayStatus} />
          {isOverdue && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#fef3c7] text-[#b45309]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
              Overdue
            </span>
          )}
        </div>

        {isPending && (
          <button
            onClick={() => onSubmit(assignment)}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark shadow-sm hover:shadow-md transition-all group"
          >
            <Triangle className="w-4 h-4 fill-current rotate-90 group-hover:translate-x-0.5 transition-transform" />
            Submit
          </button>
        )}
      </div>

      {/* Weight Badge */}
      {assignment.weight && (
        <div className="mb-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-surface-dim text-on-surface-secondary border border-surface-border/50">
            Weighted {assignment.weight}
          </span>
        </div>
      )}

      {/* Title and Description */}
      <div className="mb-6 flex-grow">
        <h3 className="font-heading text-lg sm:text-xl font-bold text-on-surface mb-3 leading-tight">
          {assignment.title}
        </h3>
        <p className="text-[13px] sm:text-sm text-on-surface-secondary leading-relaxed">
          {assignment.description}
        </p>
      </div>

      {/* Bottom Area (Drive Link, Graded Info, Footer) */}
      <div className="mt-auto flex flex-col gap-5 pt-2">
        
        {/* Submitted/Graded Folder Box */}
        {(isSubmitted || isGraded) && assignment.driveLink && (
          <div className="p-4 rounded-xl bg-surface-hover/60 border border-surface-border/50 flex flex-col gap-1">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-2 bg-white rounded-lg border border-surface-border/60 shadow-sm text-primary">
                <Folder className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface mb-0.5">Submitted Files</p>
                <a
                  href={assignment.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-primary hover:underline block break-all font-mono"
                >
                  {assignment.driveLink}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Grade Details or Feedback */}
        {isGraded && (
          <div className="flex items-center justify-between border-t border-surface-border/50 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                PR
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-on-surface">Prof. Ramesh Gupta</span>
                <span className="text-on-surface-secondary">• Evaluator</span>
              </div>
            </div>
            {assignment.feedback?.date && (
              <span className="text-[11px] text-on-surface-secondary font-mono">{assignment.feedback.date}</span>
            )}
          </div>
        )}

        {/* Footer Meta (Deliverables, Peer Review, Staff) */}
        {!isGraded && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-surface-border/40 text-[11px] text-on-surface-secondary font-medium">
            <div className="flex flex-wrap items-center gap-4">
              {assignment.deliverables && (
                <span className="inline-flex items-center gap-1.5">
                  <FileDown className="w-4 h-4" /> {assignment.deliverables}
                </span>
              )}
              {assignment.peerReview && (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {assignment.peerReview}
                </span>
              )}
            </div>
            <div className="font-mono text-on-surface-muted">
              Staff: {assignment.staffLead || 'Prof. Ramesh Gupta'}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

