/**
 * StudentRoster - Admin table showing per-student submission status & progress
 * Includes individual progress bars per student
 */
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import ProgressBar from '../shared/ProgressBar';
import StatusBadge from '../shared/StatusBadge';
import { Paperclip, Bell } from 'lucide-react';

export default function StudentRoster() {
  const { students, assignments, getStudentSubmission, addToast } = useApp();
  const [selectedAssignment, setSelectedAssignment] = useState('a04');

  // Active assignments for filter (show all)
  const activeAssignments = assignments;

  // Get selected assignment details
  const currentAssignment = assignments.find((a) => a.id === selectedAssignment);

  // Calculate overall progress for each student
  const getStudentProgress = (studentId) => {
    const totalActive = activeAssignments.length;
    const submitted = activeAssignments.filter((a) => {
      const sub = getStudentSubmission(studentId, a.id);
      return sub?.status === 'submitted';
    }).length;
    return { submitted, total: totalActive, percentage: totalActive > 0 ? Math.round((submitted / totalActive) * 100) : 0 };
  };

  // Count stats for current assignment
  const stats = {
    submitted: students.filter((s) => getStudentSubmission(s.id, selectedAssignment)?.status === 'submitted').length,
    inProgress: students.filter((s) => getStudentSubmission(s.id, selectedAssignment)?.status === 'in-progress').length,
    missing: students.filter((s) => {
      const sub = getStudentSubmission(s.id, selectedAssignment);
      return !sub || sub.status === 'missing';
    }).length,
  };

  const handleSendReminder = (studentName) => {
    addToast(`Reminder sent to ${studentName}!`, 'info');
  };

  return (
    <section className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-heading text-lg font-semibold text-on-surface">
            Student Submission Roster
          </h2>
          <p className="text-xs text-on-surface-secondary mt-0.5">
            Real-time submission status and individual progress tracking
          </p>
        </div>

        {/* Quick Metrics + Assignment Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Metrics */}
          <div className="flex items-center gap-2 bg-surface-hover px-3 py-1.5 rounded-xl border border-surface-border text-[10px] font-semibold">
            <span className="flex items-center gap-1 text-success">
              <span className="w-2 h-2 rounded-full bg-success" /> {stats.submitted} Submitted
            </span>
            <span className="text-surface-dim">|</span>
            <span className="flex items-center gap-1 text-warning">
              <span className="w-2 h-2 rounded-full bg-warning" /> {stats.inProgress} In Progress
            </span>
            <span className="text-surface-dim">|</span>
            <span className="flex items-center gap-1 text-danger">
              <span className="w-2 h-2 rounded-full bg-danger" /> {stats.missing} Missing
            </span>
          </div>

          {/* Assignment Selector */}
          <div className="relative group">
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="appearance-none text-xs font-semibold bg-white dark:bg-surface-card text-on-surface pl-4 pr-10 py-2 rounded-2xl border border-surface-border/60 hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all cursor-pointer"
            >
              {activeAssignments.map((a) => (
                <option key={a.id} value={a.id}>
                  Module {a.moduleNumber}: {a.title.substring(0, 30)}...
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-secondary group-hover:text-primary transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-surface-card rounded-3xl shadow-lg shadow-black/5 overflow-hidden border border-surface-border/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-hover text-on-surface-secondary text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-5">Section</th>
                <th className="py-3.5 px-5 w-44">Overall Progress</th>
                <th className="py-3.5 px-5">
                  {currentAssignment ? `${currentAssignment.title.substring(0, 20)}... Status` : 'Status'}
                </th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-sm">
              {students.map((student, i) => {
                const submission = getStudentSubmission(student.id, selectedAssignment);
                const progress = getStudentProgress(student.id);
                const subStatus = submission?.status || 'missing';

                return (
                  <tr
                    key={student.id}
                    className={`animate-fade-in stagger-${Math.min(i + 1, 6)} hover:bg-surface-hover/50 transition-colors`}
                  >
                    {/* Student Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          className="w-10 h-10 rounded-full bg-surface-dim object-cover shadow-sm shrink-0 border border-surface-border/50"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div style={{display: 'none'}} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-primary-500 items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-semibold text-on-surface block text-sm leading-tight">
                            {student.name}
                          </span>
                          <span className="text-[10px] font-mono text-on-surface-secondary">
                            {student.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Section */}
                    <td className="py-3.5 px-5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-hover text-on-surface border border-surface-border">
                        {student.section}
                      </span>
                    </td>

                    {/* Progress Bar */}
                    <td className="py-3.5 px-5">
                      <ProgressBar
                        value={progress.percentage}
                        size="sm"
                        color="auto"
                        showLabel
                        label="Progress"
                      />
                    </td>

                    {/* Submission Status */}
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={subStatus} />
                        {submission?.submittedAt && (
                          <span className="text-[10px] font-mono text-on-surface-secondary flex items-center gap-1">
                            <Paperclip className="w-3 h-3" /> {submission.fileName || 'Uploaded'}
                            {submission.fileSize && ` (${submission.fileSize})`}
                          </span>
                        )}
                        {subStatus === 'in-progress' && (
                          <span className="text-[10px] text-on-surface-secondary">
                            Draft in progress
                          </span>
                        )}
                        {subStatus === 'missing' && (
                          <span className="text-[10px] text-danger font-medium">
                            No submission detected
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {subStatus === 'submitted' && !submission?.grade && (
                          <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-primary-100 text-primary-800 hover:bg-primary-200 transition-all border border-primary-200">
                            Grade / Feedback
                          </button>
                        )}
                        {subStatus === 'submitted' && submission?.grade && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-surface-hover text-on-surface-secondary border border-surface-border">
                            Graded ({submission.grade})
                          </span>
                        )}
                        {(subStatus === 'in-progress' || subStatus === 'missing') && (
                          <>
                            <button
                              onClick={() => handleSendReminder(student.name)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-warning-light text-warning-dark hover:bg-warning hover:text-white transition-all border border-warning/30"
                            >
                              <Bell className="w-3 h-3" /> Remind
                            </button>
                            {subStatus === 'missing' && (
                              <button className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-surface-hover text-on-surface-secondary hover:bg-surface-dim transition-all border border-surface-border">
                                Extension
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 bg-surface-hover flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-surface-secondary border-t border-surface-border">
          <span>Showing {students.length} of {students.length} enrolled students</span>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="px-2.5 py-1 rounded-lg bg-surface-card text-on-surface shadow-sm border border-surface-border disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-[10px] font-mono px-2">Page 1 of 1</span>
            <button
              disabled
              className="px-2.5 py-1 rounded-lg bg-surface-card text-on-surface shadow-sm border border-surface-border disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
