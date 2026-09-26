/**
 * StudentDashboard - Main student view page
 * Renders different content based on activeSection from sidebar navigation
 * Sections: dashboard, assignments, progress
 */
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import StatsCards from '../components/student/StatsCards';
import FilterBar from '../components/student/FilterBar';
import AssignmentCard from '../components/student/AssignmentCard';
import SubmissionModal from '../components/student/SubmissionModal';
import ProgressBar from '../components/shared/ProgressBar';
import { ShieldCheck, ClipboardList, Cloud, Inbox, BarChart2, Trophy, CheckCircle, Clock } from 'lucide-react';

export default function StudentDashboard({ activeSection }) {
  const { studentAssignments, currentStudent, completionPercentage, studentProgress } = useApp();
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    switch (filter) {
      case 'pending':
        return studentAssignments.filter(
          (a) => a.status === 'pending' && (!a.submission || a.submission.status !== 'submitted')
        );
      case 'submitted':
        return studentAssignments.filter(
          (a) => a.status === 'submitted' || a.submission?.status === 'submitted'
        );
      case 'graded':
        return studentAssignments.filter(
          (a) => a.status === 'graded' || a.status === 'archived'
        );
      default:
        return studentAssignments;
    }
  }, [studentAssignments, filter]);

  const handleSubmitClick = (assignment) => {
    setSelectedAssignment(assignment);
    setModalOpen(true);
  };

  // Sort assignments: pending first, then by due date
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    const statusOrder = { pending: 0, submitted: 1, graded: 2, archived: 3, upcoming: 4 };
    const aStatus = a.submission?.status === 'submitted' ? 1 : (statusOrder[a.status] ?? 5);
    const bStatus = b.submission?.status === 'submitted' ? 1 : (statusOrder[b.status] ?? 5);
    if (aStatus !== bStatus) return aStatus - bStatus;
    return new Date(b.dueDate) - new Date(a.dueDate);
  });

  // ===== Welcome Header (shared across sections) =====
  const WelcomeHeader = () => (
    <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 lg:mb-8">
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary border border-primary-200">
            Student Dashboard
          </span>
          <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-surface-dim" />
          <span className="hidden sm:inline text-[10px] font-mono text-on-surface-secondary">
            ID {currentStudent.id}
          </span>
          <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-surface-dim" />
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-success font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            Integrity Shield Active
          </span>
        </div>
        <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
          Welcome back, {currentStudent.name}
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-secondary max-w-2xl">
          Your assignment progress and submission management dashboard.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-surface-card text-on-surface text-xs sm:text-sm font-medium border border-surface-border hover:bg-surface-hover transition-all shadow-sm">
          <ClipboardList className="w-4 h-4" />
          Audit Log
        </button>
        <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-medium hover:bg-primary-dark shadow-md shadow-primary/20 transition-all">
          <Cloud className="w-4 h-4" />
          Sync Drive
        </button>
      </div>
    </section>
  );

  // ===== SECTION: Dashboard (default) =====
  if (activeSection === 'dashboard') {
    return (
      <div className="flex flex-col w-full max-w-6xl mx-auto">
        <WelcomeHeader />
        <StatsCards />
        {/* Action Required Section */}
        <div className="mt-8 mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-on-surface">
              Action Required
            </h2>
            <p className="text-xs text-on-surface-secondary mt-0.5">
              Assignments that need your attention
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-warning-light text-warning-dark text-[10px] font-bold">
            {studentAssignments.filter(a => a.status === 'pending' && (!a.submission || a.submission.status !== 'submitted')).length} Pending
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            const pendingAssignments = studentAssignments
              .filter(a => a.status === 'pending' && (!a.submission || a.submission.status !== 'submitted'))
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
              
            if (pendingAssignments.length > 0) {
              return pendingAssignments.slice(0, 2).map((assignment, i) => (
                <div key={assignment.id} className={`animate-fade-in stagger-${Math.min(i + 1, 6)} h-full flex`}>
                  <div className="w-full h-full">
                    <AssignmentCard assignment={assignment} onSubmit={handleSubmitClick} />
                  </div>
                </div>
              ));
            }
            
            return (
              <div className="col-span-1 md:col-span-2 text-center py-12 sm:py-16 bg-white dark:bg-surface-card rounded-3xl border border-surface-border/60 shadow-sm">
                <CheckCircle className="w-12 h-12 mx-auto text-success mb-3" />
                <p className="text-sm font-semibold text-on-surface">You're all caught up!</p>
                <p className="text-xs text-on-surface-secondary mt-1">
                  You have no pending assignments at the moment.
                </p>
              </div>
            );
          })()}
        </div>
        <SubmissionModal
          assignment={selectedAssignment}
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedAssignment(null); }}
        />
      </div>
    );
  }

  // ===== SECTION: My Assignments (detailed list with all assignments) =====
  if (activeSection === 'assignments') {
    return (
      <div className="flex flex-col w-full max-w-6xl mx-auto">
        <section className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-1">
            <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-primary" />
              My Assignments
            </h1>
            <span className="text-xs font-mono text-on-surface-secondary bg-surface-hover px-3 py-1 rounded-full border border-surface-border">
              {studentAssignments.length} Total • {studentAssignments.filter(a => a.status !== 'upcoming').length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-secondary">
            Complete list of all assignments for CS 342: Distributed Systems.
          </p>
        </section>

        <FilterBar assignments={studentAssignments} onFilterChange={setFilter} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedAssignments.map((assignment, i) => (
            <div key={assignment.id} className={`animate-fade-in stagger-${Math.min(i + 1, 6)} h-full flex`}>
              <div className="w-full h-full">
                <AssignmentCard assignment={assignment} onSubmit={handleSubmitClick} />
              </div>
            </div>
          ))}
          {sortedAssignments.length === 0 && (
            <div className="text-center py-12 sm:py-16 bg-surface-card rounded-2xl border border-surface-border">
              <Inbox className="w-12 h-12 mx-auto text-on-surface-muted mb-3" />
              <p className="text-sm font-semibold text-on-surface">No assignments match this filter</p>
            </div>
          )}
        </div>

        <SubmissionModal
          assignment={selectedAssignment}
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedAssignment(null); }}
        />
      </div>
    );
  }

  // ===== SECTION: My Progress =====
  if (activeSection === 'progress') {
    return (
      <div className="flex flex-col w-full max-w-6xl mx-auto">
        <section className="mb-6 lg:mb-8">
          <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight mb-1 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-primary" />
            My Progress
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-secondary">
            Track your course completion and assignment scores at a glance.
          </p>
        </section>

        {/* Overall Progress Card */}
        <div className="animate-fade-in bg-white rounded-2xl p-6 sm:p-8 border border-surface-border shadow-sm mb-8 lg:mb-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-on-surface-secondary font-bold block mb-2">
                Overall Course Completion
              </span>
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-[48px] sm:text-[56px] leading-none font-bold text-on-surface">
                  {completionPercentage}%
                </span>
                <span className="text-[13px] text-on-surface-secondary font-medium">
                  {studentProgress.submitted} of {studentAssignments.length} assignments completed
                </span>
              </div>
            </div>
            <Trophy className="w-12 h-12 text-[#d97706]" strokeWidth={1.5} />
          </div>

          <div className="mb-8">
            <div className="w-full bg-[#e2e8f0] rounded-full h-3">
              <div
                className="bg-[#4338ca] h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center py-5 rounded-xl bg-[#e6f8ef] border border-[#a7f3d0]/30 shadow-sm">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-[#047857] block mb-1">
                {studentProgress.submitted}
              </span>
              <span className="text-[11px] text-[#059669] font-bold">Completed</span>
            </div>
            <div className="text-center py-5 rounded-xl bg-[#fffbeb] border border-[#fde68a]/50 shadow-sm">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-[#b45309] block mb-1">
                {studentProgress.pending}
              </span>
              <span className="text-[11px] text-[#d97706] font-bold">Pending</span>
            </div>
            <div className="text-center py-5 rounded-xl bg-[#eff6ff] border border-[#bfdbfe]/50 shadow-sm">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-[#1d4ed8] block mb-1">
                {studentProgress.inReview}
              </span>
              <span className="text-[11px] text-[#2563eb] font-bold">In Review</span>
            </div>
          </div>
        </div>

        {/* Per-Assignment Scores */}
        <h2 className="font-heading text-lg font-bold text-on-surface mb-4">
          Assignment Scores Breakdown
        </h2>
        <div className="space-y-4">
          {studentAssignments
            .filter((a) => a.status !== 'upcoming')
            .map((assignment, i) => {
              const isCompleted = assignment.status === 'submitted' || assignment.status === 'graded' || assignment.status === 'archived' || assignment.submission?.status === 'submitted';
              const grade = assignment.grade;

              return (
                <div
                  key={assignment.id}
                  className={`animate-fade-in stagger-${Math.min(i + 1, 6)} bg-white rounded-[16px] p-5 border border-surface-border shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        isCompleted ? 'bg-[#e6f8ef] text-[#047857]' : 'bg-[#fffbeb] text-[#b45309]'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" strokeWidth={2.5} /> : <Clock className="w-5 h-5" strokeWidth={2.5} />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-bold text-on-surface truncate mb-0.5">
                          {assignment.title}
                        </h3>
                        <p className="text-[11px] text-on-surface-secondary font-mono font-medium">
                          Module {assignment.moduleNumber} • Weight: {assignment.weight}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pl-16 sm:pl-0">
                      {grade ? (
                        <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-[#ede9fe] text-[#5b21b6] whitespace-nowrap shadow-sm">
                          {grade.score}/{grade.total} ({grade.letter})
                        </span>
                      ) : isCompleted ? (
                        <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-[#d1fae5] text-[#047857] whitespace-nowrap shadow-sm">
                          Submitted
                        </span>
                      ) : (
                        <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-[#fef3c7] text-[#b45309] whitespace-nowrap shadow-sm">
                          Pending
                        </span>
                      )}
                      
                      {/* Simple Horizontal Progress Bar line */}
                      <div className="w-24 h-1.5 rounded-full bg-[#e2e8f0]">
                        <div 
                          className={`h-full rounded-full transition-all ${isCompleted ? 'bg-[#059669]' : 'bg-[#f59e0b]'}`} 
                          style={{ width: isCompleted ? '100%' : '0%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
