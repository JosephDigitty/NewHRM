// employeeMenuItems.js
import {
  FaTachometerAlt,
  FaMoneyBill,
  FaCalendar,
  FaBell,
  FaUser,
  FaClipboard,
  FaCalculator, // Add extra icons as needed
  FaBriefcase,
} from "react-icons/fa";

export const AccountMenuItems = [
  {
    title: "Dashboard",
    icon: FaTachometerAlt,
    path: "/employee-dashboard",
  },
  {
    title: "Payrolls & Payslip",
    icon: FaMoneyBill,
    subLinks: [
      { title: "Current Salary Overview", path: "/user-exe-dashboard/salary-overview" },
      { title: "Payslip History", path: "/user-exe-dashboard/payslip-history" },
    ],
  },
  {
    title: "Leave Management",
    icon: FaCalendar,
    subLinks: [
      { title: "Leave Overview", path: "/user-exe-dashboard/leaves" },
      { title: "Request Leave", path: "/user-exe-dashboard/add-leave" },
    ],
  },
  // --- ACCOUNTANT ONLY ITEMS ---
  {
    title: "Payroll Audits",
    icon: FaCalculator,
    path: "/user-exe-dashboard/payroll",
  },
  // --- DIRECTOR ONLY ITEMS ---
  {
    title: "Executive Reports",
    icon: FaBriefcase,
    path: "/employee-dashboard/executive-reports",
    allowedPositions: ["director"],
  },
  {
    title: "Notifications",
    icon: FaBell,
    path: "/employee-dashboard/notifications",
  },
  {
    title: "Profile",
    icon: FaUser,
    path: "/employee-dashboard/profile/",
  },
  {
    title: "Settings",
    icon: FaClipboard,
    path: "/employee-dashboard/settings",
  },
  {
    title: "Appraisal",
    icon: FaClipboard,
    path: "/appraisal-dashboard/employee",
  },
];