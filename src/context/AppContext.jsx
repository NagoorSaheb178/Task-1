import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  STUDENTS,
  CURRENT_STUDENT,
  COURSES,
} from '../data/mockData';

const AppContext = createContext(null);

// ===== Custom hook for localStorage persistence =====
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// ===== App Provider =====
export function AppProvider({ children }) {
  const [role, setRole] = useLocalStorage('dashboard-role', 'student');
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('dashboard-auth', false);
  const [assignments, setAssignments] = useLocalStorage('dashboard-assignments-v3', INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useLocalStorage('dashboard-submissions-v3', INITIAL_SUBMISSIONS);
  const [toasts, setToasts] = useState([]);

  const course = COURSES[0];
  const students = STUDENTS;
  const currentStudent = CURRENT_STUDENT;

  // ===== Toast System =====
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // ===== Student Actions =====
  const submitAssignment = useCallback((assignmentId) => {
    // Update assignment status
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'submitted',
              submittedAt: new Date().toISOString(),
              receiptId: `BC-${Math.floor(10000 + Math.random() * 90000)}`,
            }
          : a
      )
    );

    // Create submission record
    const newSubmission = {
      studentId: currentStudent.id,
      assignmentId,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      fileName: `${currentStudent.name.toLowerCase().replace(' ', '_')}_submission.zip`,
      fileSize: `${(Math.random() * 20 + 5).toFixed(1)} MB`,
    };

    setSubmissions((prev) => [...prev.filter((s) => !(s.studentId === currentStudent.id && s.assignmentId === assignmentId)), newSubmission]);

    addToast(`Assignment submitted successfully! Receipt generated.`, 'success');
  }, [currentStudent, setAssignments, setSubmissions, addToast]);

  // ===== Admin Actions =====
  const createAssignment = useCallback((assignmentData) => {
    const newAssignment = {
      id: `a${String(assignments.length + 1).padStart(2, '0')}`,
      moduleNumber: String(assignments.length + 1).padStart(2, '0'),
      ...assignmentData,
      courseId: 'cs342',
      status: 'upcoming',
      requireDoubleVerification: assignmentData.requireDoubleVerification ?? true,
      createdBy: 'admin',
    };

    setAssignments((prev) => [...prev, newAssignment]);
    addToast(`"${assignmentData.title}" published to course!`, 'success');
    return newAssignment;
  }, [assignments, setAssignments, addToast]);

  const deleteAssignment = useCallback((assignmentId) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    setSubmissions((prev) => prev.filter((s) => s.assignmentId !== assignmentId));
    addToast('Assignment removed.', 'info');
  }, [setAssignments, setSubmissions, addToast]);

  // ===== Computed Values =====
  const getAssignmentSubmissions = useCallback((assignmentId) => {
    return submissions.filter((s) => s.assignmentId === assignmentId);
  }, [submissions]);

  const getStudentSubmission = useCallback((studentId, assignmentId) => {
    return submissions.find((s) => s.studentId === studentId && s.assignmentId === assignmentId);
  }, [submissions]);

  const getAssignmentStats = useCallback((assignmentId) => {
    const subs = getAssignmentSubmissions(assignmentId);
    const submitted = subs.filter((s) => s.status === 'submitted').length;
    const inProgress = subs.filter((s) => s.status === 'in-progress').length;
    const missing = students.length - submitted - inProgress;
    return {
      total: students.length,
      submitted,
      inProgress,
      missing,
      percentage: Math.round((submitted / students.length) * 100),
    };
  }, [getAssignmentSubmissions, students]);

  // Student-specific computed values
  const studentAssignments = assignments.map((a) => {
    const sub = getStudentSubmission(currentStudent.id, a.id);
    return { ...a, submission: sub };
  });

  const studentProgress = {
    total: assignments.filter((a) => a.status !== 'upcoming').length,
    submitted: studentAssignments.filter(
      (a) => a.status === 'submitted' || a.status === 'graded' || a.status === 'archived' || a.submission?.status === 'submitted'
    ).length,
    pending: studentAssignments.filter(
      (a) => a.status === 'pending' && (!a.submission || a.submission.status !== 'submitted')
    ).length,
    inReview: studentAssignments.filter((a) => a.status === 'submitted' && a.submission?.status === 'submitted').length,
  };

  const completionPercentage = studentProgress.total > 0
    ? Math.round((studentProgress.submitted / assignments.length) * 100)
    : 0;

  // ===== Reset to defaults =====
  const resetData = useCallback(() => {
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    addToast('Data reset to defaults.', 'info');
  }, [setAssignments, setSubmissions, addToast]);

  // ===== Auth Actions =====
  const login = useCallback((selectedRole) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    addToast(`Logged in as ${selectedRole}`, 'success');
  }, [setRole, setIsAuthenticated, addToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    addToast('Logged out successfully', 'info');
  }, [setIsAuthenticated, addToast]);

  const value = {
    // State
    role,
    setRole,
    assignments,
    submissions,
    students,
    currentStudent,
    course,
    toasts,

    // Actions
    submitAssignment,
    createAssignment,
    deleteAssignment,
    addToast,
    resetData,
    login,
    logout,
    isAuthenticated,

    // Computed
    getAssignmentSubmissions,
    getStudentSubmission,
    getAssignmentStats,
    studentAssignments,
    studentProgress,
    completionPercentage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ===== Hook to consume context =====
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
