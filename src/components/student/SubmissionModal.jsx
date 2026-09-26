/**
 * SubmissionModal - Double-verification flow for assignment submission
 * Step 1: Verify Drive folder link
 * Step 2: Confirm checkbox ("Yes, I have submitted")
 * Step 3: Final confirmation with warning
 */
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Link2, AlertTriangle, Lock } from 'lucide-react';

export default function SubmissionModal({ assignment, isOpen, onClose }) {
  const { submitAssignment } = useApp();
  const [step, setStep] = useState(1);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !assignment) return null;

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    // Simulate a short processing delay
    setTimeout(() => {
      submitAssignment(assignment.id);
      setIsSubmitting(false);
      setStep(1);
      setIsChecked(false);
      onClose();
    }, 1200);
  };

  const handleClose = () => {
    setStep(1);
    setIsChecked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-card shadow-2xl overflow-hidden animate-scale-in border border-surface-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.1em] text-primary font-bold block">
                Verification Protocol
              </span>
              <h3 className="font-heading text-lg font-semibold text-on-surface">
                Confirm Submission
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-on-surface-secondary hover:text-on-surface hover:bg-surface-hover transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-surface-dim text-on-surface-muted'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-all ${step > s ? 'bg-primary' : 'bg-surface-dim'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 pb-2">
          {/* Step 1: Drive Folder Verification */}
          {step === 1 && (
            <div className="animate-fade-in space-y-4">
              <div className="p-4 rounded-xl bg-surface-hover border border-surface-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-secondary font-bold">
                    Step 1 • Drive Location
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-dim text-on-surface-secondary">
                    Folder Assigned
                  </span>
                </div>
                <p className="text-xs text-on-surface-secondary mb-3">
                  Confirm your files are uploaded to the designated Google Drive folder:
                </p>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-card shadow-sm border border-surface-border">
                  <div className="flex items-center gap-2 min-w-0">
                    <Link2 className="w-4 h-4 text-primary" />
                    <a
                      href={assignment.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-primary hover:underline truncate"
                    >
                      {assignment.driveLink}
                    </a>
                  </div>
                  <a
                    href={assignment.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-on-surface-secondary hover:text-on-surface p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
              <p className="text-xs text-on-surface-secondary">
                Assignment: <strong className="text-on-surface">{assignment.title}</strong>
              </p>
            </div>
          )}

          {/* Step 2: Confirmation Checkbox */}
          {step === 2 && (
            <div className="animate-fade-in space-y-4">
              <div
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-success-light/40 border-success'
                    : 'bg-surface-hover border-surface-border hover:border-primary/30'
                }`}
                onClick={() => setIsChecked(!isChecked)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded accent-primary cursor-pointer"
                    id="verify-checkbox"
                  />
                  <label htmlFor="verify-checkbox" className="cursor-pointer">
                    <span className="text-sm font-semibold text-on-surface block mb-1">
                      Step 2 • Work Confirmation
                    </span>
                    <span className="text-xs text-on-surface-secondary leading-relaxed">
                      Yes, I have submitted my completed work into the designated Google Drive
                      folder. My files match all repository packaging naming conventions and I
                      have verified all deliverables are included.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Final Warning & Confirm */}
          {step === 3 && (
            <div className="animate-fade-in space-y-4">
              <div className="p-4 rounded-xl bg-warning-light/60 border border-warning/30">
                <div className="flex items-center gap-2 text-warning-dark font-semibold text-sm mb-2">
                  <AlertTriangle className="w-4 h-4" /> Step 3 • Permanent Timestamp
                </div>
                <p className="text-xs text-warning-dark/80 leading-relaxed">
                  This action timestamps your submission and notifies the course professor.
                  Once submitted, changes require formal instructor unlock permission and will
                  log a revision audit trail.
                </p>
                <div className="flex items-center gap-3 pt-2 text-[10px] font-mono text-warning-dark/70">
                  <span>Student: <strong>{assignment.title}</strong></span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-hover border border-surface-border">
                <p className="text-xs text-on-surface-secondary">
                  Submission time: <strong className="text-on-surface">
                    {new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between p-6 pt-4 border-t border-surface-border mt-2">
          <button
            onClick={step === 1 ? handleClose : () => setStep(step - 1)}
            className="px-4 py-2.5 rounded-xl text-on-surface-secondary hover:text-on-surface hover:bg-surface-hover text-sm font-medium transition-colors"
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && !isChecked}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                step === 2 && !isChecked
                  ? 'bg-surface-dim text-on-surface-muted cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20 hover:shadow-lg'
              }`}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark shadow-md shadow-primary/20 hover:shadow-lg transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Finalize Submission
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
