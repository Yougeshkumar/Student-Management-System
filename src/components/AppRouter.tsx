import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import StudentDashboard from '../pages/student/StudentDashboard';
import Header from './common/Header';

const AppRouter: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  let dashboard;
  switch (user?.role) {
    case 'admin':
      dashboard = <AdminDashboard />;
      break;
    case 'teacher':
      dashboard = <TeacherDashboard />;
      break;
    case 'student':
      dashboard = <StudentDashboard />;
      break;
    default:
      dashboard = <div>Unauthorized</div>;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {dashboard}
      </main>
    </>
  );
};

export default AppRouter;