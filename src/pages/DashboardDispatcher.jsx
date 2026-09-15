import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AlumniDashboard from './alumni/AlumniDashboard';
import StudentDashboard from './student/StudentDashboard';
import CollegeDashboard from './college/CollegeDashboard';

export default function DashboardDispatcher() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'alumni':
      return <AlumniDashboard />;
    case 'college_admin':
    case 'admin':
      return <CollegeDashboard />;
    default:
      return <div className="p-8 text-center">Unauthorized Role</div>;
  }
}
