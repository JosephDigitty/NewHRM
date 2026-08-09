import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import { useState } from "react";
import AdminSidebar from "../Component/SideBar";
import NavBar from "../Component/NavBar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isMenuOpen,setIsMenuOpen] =useState(false)
   const toggleMenu =()=>{
    setIsMenuOpen(!isMenuOpen)
   }

  if (loading) {
    return <div>Loadding...........</div>;
  }
  if (!loading && !user) {
    navigate("/login");
  }

  return (
    <div className="">
      <NavBar toggleMenu={toggleMenu} />
      <div className="flex bg-gray-100 min-h-screen">
        <div className={`${isMenuOpen? '': 'w-full'}  flex-1 bg-gray-100 min-h-screen`}>
        <AdminSidebar isMenuOpen={isMenuOpen}   />
        <div className={`${isMenuOpen? 'ml-[220px]': ''} transition-all duration-700`}>
        <Outlet />
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
