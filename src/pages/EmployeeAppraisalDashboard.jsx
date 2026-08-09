import React, { useState, useEffect } from "react";
import AppraisalSidebar from "../Component/AppraisalSidebar";
import AppraisalNavBar from "../Component/AppraisalNavBar";
import DashboardHeader from "../Component/EmployeeApprisalComponent/DashboardHeader";
import PerformanceScoreCard from "../Component/EmployeeApprisalComponent/PerformanceScoreCard";
import KPISection from "../Component/EmployeeApprisalComponent/KpiSection";
import HistoryTable from "../Component/EmployeeApprisalComponent/HistoryTable";
import SupervisorFeedback from "../Component/EmployeeApprisalComponent/SupervisorFeedback";
import {
  appraisalHistory,
  kpis,
  performance,
  reviewCycle,
  supervisorFeedback,
} from "../Component/EmployeeApprisalComponent/MockData";
import Footer from "../Component/reuseables/Footer";
import { getEmployeeAppraisals } from "../utils/DyamicDashboard";
import { useAuth } from "../Context/authContext";

const EmployeeAppraisalDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [appraisal, setAppraisal] = useState([])
  const [latestAprraisal, setLatestAppraisal] = useState([])
  const [activeKpi, setActiveKpi] = useState([])
  const getMainStyle = () => {
    return `pt-20 transition-all duration-500 ${isMenuOpen ? "md:ml-64" : ""}`;
  };

  const {user} = useAuth()
  const employeeId = user?._id
  useEffect(() => {
  const EmployeeDashboardData = async () => {
    if (!employeeId || !user) return;
    try {
      const appraisals = await getEmployeeAppraisals(employeeId);
      setAppraisal(appraisals);

     
      const newestAppraised = appraisals
        .filter(a => a.status === "Appraised")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        setLatestAppraisal(newestAppraised)
      if (newestAppraised) {
        setActiveKpi(newestAppraised.kpis);
        console.log("Newest Appraised KPIs:", newestAppraised);
      }
      
    } catch (error) {
      console.log("FULL ERROR:", error);
    }
  };
  EmployeeDashboardData();
}, [employeeId, user]); 

    const last = appraisal.filter(a => a.status === "Appraised")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  

  return (
    <div className="bg-background-light text-slate-900 antialiased font-display min-h-screen">
      <AppraisalNavBar setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
      <AppraisalSidebar isMenuOpen={isMenuOpen} />

      <main className={getMainStyle()}>
        <div className="max-w-7xl mx-auto w-full px-6 md:px-10 py-8">
          <DashboardHeader cycle={latestAprraisal?.cycle?.cycleName} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <PerformanceScoreCard performance={last} />
            <SupervisorFeedback feedback={supervisorFeedback} />
          </div>

          <KPISection activeKpi={activeKpi} />

          <HistoryTable history={appraisalHistory} />
        </div>
      </main>

      <Footer variant="hrSolutions" />
    </div>
  );
};

export default EmployeeAppraisalDashboard;
