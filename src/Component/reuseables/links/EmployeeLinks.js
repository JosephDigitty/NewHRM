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
  FaMoneyBillWave,
} from "react-icons/fa";

export const employeeMenuItems = [
  {
    title: "Cash Requisition",
    icon: FaMoneyBillWave,
    path: "/employee-dashboard/cash-requisition",
    subLinks: [
      { title: "Dashboard", path: "/employee-dashboard/cash-requisition" },
      { title: "My Requests", path: "/employee-dashboard/cash-requisition/requests" },
      { title: "New Request", path: "/employee-dashboard/cash-requisition/new" },
      { title: "Documents", path: "/employee-dashboard/cash-requisition/documents" },
    ],
  },
  {
    title: "Dashboard",
    icon: FaTachometerAlt,
    path: "/employee-dashboard",
  },
  {
    title: "Payrolls & Payslip",
    icon: FaMoneyBill,
    subLinks: [
      { title: "Current Salary Overview", path: "/employee-dashboard/salary-overview/" },
      { title: "Payslip History", path: "/employee-dashboard/payslip-history" },
    ],
  },
  {
    title: "Leave Management",
    icon: FaCalendar,
    subLinks: [
      { title: "Leave Overview", path: "/employee-dashboard/leaves" },
      { title: "Request Leave", path: "/employee-dashboard/add-leave" },
      { title: "Leave History", path: "/employee-dashboard/leaves-history" },
    ],
  },
  // --- ACCOUNTANT ONLY ITEMS ---
  {
    title: "Financial Audits",
    icon: FaCalculator,
    path: "/employee-dashboard/financial-audits",
    allowedPositions: ["Account"],
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