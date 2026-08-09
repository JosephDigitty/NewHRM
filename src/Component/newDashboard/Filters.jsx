import { FaCalendarAlt, FaSlidersH } from "react-icons/fa";

const Filters = () => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="flex items-center gap-2 border border-blue-400 rounded-full px-3 py-1 bg-white shadow-sm cursor-pointer">
        <FaCalendarAlt className="text-gray-500" />
        <select className="bg-transparent outline-none text-sm font-semibold">
          <option>November, 2025</option>
          <option>December, 2025</option>
          <option>January, 2026</option>
        </select>
      </div>

      <div className="flex items-center  gap-2 border border-blue-400 rounded-full px-3 py-1 bg-white shadow-sm cursor-pointer">
        <FaSlidersH className="text-gray-500" />
        <span className="font-semibold">Filter:</span>
        <select className="bg-transparent outline-none text-sm">
          <option>All Employees</option>
          <option>Managers</option>
          <option>Developers</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
