import { NavLink } from "react-router-dom";
import { FaHome, FaClipboardList, FaPlusCircle, FaFolder, FaUser, FaCog } from "react-icons/fa";

const CashRequisitionSidebar = () => {
  const menuItems = [
    { title: "Dashboard", icon: FaHome, path: "/employee-dashboard/cash-requisition" },
    { title: "My Requests", icon: FaClipboardList, path: "/employee-dashboard/cash-requisition/requests" },
    { title: "New Request", icon: FaPlusCircle, path: "/employee-dashboard/cash-requisition/new" },
    { title: "Documents", icon: FaFolder, path: "/employee-dashboard/cash-requisition/documents" },
    { title: "Profile", icon: FaUser, path: "/employee-dashboard/profile/" },
    { title: "Settings", icon: FaCog, path: "/employee-dashboard/settings" },
  ];

  return (
    <div className="bg-[#1E293B]/90 fixed min-h-screen text-white w-64 space-y-2 pl-2 z-50">
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <FaHome className="text-white text-sm" />
        </div>
        <span className="text-lg font-semibold text-purple-400">HRM System</span>
      </div>

      <div className="flex flex-col gap-1 pb-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-50 hover:text-gray-900 text-gray-300"
                }`
              }
            >
              <Icon />
              <span className="text-sm font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden">
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Joseph Digitty</p>
            <p className="text-xs text-gray-400">Treasury Officer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashRequisitionSidebar;
