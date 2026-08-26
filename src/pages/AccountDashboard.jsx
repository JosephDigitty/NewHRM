import { Outlet } from "react-router-dom";
import NavBar from "../Component/NavBar";
import { useState } from "react";
import AccountSidebar from "../Component/EmployeeDashBoard/AccountSideBar";


const AccountDashboard = () => {
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
          <AccountSidebar isMenuOpen={isMenuOpen} />
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

export default AccountDashboard;
