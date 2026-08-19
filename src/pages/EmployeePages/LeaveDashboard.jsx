import React, { useEffect, useState } from "react";
import LeaveCard from "../../Component/reuseables/EmployeeReuseable/LeaveCard";
import LeaveActivityItem from "../../Component/reuseables/EmployeeReuseable/LeaveActivityItem";
import StatRow from "../../Component/reuseables/EmployeeReuseable/StatRow";
import { Baby, Calendar, Heart, User } from "lucide-react";
import { useAuth } from "../../Context/authContext";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";

const LeaveDashboard = () => {
  const { user } = useAuth();
  const id = user?._id;

  const [leaveBalance, setLeaveBalance] = useState([]);
  const { showSuccess, showError } = useToastContext();

  useEffect(() => {
    if (!user) return;
    const getLeaveBalance = async () => {
      try {
        const response = await api.get(`leave/employeebalance/${id}`);
        if (response.data.success) {
          console.log(response.data.leaveBalances);
          setLeaveBalance(response.data.leaveBalances);
          showSuccess(response.data.message);
        }
      } catch (error) {
        console.log(error);
        console.log(`id: ${id}`);
        showError("Failed to fetch leave balance");
      }
    };
    getLeaveBalance();
  }, [id]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leave Overview</h1>
        <p className="text-gray-600 text-sm">
          Manage your leave balance and request.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {leaveBalance.map((leave) => (
          <div key={leave._id}>
            <LeaveCard
              title={leave.leaveType?.name}
              used={leave.usedDays}
              total={leave.totalDays}
              icon={<Calendar size={20} />}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Leave Activity</h3>
        <LeaveActivityItem
          title="Annual Leave"
          dateRange="Dec 23-27, 2024 • 5 days"
          appliedDate="11/15/2024"
          status="Approved"
        />
        <LeaveActivityItem
          title="Annual Leave"
          dateRange="Dec 23-27, 2024 • 5 days"
          appliedDate="11/15/2024"
          status="Pending"
        />
        <LeaveActivityItem
          title="Annual Leave"
          dateRange="Dec 23-27, 2024 • 5 days"
          appliedDate="11/15/2024"
          status="Approved"
        />
      </div>

      {/* Leave Statistics */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">Leave Statistics</h3>

        <StatRow label="Total Allocated" value="47 days" color="" />
        <StatRow label="Total Used" value="11 days" color="text-red-500" />
        <StatRow
          label="Total Remaining"
          value="35 days"
          color="text-purple-600"
        />

        <div className="mt-4 bg-blue-200 p-3 rounded-lg font-semibold flex justify-between">
          <span>Pending Requests</span>
          <span className="text-blue-700">1 days</span>
        </div>
      </div>

      {/* Holiday Activity */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Leave Activity</h3>

        <div className="bg-blue-100 p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="font-semibold flex items-center gap-2">
              <Calendar size={18} /> Christmas Holiday
            </p>
            <p className="text-sm text-gray-600">December 23-27, 2024</p>
          </div>
          <span className="text-purple-600 font-medium">5 days</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveDashboard;
