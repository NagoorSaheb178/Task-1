/**
 * FilterBar - Assignment filter chips + sort controls for student view
 */
import { useState } from 'react';

export default function FilterBar({ assignments, onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'All Assignments', count: assignments.length },
    {
      key: 'pending',
      label: 'Pending',
      count: assignments.filter(
        (a) => a.status === 'pending' && (!a.submission || a.submission.status !== 'submitted')
      ).length,
    },
    {
      key: 'submitted',
      label: 'Submitted',
      count: assignments.filter(
        (a) => a.status === 'submitted' || a.submission?.status === 'submitted'
      ).length,
    },
    {
      key: 'graded',
      label: 'Graded',
      count: assignments.filter((a) => a.status === 'graded' || a.status === 'archived').length,
    },
  ];

  const handleFilter = (key) => {
    setActiveFilter(key);
    onFilterChange(key);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleFilter(filter.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${activeFilter === filter.key
                ? 'bg-on-surface text-white shadow-md'
                : 'bg-surface-card text-on-surface-secondary hover:bg-surface-hover hover:text-on-surface border border-surface-border'
              }`}
          >
            {filter.label}
            <span className={`ml-1.5 ${activeFilter === filter.key ? 'opacity-70' : 'opacity-50'}`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <span className="text-[10px] font-mono text-on-surface-secondary hidden sm:inline">
          Sort: Due date
        </span>
        <button className="p-2 rounded-xl bg-surface-card text-on-surface-secondary hover:text-on-surface shadow-sm border border-surface-border transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
