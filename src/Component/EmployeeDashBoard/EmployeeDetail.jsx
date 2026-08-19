import {
  miniBarData,
  overviewData,
  projectPieData,
  activeProjects,
} from "../Data/EmployeeDashboardData";
import OverviewChart from "../Charts/OverviewChart";
import ActiveProjects from "./ActiveProjects";
import LeaveReport from "./LeaveReport";
import Notifications from "./Notifications";
import Performance from "./Performance";
import ProjectSummary from "./ProjectSummary";
import StatCard from "./StatCard";
import TodoList from "./TodoList";
import { useEffect, useState } from "react";
import { getEmployeeAppraisals, getEmployeePayroll } from "../../utils/DyamicDashboard";
import { useAuth } from "../../Context/authContext";
import { NairaCurrency } from "../../utils/PayrollHelpers";

 
const EmployeeDashboard = () => {
   const { user } = useAuth()
   const employeeId = user?._id
   const [pay, setPay] = useState([])
   const [appraisal, setAppraisal] = useState([])
   const [activeKpi, setActiveKpi] = useState([])
   useEffect(() => {
     const EmployeeDashboardData = async () => {
        if (!employeeId || !user) return
      try {
        const [appraisal, pay ] = await Promise.all([
        getEmployeeAppraisals(employeeId),
        getEmployeePayroll(employeeId)
      ])
      setPay(pay || [])
      setAppraisal(appraisal || [])
      const latestAppraised = appraisal?.find(
      app => app.status === "Appraised"
      );
      setActiveKpi(latestAppraised?.kpis || [])
      } catch (error) {
        console.log("FULL ERROR:", error)
      }
    } 
    EmployeeDashboardData()
  },[employeeId])

  const totalPay = (pay || []).reduce((acc, p) => acc + (p.netSalary || 0), 0)


  

  console.log(activeKpi)
  return (
    <div className="p-6 grid grid-cols-4 grid-rows-[150px_50px_250px_100px_350px] gap-6">
      {/* ROW 1 - STAT CARDS */}
      <div className="col-start-1 col-end-3 row-start-1  row-end-2 flex gap-6">
        <StatCard
          title="Total payout"
          value={NairaCurrency(totalPay)}
          chartData={miniBarData}
        />
        <StatCard title="Total payee" value={pay.length} chartData={miniBarData} />
      </div>

      <div className=" flex gap-6  col-start-3 col-end-5 row-start-1 row-end-3 ">
        <LeaveReport />
        <Performance />
      </div>

      {/* OVERVIEW CHART - spans 8 columns */}
      <div className="bg-white p-4 rounded-xl  shadow col-start-1 col-end-3 row-start-2 row-end-4 ">
        <OverviewChart data={overviewData} />
      </div>

      {/* RIGHT SIDE SMALL WIDGETS */}

      {/* MIDDLE SECTION */}
      <div className="col-start-3 col-end-4 row-start-3 row-end-4 ">
        <TodoList />
      </div>

      <div className="col-start-4 col-end-4  row-start-3 row-end-5 ">
        <Notifications />
      </div>
      {/* FULL WIDTH TABLE */}
      <div className="col-start-1 col-end-4 row-start-4 row-end-6 ">
        <ActiveProjects projects={activeKpi} />
      </div>
      <div className=" col-start-4 col-end-5 row-start-5 row-end-6">
        <ProjectSummary chartData={projectPieData} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
