import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import Button from "./reuseables/Button";
import { appraisalLinks } from "./reuseables/links/AppraisalLinks";
import { useState } from "react";

const AppraisalSidebar = ({ isMenuOpen }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
 
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

const menuItems = appraisalLinks[user?.role] || [];

  const [openMenu, setOpenMenu] = useState(null);

  const toggleSubMenu = (title) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  return (
    <div
      className={`${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      } bg-[#1E293B]/90 fixed top-20 h-[calc(100vh-5rem)] text-white space-y-2 pl-2 duration-500 transition-all transform ease-in-out w-64 z-50`}
    >
      <div className="flex flex-col gap-5 pb-4 justify-center items-start">
        <div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title}>
                <div
                  onClick={() => toggleSubMenu(item.title)}
                  className="flex justify-between items-center py-3 px-2 mx-1.5 hover:ml-4 rounded cursor-pointer hover:text-black/70 hover:bg-gray-50 transition-all duration-500"
                >
                  <NavLink
                    className="flex items-center space-x-4"
                    to={item.path}
                  >
                    <Icon />
                    <span>{item.title}</span>
                  </NavLink>
                </div>

                {/* Submenu with Tailwind transition */}
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

        <Button
          onClick={handleLogout}
          text="Logout"
          className="bg-[var(--blue)] hover:bg-[var(--blue-hover)] h-10 w-[90%]"
        />
      </div>
    </div>
  );
};

export default AppraisalSidebar;
