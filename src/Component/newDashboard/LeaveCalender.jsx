import Button from "../reuseables/Button";
import { FaCalendarAlt, FaSlidersH } from "react-icons/fa";
import SubTitle from "../reuseables/SubTitle";
import { useEffect, useState } from "react";
import { getAllleave, getEmployeesOnLeaveThisWeek } from "../../utils/DyamicDashboard";
const LeaveCalender = () => {
  const [leaves, setLeaves] = useState([])
 useEffect(() => {
    const getAllDashboardData = async () => {
      try {
        const leave = await getAllleave()
        setLeaves(leave)
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
      }
    }
    getAllDashboardData()
  }, [])
  const onLeaveThisWeek = getEmployeesOnLeaveThisWeek(leaves)
  return (
    <div className="bg-white rounded-lg shadow p-4 col-span-1 flex flex-col gap-6 items-center  ">
      <div className="flex justify-between flex-col-reverse md:flex-row gap-4  w-full items-start ">
        <div>
          <SubTitle text={"Leave Calendar"}/>
          <p>{onLeaveThisWeek} number of staff are on leave this week</p>
        </div>
        <div className="flex items-center gap-2 border border-blue-400 rounded-full px-3 py-1 bg-white shadow-sm cursor-pointer">
          <FaSlidersH className="text-gray-500" />
          <span className="font-semibold">Filter:</span>
          <select className="bg-transparent outline-none text-sm">
            <option>All Employees</option>
            <option>Managers</option>
            <option>Developers</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-7  w-full gap-2 text-center text-xs">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
        {/* Replace with avatars */}
      </div>
      <Button icon text="View all Leaves" />
    </div>
  );
};

export default LeaveCalender;
