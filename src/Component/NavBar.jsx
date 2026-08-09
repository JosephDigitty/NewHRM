import { FaBars, FaSearch, FaBell } from "react-icons/fa";
import { useAuth } from "../Context/authContext";

const NavBar = ({toggleMenu}) => {
  const { user } = useAuth();
  return (
    <nav className="bg-white py-4 px-8 flex sticky z-10 top-0 shadow justify-between items-center ">
      <div className="flex gap-8 items-center " onClick={toggleMenu}>
        <FaBars size={30} className="cursor-pointer " />
        <div>
          <p className="text-red-400">Digittify Employment</p>
        </div>

        <p className=" border-1 border-gray-500 h-10"> </p>
        <p>{user ? `welcome ${user.fullname}` : "Welcome Guest"}</p>
      </div>
      <div className="md:flex gap-8 items-center hidden ">
        <div className="flex gap-2 items-center">
          <FaSearch className="cursor-pointer text-gray-500" />
          <input
            type="text"
            placeholder="Search employees, job titles, or departments "
            className="w-[25vw] focus:outline-none "
          />
        </div>
        <p className=" border-1 border-gray-500 h-10"> </p>
        <FaBell className="cursor-pointer text-2xl" />
      </div>
    </nav>
  );
};

export default NavBar;
