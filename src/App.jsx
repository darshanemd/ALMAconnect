import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAuth } from './contexts/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages (Lazy Loaded for Initial Speed)
const HomePage = lazy(() => import('./pages/public/HomePage'));
const LoginPage = lazy(() => import('./pages/public/LoginPage'));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'));

// Private Dispatcher
const DashboardDispatcher = lazy(() => import('./pages/DashboardDispatcher'));

// Core & Shared Pages (Lazy-Loaded)
const DirectoryPage = lazy(() => import('./pages/alumni/DirectoryPage'));
const JobsPage = lazy(() => import('./pages/alumni/JobsPage'));
const EventsPage = lazy(() => import('./pages/alumni/EventsPage'));
const BlogPage = lazy(() => import('./pages/alumni/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/alumni/BlogPostPage'));
const NetworkPage = lazy(() => import('./pages/alumni/NetworkPage'));
const MentorshipPage = lazy(() => import('./pages/alumni/MentorshipPage'));
const SmartCardPage = lazy(() => import('./pages/alumni/SmartCardPage'));
const SurveysPage = lazy(() => import('./pages/alumni/SurveysPage'));
const ProfilePage = lazy(() => import('./pages/alumni/ProfilePage'));
const CircularsPage = lazy(() => import('./pages/alumni/CircularsPage'));
const CollegeProfilePage = lazy(() => import('./pages/college/CollegeProfilePage'));
const VerificationPage = lazy(() => import('./pages/college/VerificationPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Specialized Student & College Pages (Lazy-Loaded)
const ResumeAnalyzerPage = lazy(() => import('./pages/student/ResumeAnalyzerPage'));
const SkillGapPage = lazy(() => import('./pages/student/SkillGapPage'));
const PlacementPredictorPage = lazy(() => import('./pages/student/PlacementPredictorPage'));
const ComplaintsPage = lazy(() => import('./pages/student/ComplaintsPage'));
const CSVUploadPage = lazy(() => import('./pages/college/CSVUploadPage'));
const SurveyBuilderPage = lazy(() => import('./pages/college/SurveyBuilderPage'));
const ComplaintsAdminPage = lazy(() => import('./pages/college/ComplaintsAdminPage'));

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

            {/* Student Specific Routes */}
            <Route path="/student/resume-analyzer" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ResumeAnalyzerPage />
              </ProtectedRoute>
            } />
            <Route path="/student/skill-gap" element={
              <ProtectedRoute allowedRoles={['student']}>
                <SkillGapPage />
              </ProtectedRoute>
            } />
            <Route path="/student/placement-predictor" element={
              <ProtectedRoute allowedRoles={['student']}>
                <PlacementPredictorPage />
              </ProtectedRoute>
            } />
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
    </BrowserRouter>
  );
}
