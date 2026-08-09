import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext';
import AdminAppraisalDashboard from './AdminAppraisalDashboard';
import EmployeeAppraisalDashboard from './EmployeeAppraisalDashboard';

const AppraisalDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#70c6ff]"></div>
      </div>
    );
  }

  if (user?.role === 'admin' || user?.role === 'HR') {
    return <AdminAppraisalDashboard />;
  }
  if (user?.role === 'employee') {
    return <EmployeeAppraisalDashboard />;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Access Denied</h1>
        <p className="text-slate-500 dark:text-slate-400">You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default AppraisalDashboard;
