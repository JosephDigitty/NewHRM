import { Bell, HelpCircle, Search, ChevronRight, Menu } from "lucide-react";
import React from "react";
import { useAuth } from "../Context/authContext";

const AppraisalNavBar = ({ setIsMenuOpen, isMenuOpen }) => {

  const {user} = useAuth()

  const getNavTitle = () => {
    return (
      <div className="flex items-center text-[#5e7a8d] text-sm font-medium">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mr-4 p-2 rounded-lg hover:bg-slate-100 text-[#101518] transition-colors"
        >
          <Menu size={20} />
        </button>
        <span className="text-[#101518] dark:text-white">Workspace</span>
        <ChevronRight className="w-5 h-5 mx-2" />
        <span>{user?.fullname}</span>
      </div>
    );
  };

  const getNavActions = () => {
    return (
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="flex flex-col min-w-40 h-10 max-w-64 md:flex">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-[#f0f3f5] dark:bg-slate-700 overflow-hidden group focus-within:ring-2 ring-[#70c6ff]/50 transition-all">
            <div className="text-[#5e7a8d] flex items-center justify-center pl-3">
              <Search size={20} />
            </div>
            <input
              className="flex w-full min-w-0 flex-1 resize-none bg-transparent border-none focus:outline-0 focus:ring-0 text-[#101518] dark:text-white h-full placeholder:text-[#5e7a8d] px-3 text-sm font-normal leading-normal"
              placeholder="Search tasks..."
            />
          </div>
        </div>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-[#101518] dark:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#5C0A23] rounded-full border-2 border-white dark:border-slate-800"></span>
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-[#101518] dark:text-white transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    );
  };

  const getNavStyle = () => {
    return "h-20 bg-white dark:bg-slate-800 border-b border-[#f0f3f5] dark:border-slate-700";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 ${getNavStyle()}`}
    >
      <div className="flex items-center gap-4">{getNavTitle()}</div>
      {getNavActions()}
    </header>
  );
};

export default AppraisalNavBar;
