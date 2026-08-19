import Button from "../reuseables/Button";
import { FaSlidersH } from "react-icons/fa";
import SubTitle from "../reuseables/SubTitle";
import { useNavigate } from "react-router-dom";

const QuickAction = ({ employees = [], payrolls = [], leaves = [] }) => {
  const navigate = useNavigate();

  const recentActivities = [];

  if (employees.length > 0) {
    const sorted = [...employees]
      .filter((emp) => emp?.job?.dateOfHire)
      .sort((a, b) => new Date(b.job.dateOfHire) - new Date(a.job.dateOfHire))
      .slice(0, 2);

    sorted.forEach((emp) => {
      const dept = emp?.job?.department?.department_Name || "Company";
      const name = emp?.userId?.fullname || "An employee";
      recentActivities.push({
        text: `${name} was added to ${dept} department`,
        date: emp.job.dateOfHire,
      });
    });
  }

  if (leaves.length > 0) {
    const sorted = [...leaves]
      .filter((leave) => leave?.startDate)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .slice(0, 2);

    sorted.forEach((leave) => {
      const name = leave?.employeeId?.userId?.fullname || "An employee";
      recentActivities.push({
        text: `Leave request submitted by ${name}`,
        date: leave.startDate,
      });
    });
  }

  if (payrolls.length > 0) {
    const latest = [...payrolls]
      .filter((p) => p?.period)
      .sort((a, b) => b.period.localeCompare(a.period))[0];

    if (latest) {
      recentActivities.push({
        text: `Payroll processed for ${latest.period}`,
        date: latest.period,
      });
    }
  }

  recentActivities.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return isNaN(dateA) || isNaN(dateB) ? 0 : dateB - dateA;
  });

  const displayActivities = recentActivities.slice(0, 3);

  return (
    <div className=" col-span-1">
      <div className="bg-white rounded-lg shadow p-4 mb-6 ">
        <SubTitle text="Quick Actions"/>
        <div className="flex flex-wrap md:gap-x-8 mt-4 gap-x-4 gap-y-4">
          <Button icon text="Add New Employee" onClick={() => navigate("/admin-dashboard/add-employee")} />
          <Button icon text="Run Payroll" onClick={() => navigate("/admin-dashboard/payroll")} />
          <Button icon text="Send Payslips" onClick={() => navigate("/admin-dashboard/payroll")} />
          <Button icon text="Adjust Payroll" onClick={() => navigate("/admin-dashboard/payrolls/modifiers/temporary")} />
          <Button icon text="Approve Leave" onClick={() => navigate("/admin-dashboard/leaves/all")} />
          <Button icon text="Generate Report" onClick={() => navigate("/admin-dashboard")} />
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-4 justify-between items-start bg-white rounded-lg shadow p-4">
        
        <div className="">
          <h3 className="text-3xl font-bold mb-4">Recent Activity</h3>
          {displayActivities.length > 0 ? (
            <ul className="list-disc list-inside text-xs space-y-2">
              {displayActivities.map((activity, index) => (
                <li key={index}>{activity.text}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">No recent activity available.</p>
          )}
        </div>
        <div className="flex items-center gap-2 border border-blue-400 rounded-full px-3 py-1 shadow-sm cursor-pointer">
        <FaSlidersH className="text-gray-500" />
        <span className="font-semibold">Filter:</span>
        <select className="bg-transparent outline-none text-sm">
          <option>All Activites</option>
          <option>Managers</option>
          <option>Employers</option>
        </select>
      </div>
      </div>
    </div>
  );
};

export default QuickAction;
