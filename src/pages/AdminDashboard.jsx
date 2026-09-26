/**
 * AdminDashboard - Main admin/professor view page
 * Renders different content based on activeSection from sidebar navigation
 * Sections: dashboard, assignments, roster, analytics
 */
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import AssignmentOverview from '../components/admin/AssignmentOverview';
import StudentRoster from '../components/admin/StudentRoster';
import CreateAssignmentDrawer from '../components/admin/CreateAssignmentDrawer';
import { Download, Plus, LineChart, BarChart2 } from 'lucide-react';

export default function AdminDashboard({ activeSection }) {
  const { course, students, assignments, submissions, getAssignmentStats } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sectionFilter, setSectionFilter] = useState('all');

  // --- Calculations for Analytics ---
  const submissionTrendsData = assignments
    .slice(0, 7)
    .map(a => ({
      label: `Mod ${parseInt(a.moduleNumber, 10)}`,
      value: getAssignmentStats(a.id).percentage
    }));

  const gradedSubmissions = submissions.filter(s => s.grade != null);
  const totalGrades = gradedSubmissions.length;
  const avgGrade = totalGrades > 0
    ? (gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) / totalGrades).toFixed(1)
    : 0;

  let gradesCount = { A: 0, B: 0, C: 0, DF: 0 };
  gradedSubmissions.forEach(s => {
    if (s.grade >= 90) gradesCount.A++;
    else if (s.grade >= 80) gradesCount.B++;
    else if (s.grade >= 70) gradesCount.C++;
    else gradesCount.DF++;
  });

  const gradeDist = [
    { label: 'A', legend: 'A', percentage: totalGrades ? Math.round((gradesCount.A / totalGrades) * 100) : 0, colorClass: 'text-[#059669]', bgClass: 'bg-[#059669]' },
    { label: 'B', legend: 'B', percentage: totalGrades ? Math.round((gradesCount.B / totalGrades) * 100) : 0, colorClass: 'text-[#4f46e5]', bgClass: 'bg-[#4f46e5]' },
    { label: 'C', legend: 'C', percentage: totalGrades ? Math.round((gradesCount.C / totalGrades) * 100) : 0, colorClass: 'text-[#d97706]', bgClass: 'bg-[#d97706]' },
    { label: 'D/F', legend: 'D/F', percentage: totalGrades ? Math.round((gradesCount.DF / totalGrades) * 100) : 0, colorClass: 'text-[#dc2626]', bgClass: 'bg-[#dc2626]' },
  ];

  // ===== Welcome Header (shared across sections) =====
  const WelcomeHeader = ({ title = "Faculty Course Management", subtitle = "" }) => (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 lg:mb-8">
      <div>
        <div className="flex items-center gap-2.5 text-[10px] font-extrabold uppercase tracking-[0.2em] bg-success-light/40 text-success-dark border border-success/20 px-3 py-1 rounded-full shadow-sm mb-3 w-max">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
          {title}
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface tracking-tight">
          Prof. Priya Sharma <span className="font-normal text-on-surface-secondary/50 mx-1">•</span> {course.code}
        </h1>
        <p className="text-sm text-on-surface-secondary mt-1 font-medium">
          {subtitle || `${course.term} • ${students.length} Students • ${course.sections.join(', ')}`}
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="flex-1 lg:flex-none text-xs bg-surface-card text-on-surface px-3 py-2 rounded-xl border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="all">All Sections</option>
          {course.sections.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button className="flex-1 lg:flex-none inline-flex justify-center items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-surface-card text-on-surface hover:bg-surface-hover border border-surface-border shadow-sm transition-all">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>

        <button
          onClick={() => setDrawerOpen(true)}
          className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20 transition-all mt-2 sm:mt-0"
        >
          <Plus className="w-3.5 h-3.5" /> Create Assignment
        </button>
      </div>
    </div>
  );

  // ===== SECTION: Dashboard (default) =====
  if (activeSection === 'dashboard') {
    return (
      <div className="flex flex-col w-full max-w-7xl mx-auto">
        <WelcomeHeader />

        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
          <div className="animate-fade-in stagger-1 bg-surface-card rounded-2xl p-4 sm:p-5 border border-surface-border shadow-sm card-hover">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-secondary font-bold block mb-1 truncate">
              Total Assignments
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
                {assignments.length}
              </span>
              <span className="text-[10px] sm:text-xs text-on-surface-secondary hidden sm:inline">published</span>
            </div>
          </div>
          <div className="animate-fade-in stagger-2 bg-surface-card rounded-2xl p-4 sm:p-5 border border-surface-border shadow-sm card-hover">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-secondary font-bold block mb-1 truncate">
              Enrolled Students
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
                {students.length}
              </span>
              <span className="text-[10px] sm:text-xs text-on-surface-secondary hidden sm:inline">active</span>
            </div>
          </div>
          <div className="animate-fade-in stagger-3 bg-surface-card rounded-2xl p-4 sm:p-5 border border-surface-border shadow-sm card-hover">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-secondary font-bold block mb-1 truncate">
              Active Assignments
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                {assignments.filter((a) => a.status === 'pending').length}
              </span>
              <span className="text-[10px] sm:text-xs text-on-surface-secondary hidden sm:inline">in progress</span>
            </div>
          </div>
          <div className="animate-fade-in stagger-4 bg-surface-card rounded-2xl p-4 sm:p-5 border border-surface-border shadow-sm card-hover">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-secondary font-bold block mb-1 truncate">
              Avg. Submission Rate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-success">
                93%
              </span>
              <span className="text-[10px] sm:text-xs text-on-surface-secondary hidden sm:inline">this term</span>
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
          {/* Submission Trends Chart */}
          <div className="bg-white dark:bg-surface-card rounded-3xl p-6 sm:p-8 border border-surface-border/60 shadow-lg shadow-black/5 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-heading text-lg font-bold text-on-surface">Submission Trends</h3>
                <p className="text-xs text-on-surface-secondary mt-1 font-medium">Completion rates per module</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#ede9fe] text-[#4f46e5]">
                <LineChart className="w-5 h-5" />
              </div>
            </div>

            {/* Mock Vertical Bar Chart */}
            <div className="h-[220px] flex items-end justify-between gap-2 mt-4 px-2">
              {submissionTrendsData.map((data, i) => (
                <div key={i} className="flex flex-col items-center gap-3 group flex-1">
                  <div className="w-full relative flex items-end justify-center h-[180px]">
                    <div
                      className="w-full max-w-[28px] bg-[#7c3aed] rounded-full transition-all duration-500 hover:bg-[#6d28d9]"
                      style={{ height: `${data.value}%` }}
                    >
                      <div className="opacity-0 hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {data.value}%
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-medium text-on-surface-secondary">{data.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="bg-white dark:bg-surface-card rounded-3xl p-6 sm:p-8 border border-surface-border/60 shadow-lg shadow-black/5 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-heading text-lg font-bold text-on-surface">Grade Distribution</h3>
                <p className="text-xs text-on-surface-secondary mt-1 font-medium">Average scores across term</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#d1fae5] text-[#059669]">
                <BarChart2 className="w-5 h-5" />
              </div>
            </div>
            {/* Circular Donut Chart */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mt-6 mb-6">
              <div className="relative w-40 h-40 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-sm">
                  {/* Background track */}
                  <circle cx="50" cy="50" r="40" fill="none" strokeWidth="16" className="stroke-surface-hover" />
                  {(() => {
                    let cumulative = 0;
                    const radius = 40;
                    const circum = 2 * Math.PI * radius;
                    return gradeDist.map((grade, i) => {
                      if (grade.percentage === 0) return null;
                      const strokeDasharray = `${(grade.percentage / 100) * circum} ${circum}`;
                      const strokeDashoffset = -(cumulative / 100) * circum;
                      cumulative += grade.percentage;
                      return (
                        <circle
                          key={i}
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="none"
                          strokeWidth="16"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className={`stroke-current ${grade.colorClass} transition-all duration-1000 ease-out`}
                          strokeLinecap={grade.percentage > 0 ? "round" : "butt"}
                        />
                      );
                    });
                  })()}
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-heading font-bold text-on-surface leading-none mt-1">{avgGrade}</span>
                  <span className="text-[10px] text-on-surface-secondary uppercase tracking-widest font-bold mt-1">Avg</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-3 min-w-[140px]">
                {gradeDist.map((grade, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${grade.bgClass} shadow-sm`} />
                      <span className="text-xs font-bold text-on-surface">{grade.legend}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-on-surface-secondary bg-surface-hover px-2.5 py-0.5 rounded-md">
                      {grade.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto p-4 rounded-2xl bg-[#f8fafc] text-center flex flex-col sm:flex-row items-center justify-center gap-3">
              <p className="text-[13px] text-on-surface-secondary font-medium">
                Class performance is holding strong.
              </p>
              <span className="px-2.5 py-1 bg-[#d1fae5] text-[#059669] rounded-md text-[10px] font-bold">
                ↑ 3.2% vs last term
              </span>
            </div>
          </div>
        </div>

        {/* Create Assignment Drawer */}
        <CreateAssignmentDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    );
  }

  // ===== SECTION: Manage Assignments =====
  if (activeSection === 'assignments') {
    return (
      <div className="flex flex-col w-full max-w-7xl mx-auto">
        <WelcomeHeader title="Assignment Management" subtitle="Manage all course assignments, rubrics, and deadlines" />
        <AssignmentOverview />
        <CreateAssignmentDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    );
  }

  // ===== SECTION: Student Roster =====
  if (activeSection === 'roster') {
    return (
      <div className="flex flex-col w-full max-w-7xl mx-auto">
        <WelcomeHeader title="Student Roster & Tracking" subtitle="Monitor individual student progress and submissions" />
        <StudentRoster />
        <CreateAssignmentDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    );
  }



  // Fallback
  return null;
}
