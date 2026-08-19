import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Filters from "../Component/newDashboard/Filters";
import HeadCountC from "../Component/newDashboard/HeadCountC";
import LeaveCalender from "../Component/newDashboard/LeaveCalender";
import MonthlyPayrollChart from "../Component/newDashboard/MonthlyPayrollChart";

import QuickAction from "../Component/newDashboard/QuickAction";
import StatCard from "../Component/newDashboard/StatCard";
import { getAllDepartment, getAllEmployee, getAllleave, getAllPayroll } from "../utils/DyamicDashboard";

const DashBoard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([])
  const [payrolls, setPayrolls] = useState([])
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=> {
    const getAllDashboardData = async () => {
     try {
        setLoading(true)
        setError(null)
        const [employeesData, _departments, payrollData, leavesData] = await Promise.all([
          getAllEmployee(),
          getAllDepartment(),
          getAllPayroll(),
          getAllleave(), 
        ])
        setEmployees(employeesData || [])
        setPayrolls(payrollData || [])
        setLeaves(leavesData || [])
      } catch (error) {
        setError("Failed to load dashboard data")
        console.error(error)
      } finally {
        setLoading(false)
      } 
    }
    getAllDashboardData()
  },[])

const pendingLeaves  = leaves.filter(leave => leave.status === "pending").length
const approvedLeaves = leaves.filter(leave => leave.status === "approved").length
const rejectedLeaves = leaves.filter(leave => leave.status === "rejected").length

  if (loading) {
    return (
      <div className="bg-gray-50 w-full h-[100vh] text-gray-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-50 w-full h-[100vh] text-gray-700 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => navigate("/admin-dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

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
            to="/admin-dashboard/employees"
          />
          <StatCard
            title="Rejected Leave Requests"
            value={rejectedLeaves}
            change="+1.6%"
            changeType="positive"
            subtext="Next pay date: December 15, 2025"
            to="/admin-dashboard/leaves/all"
          />
          <StatCard
            title="Pending Leave Requests"
            value={pendingLeaves}
            change="-3.2%"
            changeType="negative"
            subtext="+3 this month"
            to="/admin-dashboard/leaves/all"
          />
          <StatCard
            title="Total Approved Leaves"
            value={approvedLeaves}
            change="+12.8%"
            changeType="positive"
            to="/admin-dashboard/leaves/all"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <MonthlyPayrollChart payrolls={payrolls} />
          <HeadCountC />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <QuickAction employees={employees} payrolls={payrolls} leaves={leaves} />
          <LeaveCalender leaves={leaves} />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
