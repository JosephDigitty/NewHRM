import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import AppraisalSidebar from "./AppraisalSidebar";
import AppraisalNavBar from "./AppraisalNavBar";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#70c6ff]"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === "admin") {
      return <Navigate to="/appraisal-dashboard/admin" replace />;
    } else if (
      user.role === "HR" ||
      user.role === "employee"
    ) {
      return <Navigate to="/appraisal-dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const AppraisalLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const getMainStyle = () => {
    return `pt-20 transition-all duration-500 ${isMenuOpen ? "md:ml-64 " : ""}`;
  };

  return (
    <div className="bg-[#f5f7f8]  min-h-screen">
      <AppraisalNavBar setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
      <AppraisalSidebar isMenuOpen={isMenuOpen} />
      <main className={getMainStyle()}>
        <div className="min-h-[calc(100vh-5rem)]">{children}</div>
      </main>
    </div>
  );
};

export default ProtectedRoute;
