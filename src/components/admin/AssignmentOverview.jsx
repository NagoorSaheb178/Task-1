/**
 * AssignmentOverview - Admin view of assignment cards with submission progress bars
 */
import { useApp } from '../../context/AppContext';
import ProgressBar from '../shared/ProgressBar';
import { FolderOpen, Cloud, Clock, CheckCircle, Lock, ExternalLink } from 'lucide-react';

export default function AssignmentOverview() {
  const { assignments, getAssignmentStats } = useApp();

  const activeAssignments = assignments;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': return { text: 'ACTIVE', bg: 'bg-[#e0e7ff]', color: 'text-[#4338ca]' }; // Light blue for Active
      case 'submitted': return { text: 'EVALUATION', bg: 'bg-[#fef3c7]', color: 'text-[#b45309]' }; // Light yellow
      case 'graded': return { text: 'GRADED', bg: 'bg-[#d1fae5]', color: 'text-[#047857]' }; // Light green
      case 'archived': return { text: 'ARCHIVED', bg: 'bg-surface-dim', color: 'text-on-surface-secondary' }; // Light gray
      default: return { text: 'UPCOMING', bg: 'bg-[#dbeafe]', color: 'text-[#2563eb]' }; // Lighter blue
    }
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <FolderOpen className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-[18px] font-bold text-on-surface tracking-tight">
            Assignment Dossiers & Submission Progress
          </h2>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-50 px-3.5 py-1.5 rounded-full border border-primary-100 shadow-sm">
          <Cloud className="w-3.5 h-3.5" /> Drive Sync Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {activeAssignments.map((assignment, i) => {
          const stats = getAssignmentStats(assignment.id);
          const statusLabel = getStatusConfig(assignment.status);

          return (
            <div
              key={assignment.id}
              className={`animate-fade-in stagger-${Math.min(i + 1, 6)} bg-white rounded-3xl p-7 shadow-sm border border-surface-border hover:shadow-md hover:border-surface-border/80 transition-all duration-300 flex flex-col justify-between h-full`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md ${statusLabel.bg} ${statusLabel.color}`}>
                    MOD-{assignment.moduleNumber} • {statusLabel.text}
                  </span>
                  
                  {assignment.status === 'pending' && (
                    <span className="text-[11px] font-mono text-[#d97706] font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Due {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  {stats.percentage === 100 && (
                    <span className="text-[11px] font-mono text-[#059669] font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> 100% Complete
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="font-heading text-lg font-bold text-on-surface mb-2 leading-snug">
                  {assignment.title}
                </h3>
                <p className="text-[13px] text-on-surface-secondary line-clamp-2 mb-6 leading-relaxed">
                  {assignment.description}
                </p>

                {/* Drive Link Box */}
                {assignment.driveLink && (
                  <div className="bg-[#f8fafc] p-4 rounded-[16px] mb-8 flex items-center justify-between border border-[#e2e8f0]/60 hover:bg-[#f1f5f9] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <Cloud className="w-5 h-5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] text-on-surface-secondary uppercase font-bold tracking-widest mb-0.5">
                          Drive Folder
                        </p>
                        <a
                          href={assignment.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[12px] font-mono text-primary hover:underline truncate block"
                        >
                          {assignment.driveLink.replace('https://drive.google.com/drive/folders/', '.../')}
                        </a>
                      </div>
                    </div>
                    <a
                      href={assignment.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-surface-secondary hover:text-on-surface transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* Progress Section */}
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] text-on-surface font-bold">Submissions Received</span>
                  <div className="text-[13px] font-bold text-on-surface">
                    {stats.submitted} / {stats.total}
                    <span className="text-on-surface-muted font-semibold ml-1.5">
                      ({stats.percentage}%)
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={stats.submitted}
                  max={stats.total}
                  size="md"
                  color={stats.percentage === 100 ? 'success' : 'primary'}
                />
                <div className="flex items-center justify-between mt-3 text-[11px] font-semibold">
                  <span className="text-on-surface-secondary">{stats.missing} Pending</span>
                  {assignment.status !== 'archived' && (
                    <span className="text-[#059669] flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> Dual-Key Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
