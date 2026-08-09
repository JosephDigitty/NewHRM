import { Outlet } from "react-router-dom";
import EmployeeSidebar from "../Component/EmployeeDashBoard/EmployeeSidebar";
import NavBar from "../Component/NavBar";
import { useState } from "react";


const EmployeeDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="">
      <NavBar toggleMenu={toggleMenu} />
      <div className="flex bg-gray-100 min-h-screen">
        <div
          className={`${isMenuOpen ? "" : "w-full"}  flex-1 bg-gray-100 min-h-screen`}
        >
          <EmployeeSidebar isMenuOpen={isMenuOpen} />
          <div
            className={`${isMenuOpen ? "ml-[250px]" : ""} transition-all duration-700`}
          >
            <Outlet />
          </div> 
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
