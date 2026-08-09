import React, { useEffect, useState } from "react";
import { Repeat, Star, PieChart } from "lucide-react";
import { getEmployeeAppraisals } from "../../utils/DyamicDashboard";
import { useAuth } from "../../Context/authContext";

const SummaryCards = () => {
   const [appraisal, setAppraisal] = useState([])
    const [latestAprraisal, setLatestAppraisal] = useState([])
    const [activeKpi, setActiveKpi] = useState([])
   
  
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

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-500 ">Current Active Cycle</p>
          <Repeat className="text-primary group-hover:scale-110 transition-transform" size={24} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 ">{latestAprraisal?.cycle?.cycleName}</p>
          <p className="mt-1 flex items-center gap-1 text-sm font-medium text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
          {latestAprraisal?.cycle?.status === "open"? "Circle still open for appraisal": "cycle is now closed"}
        </p>
        </div>
      </div>

      <div className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-500 ">Last Final Score</p>
          <Star className="text-amber-500 group-hover:scale-110 transition-transform" size={24} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 ">{latestAprraisal?.totalScore} <span className="text-lg font-normal text-slate-400">/ 5.0</span></p>
          <p className="mt-1 flex items-center gap-1 text-sm font-medium text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
            {latestAprraisal?.rating}
          </p>
        </div>
      </div>

      <div className="group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-500 ">Completion Progress</p>
          <PieChart className="text-primary group-hover:scale-110 transition-transform" size={24} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-slate-900 ">75%</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">In Progress</p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-primary" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
