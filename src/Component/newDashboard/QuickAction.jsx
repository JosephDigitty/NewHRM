import Button from "../reuseables/Button";
import { FaSlidersH } from "react-icons/fa";
import SubTitle from "../reuseables/SubTitle";

const QuickAction = () => {
  return (
    <div className=" col-span-1">
      <div className="bg-white rounded-lg shadow p-4 mb-6 ">
        <SubTitle text="Quick Actions"/>
        <div className="flex flex-wrap md:gap-x-8 mt-4 gap-x-4 gap-y-4">
          <Button icon text="Add New Employee" />
          <Button icon text="Run Payroll" />
          <Button icon text="Send Payslips" />
          <Button icon text="Adjust Payroll" />
          <Button icon text="Approve Leave" />
          <Button icon text="Generate Report" />
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-4 justify-between items-start bg-white rounded-lg shadow p-4">
        
        <div className="">
          <h3 className="text-3xl font-bold mb-4">Recent Activity</h3>
          <ul className="list-disc list-inside text-xs space-y-2">
            <li>John Doe was added to Sales department 5 min ago</li>
            <li>Payslips sent for October 2025 Payroll</li>
            <li>Annual bonus processed for 18 employees yesterday</li>
          </ul>
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
