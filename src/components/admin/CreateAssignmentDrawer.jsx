/**
 * CreateAssignmentDrawer - Slide-over drawer for creating new assignments
 * Includes: title, module, due date, Drive link, description, double-verification toggle
 */
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileEdit, Cloud, Check, Lock, Send } from 'lucide-react';

export default function CreateAssignmentDrawer({ isOpen, onClose }) {
  const { createAssignment } = useApp();
  const [isPublishing, setIsPublishing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalPoints: 100,
    weight: '15%',
    driveLink: '',
    requireDoubleVerification: true,
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePublish = () => {
    if (!formData.title.trim()) return;

    setIsPublishing(true);
    setTimeout(() => {
      createAssignment({
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        totalPoints: formData.totalPoints,
        weight: formData.weight,
        driveLink: formData.driveLink,
        requireDoubleVerification: formData.requireDoubleVerification,
      });
      setIsPublishing(false);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        totalPoints: 100,
        weight: '15%',
        driveLink: '',
        requireDoubleVerification: true,
      });
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-surface-card shadow-2xl flex flex-col animate-slide-in-right border-l border-surface-border">
        {/* Header */}
        <div className="p-6 bg-surface-hover border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-on-surface">
                Create New Assignment
              </h2>
              <p className="text-xs text-on-surface-secondary">
                Publish to CS 342 & provision Drive folder
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-on-surface-secondary hover:text-on-surface hover:bg-surface-dim transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form className="p-6 flex-1 overflow-y-auto space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Assignment Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g., Assignment 05: Byzantine Fault Tolerance"
              required
              className="w-full bg-surface-card text-sm text-on-surface rounded-xl p-3 border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 placeholder:text-on-surface-muted transition-all"
            />
          </div>

          {/* Due Date & Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Due Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
                className="w-full bg-surface-card text-sm text-on-surface rounded-xl p-3 border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Total Points
              </label>
              <input
                type="number"
                value={formData.totalPoints}
                onChange={(e) => updateField('totalPoints', parseInt(e.target.value) || 0)}
                className="w-full bg-surface-card text-sm text-on-surface rounded-xl p-3 border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Google Drive Link */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Google Drive Submission Folder URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.driveLink}
                onChange={(e) => updateField('driveLink', e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full bg-surface-card text-xs font-mono text-on-surface rounded-xl pl-10 pr-3 py-3 border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-muted transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-secondary text-sm">
                <Cloud className="w-4 h-4" />
              </span>
              {formData.driveLink && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success text-sm" title="Valid URL">
                  <Check className="w-4 h-4" />
                </span>
              )}
            </div>
            <p className="text-[10px] text-on-surface-secondary mt-1 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Students will submit their work to this folder
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Specification & Rubric Overview
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Enter assignment overview, rubric criteria, deliverables..."
              rows={4}
              className="w-full bg-surface-card text-sm text-on-surface rounded-xl p-3 border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-muted transition-all resize-none"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Grade Weight
            </label>
            <select
              value={formData.weight}
              onChange={(e) => updateField('weight', e.target.value)}
              className="w-full bg-surface-card text-sm text-on-surface rounded-xl p-3 border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all"
            >
              <option value="5%">5%</option>
              <option value="10%">10%</option>
              <option value="12%">12%</option>
              <option value="15%">15%</option>
              <option value="20%">20%</option>
            </select>
          </div>

          {/* Double Verification Toggle */}
          <div className="p-4 bg-surface-hover rounded-xl flex items-start gap-3 border border-surface-border">
            <input
              type="checkbox"
              id="double-verify-toggle"
              checked={formData.requireDoubleVerification}
              onChange={(e) => updateField('requireDoubleVerification', e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-primary rounded cursor-pointer"
            />
            <div className="flex-1">
              <label
                htmlFor="double-verify-toggle"
                className="text-sm font-semibold text-on-surface cursor-pointer block"
              >
                Require Double-Verification
              </label>
              <p className="text-xs text-on-surface-secondary leading-relaxed mt-0.5">
                Students must confirm their submission through a multi-step verification
                flow before it is permanently timestamped.
              </p>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-5 bg-surface-hover border-t border-surface-border flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-surface-card text-on-surface hover:bg-surface-dim border border-surface-border shadow-sm transition-all"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublish}
            disabled={!formData.title.trim() || isPublishing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Publishing...
              </>
            ) : (
              <><Send className="w-4 h-4" /> Publish to Course</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
