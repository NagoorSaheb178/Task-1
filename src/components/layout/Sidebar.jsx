/**
 * Sidebar - Left navigation with role-based menu items
 */
import { useApp } from '../../context/AppContext';
import { 
  LogOut, 
  LayoutDashboard, 
  ClipboardList, 
  TrendingUp, 
  Users, 
  LineChart,
  Settings
} from 'lucide-react';

const STUDENT_NAV = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, hoverAnim: 'animate-icon-jelly' },
  { id: 'assignments', label: 'My Assignments', Icon: ClipboardList, hoverAnim: 'animate-icon-bounce' },
  { id: 'progress', label: 'My Progress', Icon: TrendingUp, hoverAnim: 'animate-icon-wiggle' },
];

const ADMIN_NAV = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, hoverAnim: 'animate-icon-jelly' },
  { id: 'assignments', label: 'Manage Assignments', Icon: ClipboardList, hoverAnim: 'animate-icon-bounce' },
  { id: 'roster', label: 'Student Roster', Icon: Users, hoverAnim: 'animate-icon-pop' },
];

export default function Sidebar({ isOpen, onClose, activeSection, onNavigate }) {
  const { role, logout, currentStudent, course } = useApp();

  const navItems = role === 'student' ? STUDENT_NAV : ADMIN_NAV;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-card z-40 flex flex-col pt-20 pb-6 border-r border-surface-border transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Section Label */}
        <div className="px-6 py-2 mb-2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-on-surface-muted font-bold">
            {role === 'student' ? 'Student Portal' : 'Faculty Management'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-on-surface-secondary hover:bg-surface-hover hover:text-on-surface'
                  }`}
              >
                <item.Icon className={`w-[18px] h-[18px] shrink-0 transition-transform ${item.hoverAnim}`} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 mt-auto pt-4 flex flex-col gap-2 border-t border-surface-border/50">

          {/* Profile Section */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover/50 border border-surface-border/50 mb-2">
            <img
              src={role === 'student' ? currentStudent.avatar : 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProfPriya'}
              alt="Profile"
              className="w-10 h-10 rounded-full bg-surface-dim object-cover border border-surface-border"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface truncate">
                {role === 'student' ? currentStudent.name : course.professor}
              </p>
              <p className="text-[10px] text-on-surface-secondary truncate">
                {role === 'student' ? currentStudent.email : 'priya.sharma@iitb.ac.in'}
              </p>
            </div>
            <button
              onClick={() => { }}
              className="group p-1.5 rounded-lg text-on-surface-secondary hover:text-primary hover:bg-primary-50 transition-colors"
              title="Edit Profile"
            >
              <Settings className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger-light/50 transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px] animate-[pulse_3s_ease-in-out_infinite] transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
