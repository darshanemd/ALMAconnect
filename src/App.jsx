import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Resilient dynamic import that automatically recovers from stale Vercel chunk hashes
function lazyWithRetry(componentImport) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      const errorMsg = String(error?.message || '').toLowerCase();
      const isChunkError = 
        errorMsg.includes('failed to fetch dynamically imported module') ||
        errorMsg.includes('importing a module script failed') ||
        errorMsg.includes('loading chunk') ||
        errorMsg.includes('unexpected token \'<\'');

      const reloadKey = 'chunk_reload_done';
      const alreadyReloaded = window.sessionStorage.getItem(reloadKey);

      if (isChunkError && !alreadyReloaded) {
        window.sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
        return new Promise(() => {}); // prevent throwing before reload finishes
      }
      throw error;
    }
  });
}

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages (Lazy Loaded for Initial Speed)
const HomePage = lazyWithRetry(() => import('./pages/public/HomePage'));
const LoginPage = lazyWithRetry(() => import('./pages/public/LoginPage'));
const RegisterPage = lazyWithRetry(() => import('./pages/public/RegisterPage'));

// Private Dispatcher
const DashboardDispatcher = lazyWithRetry(() => import('./pages/DashboardDispatcher'));

// Core & Shared Pages (Lazy-Loaded)
const DirectoryPage = lazyWithRetry(() => import('./pages/alumni/DirectoryPage'));
const JobsPage = lazyWithRetry(() => import('./pages/alumni/JobsPage'));
const EventsPage = lazyWithRetry(() => import('./pages/alumni/EventsPage'));
const BlogPage = lazyWithRetry(() => import('./pages/alumni/BlogPage'));
const BlogPostPage = lazyWithRetry(() => import('./pages/alumni/BlogPostPage'));
const NetworkPage = lazyWithRetry(() => import('./pages/alumni/NetworkPage'));
const MentorshipPage = lazyWithRetry(() => import('./pages/alumni/MentorshipPage'));
const SmartCardPage = lazyWithRetry(() => import('./pages/alumni/SmartCardPage'));
const SurveysPage = lazyWithRetry(() => import('./pages/alumni/SurveysPage'));
const ProfilePage = lazyWithRetry(() => import('./pages/alumni/ProfilePage'));
const CircularsPage = lazyWithRetry(() => import('./pages/alumni/CircularsPage'));
const CollegeProfilePage = lazyWithRetry(() => import('./pages/college/CollegeProfilePage'));
const VerificationPage = lazyWithRetry(() => import('./pages/college/VerificationPage'));
const SettingsPage = lazyWithRetry(() => import('./pages/SettingsPage'));

// Specialized Student & College Pages (Lazy-Loaded)
const ResumeAnalyzerPage = lazyWithRetry(() => import('./pages/student/ResumeAnalyzerPage'));
const SkillGapPage = lazyWithRetry(() => import('./pages/student/SkillGapPage'));
const PlacementPredictorPage = lazyWithRetry(() => import('./pages/student/PlacementPredictorPage'));
const ComplaintsPage = lazyWithRetry(() => import('./pages/student/ComplaintsPage'));
const CSVUploadPage = lazyWithRetry(() => import('./pages/college/CSVUploadPage'));
const SurveyBuilderPage = lazyWithRetry(() => import('./pages/college/SurveyBuilderPage'));
const ComplaintsAdminPage = lazyWithRetry(() => import('./pages/college/ComplaintsAdminPage'));

// Route Fallback Loading Spinner
function PageFallback() {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[350px] animate-fade-in">
      <div className="skeleton skeleton-avatar mb-3" style={{ width: 48, height: 48 }}></div>
      <div className="skeleton skeleton-title" style={{ width: 160 }}></div>
      <p className="text-xs text-secondary mt-2">Loading module...</p>
    </div>
  );
}

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="skeleton skeleton-avatar" style={{ width: 48, height: 48 }}></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Catch-all intelligent redirect
function CatchAllRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageFallback />;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardDispatcher />} />
            
            {/* Alumni & Student Shared Routes */}
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/blogs/:id" element={<BlogPostPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/messages" element={<Navigate to="/network" replace />} />
            <Route path="/message" element={<Navigate to="/network" replace />} />
            <Route path="/mentorship" element={<MentorshipPage />} />
            <Route path="/card" element={<SmartCardPage />} />
            <Route path="/surveys" element={<SurveysPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/circulars" element={<CircularsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/complaints" element={<Navigate to="/student/complaints" replace />} />

            {/* Specialized AI & Career Tools (Accessible to Students, Alumni & Admins) */}
            <Route path="/student/resume-analyzer" element={
              <ProtectedRoute allowedRoles={['student', 'alumni', 'college_admin', 'admin']}>
                <ResumeAnalyzerPage />
              </ProtectedRoute>
            } />
            <Route path="/resume-analyzer" element={<Navigate to="/student/resume-analyzer" replace />} />

            <Route path="/student/skill-gap" element={
              <ProtectedRoute allowedRoles={['student', 'alumni', 'college_admin', 'admin']}>
                <SkillGapPage />
              </ProtectedRoute>
            } />
            <Route path="/skill-gap" element={<Navigate to="/student/skill-gap" replace />} />

            <Route path="/student/placement-predictor" element={
              <ProtectedRoute allowedRoles={['student', 'alumni', 'college_admin', 'admin']}>
                <PlacementPredictorPage />
              </ProtectedRoute>
            } />
            <Route path="/placement-predictor" element={<Navigate to="/student/placement-predictor" replace />} />
            <Route path="/placement" element={<Navigate to="/student/placement-predictor" replace />} />
            <Route path="/predictor" element={<Navigate to="/student/placement-predictor" replace />} />

            <Route path="/student/complaints" element={
              <ProtectedRoute allowedRoles={['student', 'alumni']}>
                <ComplaintsPage />
              </ProtectedRoute>
            } />

            {/* College Admin Specific Routes */}
            <Route path="/college/profile" element={
              <ProtectedRoute allowedRoles={['college_admin']}>
                <CollegeProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/verification" element={
              <ProtectedRoute allowedRoles={['college_admin']}>
                <VerificationPage />
              </ProtectedRoute>
            } />
            <Route path="/csv-upload" element={
              <ProtectedRoute allowedRoles={['college_admin']}>
                <CSVUploadPage />
              </ProtectedRoute>
            } />
            <Route path="/survey-builder" element={
              <ProtectedRoute allowedRoles={['college_admin']}>
                <SurveyBuilderPage />
              </ProtectedRoute>
            } />
            <Route path="/college/complaints" element={
              <ProtectedRoute allowedRoles={['college_admin']}>
                <ComplaintsAdminPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<CatchAllRoute />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  </BrowserRouter>
  );
}
