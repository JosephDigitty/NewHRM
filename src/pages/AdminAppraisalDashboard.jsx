import { useEffect, useState } from "react";
import AppraisalSidebar from "../Component/AppraisalSidebar";
import AppraisalNavBar from "../Component/AppraisalNavBar";
import {
  employees,
  departmentProgress,
} from "../Component/AdminDashboard/mock";

import { useAuth } from "../Context/authContext";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../Component/AdminDashboard/DashboardHeader";
import SummaryCards from "../Component/AdminDashboard/SummaryCard";
import EmployeeTable from "../Component/AdminDashboard/Employmentable";
import ProgressSection from "../Component/AdminDashboard/ProgressSection";
import { getAllAppraisal, getAllEmployee } from "../utils/DyamicDashboard";

const AdminAppraisalDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [appraisal,setAppraisal] = useState([])
  const [employee,setEmployee] = useState([]) 
  const [stats, setStats] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [progress, setProgress] = useState([]);

  const user = useAuth();
  const navigate = useNavigate();

  // ✅ FIXED ROLE LOGIC
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "HR") {
      navigate("/appraisal-dashboard");
    }
  }, [user]);

useEffect(() => {
  const getDashboardData = async () => {
    try {
      const [employee, appraisal ] = await Promise.all([
        getAllEmployee(),
        getAllAppraisal()
      ])
      setEmployee(employee)
      setAppraisal(appraisal)
      console.log(appraisal)
      console.log(employee)
    } catch (error) {
      console.log(error)
    }
  }
  getDashboardData()
},[])
  
  
 
 useEffect(() => {
  if (!appraisal.length && !employee.length) return; // wait for data

  const appraised = appraisal.filter(app => app.status === "Appraised").length;
  const awaitingAppraisal = appraisal.filter(app => app.status === "Awaiting Appraisal").length;
  const totalEmployees = employee.length;

  setStats({
    totalEmployees,
    ongoing: awaitingAppraisal,
    completed: appraised,
    averageScore: 4.2,
  });
  setEmployeeList(appraisal.slice(-4));
  setProgress(departmentProgress);
}, [appraisal, employee]); // 👈 re-runs when these change
  const getMainStyle = () => {
    return `pt-20 transition-all duration-500 ${
      isMenuOpen ? "md:ml-64" : ""
    }`;
  };

  if (!stats) return <p className="p-6">Loading...</p>;

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      
      {/* ✅ KEEP YOUR LAYOUT SYSTEM */}
      <AppraisalNavBar
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />

      <AppraisalSidebar isMenuOpen={isMenuOpen} />

      <main className={getMainStyle()}>
        <div className="max-w-7xl mx-auto flex flex-col gap-8 p-6 md:p-10">
          
          <DashboardHeader
            onCreate={() =>
              navigate("/appraisal-dashboard/create-cycle")
            }
          />

          <SummaryCards stats={stats} />

          <EmployeeTable employees={employeeList} />

          <ProgressSection data={progress} />

        </div>
      </main>
    </div>
  );
};

export default AdminAppraisalDashboard;