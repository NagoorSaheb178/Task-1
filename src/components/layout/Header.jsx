/**
 * Header - Top navigation bar with role switcher, search, and profile
 */
import { useApp } from '../../context/AppContext';
import { useState } from 'react';
import { BookOpen } from 'lucide-react';

export default function Header({ onToggleSidebar }) {
  const { role, course, currentStudent, resetData } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 glass border-b border-surface-border">
      <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-3">
        {/* Left: Logo + Hamburger */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-on-surface-secondary hover:bg-surface-hover transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2.5">
            <img src="/app-logo.png" alt="Logo" className="w-10 h-10 rounded-lg object-cover shadow-sm border border-surface-border" />
            <span className="font-heading font-semibold text-on-surface tracking-tight hidden sm:inline">
              Vidya Kendra
            </span>
          </div>
        </div>

        {/* Center: Course pill + Search */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <div className="hidden md:flex items-center gap-1.5 bg-surface-card px-3 py-1.5 rounded-xl shadow-sm text-sm border border-surface-border">
            <BookOpen className="w-4 h-4 text-on-surface-secondary" />
            <span className="font-mono text-xs font-medium text-on-surface truncate max-w-[200px]">
              {course.code}: {course.name} • {course.term}
            </span>
          </div>
          <div className="relative flex-1 hidden lg:block">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assignments, students..."
              className="w-full bg-surface-card text-sm text-on-surface placeholder:text-on-surface-muted rounded-xl pl-9 pr-3 py-1.5 border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>
        </div>

        {/* Right: Role switcher + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Term Badge */}
          {/* Reset Data */}
          <button
            onClick={resetData}
            className="hidden sm:inline-flex p-2 rounded-xl text-on-surface-secondary hover:bg-surface-hover transition-colors"
            title="Reset mock data"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Notification Bell */}
          <button className="relative p-2 rounded-xl text-on-surface-secondary hover:bg-surface-hover transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-200 to-primary-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {role === 'student' ? currentStudent.name.charAt(0) : 'PS'}
            </div>
            <div className="hidden xl:block">
              <p className="text-xs font-semibold text-on-surface leading-none">
                {role === 'student' ? currentStudent.name : 'Prof. Sharma'}
              </p>
              <p className="text-[10px] text-on-surface-secondary mt-0.5">
                {role === 'student' ? 'Student' : 'Faculty'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
