import { NavLink } from "react-router-dom";
import { useState } from "react";
import { employeeMenuItems } from "../reuseables/links/EmployeeLinks";
import { useAuth } from "../../Context/authContext";

const EmployeeSidebar = ({ isMenuOpen }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const { user } = useAuth();

  const toggleSubMenu = (title) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  const userPosition = user?.position?.trim().toLowerCase();

  // Filter items: show general items + items matching the user's position
  const filteredMenuItems = employeeMenuItems.filter((item) => {
    if (!item.allowedPositions) return true; // Available to all employees
    return item.allowedPositions.includes(userPosition);
  });

  return (
    <div
      className={`${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      } bg-[#1E293B]/90 fixed min-h-screen text-white w-64 space-y-2 pl-2 duration-500 transition-all transform ease-in-out`}
    >
      <div className="flex flex-col gap-5 pb-4 justify-center items-start mt-4">
        <div>
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title}>
                {/* MENU HEADER */}
                <div
                  onClick={() => toggleSubMenu(item.title)}
                  className="flex justify-between items-center py-3 px-2 mx-1.5 hover:ml-4 rounded cursor-pointer hover:text-black/70 hover:bg-gray-50 transition-all duration-500"
                >
                  <NavLink
                    className="flex items-center space-x-4"
                    to={
                      item.title.toLowerCase() === "profile"
                        ? `${item.path}/${user?._id}`
                        : item.path || "#"
                    }
                  >
                    <Icon />
                    <span>{item.title}</span>
                  </NavLink>
                </div>

                {/* DROPDOWN */}
                {item.subLinks && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openMenu === item.title
                        ? "max-h-40 opacity-100 ml-8"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.subLinks.map((sub) => (
                      <NavLink key={sub.title} to={sub.path}>
                        <div className="px-2 py-1 hover:text-blue-400 transition-colors duration-300">
                          {sub.title}
                        </div>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSidebar;