// menuItems.js
import {
  FaBuilding,
  FaCalendar,
  FaClipboard,
  FaMoneyBill,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";

export const menuItems = [
  {
    title: "Dashboard",
    icon: FaTachometerAlt,
    path: "/admin-dashboard",
  },
  {
    title: "Department",
    icon: FaBuilding,
    subLinks: [
      { title: "All Departments", path: "/admin-dashboard/departments" },
      {
        title: "Add New Department",
        path: "/admin-dashboard/add-new-department",
      },
    ],
  },
  {
    title: "Grade",
    icon: FaBuilding,
    subLinks: [
      { title: "All Grades", path: "/admin-dashboard/grades/all" },
      { title: "Add New Grade", path: "/admin-dashboard/grade/add" },
    ],
  },
  {
    title: "Employee",
    icon: FaUser,
    subLinks: [
      { title: "Employee Summary", path: "/admin-dashboard/employees/" },
      { title: "Add New Employee", path: "/admin-dashboard/add-employee" },
    ],
  },

  {
    title: "Leaves",
    icon: FaCalendar,
    subLinks: [
      { title: "Pending Leaves", path: "/admin-dashboard/leaves/all" },
      { title: "Approved Leaves", path: "/admin-dashboard/leaves/apply" },
      { title: "Rejected Leaves", path: "/admin-dashboard/leaves/apply" },
    ],
  },
  {
    title: "Payroll",
    icon: FaMoneyBill,
    subLinks: [
      { title: "DashBoard", path: "/admin-dashboard/payroll" },
      {
        title: "Temporary Payroll",
        path: "/admin-dashboard/payrolls/modifiers/temporary",
      },
      {
        title: "Permanent Payroll",
        path: "/admin-dashboard/payroll/permanent",
      },
    ],
  },

  {
    title: "Appraisal",
    icon: FaClipboard,
    path: "/appraisal-dashboard",
  },
  {
    title: "Award/Certification",
    icon: FaClipboard,
    path: "/admin-dashboard/settings",
  },
  {
    title: "Disciplinary Actions",
    icon: FaClipboard,
    path: "/admin-dashboard/settings",
  },
];
