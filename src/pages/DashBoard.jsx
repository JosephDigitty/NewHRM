import { useEffect, useState } from "react";
import Filters from "../Component/newDashboard/Filters";
import HeadCountC from "../Component/newDashboard/HeadCountC";
import LeaveCalender from "../Component/newDashboard/LeaveCalender";
import MonthlyPayrollChart from "../Component/newDashboard/MonthlyPayrollChart";

import QuickAction from "../Component/newDashboard/QuickAction";
import StatCard from "../Component/newDashboard/StatCard";
import { getAllDepartment, getAllEmployee, getAllleave, getAllPayroll } from "../utils/DyamicDashboard";

const DashBoard = () => {
  const [employees, setEmployees] = useState([])
  const [payrolls, setPayrolls] = useState([])
  const [leaves, setLeaves] = useState([])
  useEffect(()=> {
    const getAllDashboardData = async () => {
     try {
        const [employees,departments, payroll, leaves] = await Promise.all([
          getAllEmployee(),
          getAllDepartment(),
          getAllPayroll(),
          getAllleave(), 
        ])
        setEmployees(employees)
        setPayrolls(payroll)
        setLeaves(leaves)
        console.log(payrolls)
      } catch (error) {
        if (error.response && !error.response.data.success) {
            showError(error.response.data.error);
        }
      } 
    }
    getAllDashboardData()
  },[])

const pendingLeaves  = leaves.filter(leave => leave.status === "pending").length
const approvedLeaves = leaves.filter(leave => leave.status === "approved").length
const rejectedLeaves = leaves.filter(leave => leave.status === "rejected").length

  return (
    <div className="bg-gray-50 w-full h-[100vh] text-gray-700">
      <div className="p-6 bg-[#e6f0f6] min-h-screen">
        <Filters />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Employees"
            value={employees.length}
            change="+1.6%"
            changeType="positive"
            subtext="+36 this month"
          />
          <StatCard
            title="rejected Leave Requests"
            value={rejectedLeaves}
            change="+1.6%"
            changeType="positive"
            subtext="Next pay date: December 15, 2025"
          />
          <StatCard
            title="Pending Leave Requests"
            value={pendingLeaves}
            change="-3.2%"
            changeType="negative"
            subtext="+3 this month"
          />
          <StatCard
            title="Total Approved Leaves"
            value={approvedLeaves}
            change="+12.8%"
            changeType="positive"
            link="#"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <MonthlyPayrollChart />
          <HeadCountC />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <QuickAction />
          <LeaveCalender />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
