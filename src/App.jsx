/**
 * App.jsx - Root component with layout, routing, and role-based view switching
 * Passes activeSection to pages so sidebar navigation works
 */
import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import ToastContainer from './components/shared/Toast';

function DashboardRouter() {
  const { role, isAuthenticated } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Reset to dashboard when role changes
  useEffect(() => {
    setActiveSection('dashboard');
    setSidebarOpen(false);
  }, [role]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface font-sans">
        <LoginPage />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-sans">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onNavigate={(section) => {
          setActiveSection(section);
          setSidebarOpen(false);
        }}
      />

      {/* Main Content — pl-64 only on lg+ where sidebar is visible */}
      <div className="lg:pl-64 transition-all duration-300">
        <main className="pt-20 min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6 pb-20">
          {role === 'student' ? (
            <StudentDashboard activeSection={activeSection} />
          ) : (
            <AdminDashboard activeSection={activeSection} />
          )}
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardRouter />
    </AppProvider>
  );
}
