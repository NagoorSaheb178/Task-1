import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, BookOpen, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('ananya.reddy@iitb.ac.in');
  const [password, setPassword] = useState('password123');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'student') {
      setEmail('ananya.reddy@iitb.ac.in');
      setPassword('password123');
    } else {
      setEmail('priya.sharma@beacon.edu');
      setPassword('admin123');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      login(role);
    }, 600); // Simulate network delay
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-100/40 rounded-full blur-3xl" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] bg-primary-50/60 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <img 
            src="/app-logo.png" 
            alt="Logo" 
            className="w-32 h-auto mx-auto rounded-3xl object-cover shadow-2xl shadow-primary/20 mb-6 animate-scale-in"
          />
          <h1 className="font-heading text-3xl font-bold text-on-surface mb-2 animate-fade-in stagger-1">
            Vidya Kendra
          </h1>
          <p className="text-sm text-on-surface-secondary animate-fade-in stagger-2">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="bg-surface-card rounded-2xl p-6 sm:p-8 shadow-xl shadow-surface-border/50 border border-surface-border animate-fade-in stagger-3">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  role === 'student'
                    ? 'border-primary bg-primary-50 text-primary shadow-sm shadow-primary/10'
                    : 'border-surface-border bg-surface hover:bg-surface-hover text-on-surface-secondary'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-xs font-semibold">Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  role === 'admin'
                    ? 'border-primary bg-primary-50 text-primary shadow-sm shadow-primary/10'
                    : 'border-surface-border bg-surface hover:bg-surface-hover text-on-surface-secondary'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-semibold">Faculty</span>
              </button>
            </div>

            {/* Mock Credentials Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface text-sm text-on-surface rounded-xl p-3 border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface text-sm text-on-surface rounded-xl p-3 border border-surface-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-md shadow-primary/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
