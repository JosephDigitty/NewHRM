import React, { useEffect, useState } from "react";
import {
  MdAccountBalance,
  MdPerson,
  MdReceiptLong,
  MdRequestQuote,
  MdAddCard,
  MdAccountBalanceWallet,
  MdHealthAndSafety,
  MdEvent,
  MdFilterList,
  MdChevronLeft,
  MdChevronRight,
  MdDownload,
  MdExpandMore
} from "react-icons/md";
import Modal from "../reuseables/Modal";
import CreatePayroll from "./CreatePayroll";
import { getAllPayroll, getMonthlyPayrollData } from "../../utils/DyamicDashboard";
import { api } from "../../api/request";

const PayrollDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [activeTab, setActiveTab] = useState("Payroll Summary");
  const [payrollDetails, setPayrollDetails] = useState({
    periodName: "September 2026 Payroll",
    status: "Draft",
    dateRange: "September 1 - September 30, 2026",
    totalEmployees: 42,
    grossPayroll: 18450000,
    totalDeductions: 2180000,
    totalNetPay: 16270000,
    preparedBy: { name: "HR Admin", role: "HR Manager" },
    submittedAt: "Sept 25, 2026 · 10:45 AM",
    nextApproval: { name: "Accounts Department", role: "Review & Approval" },
    lastUpdated: "Sept 25, 2026 · 10:45 AM",
  });
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(employees.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, employees.length);
  const paginatedEmployees = employees.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/employee/payroll/activities?year=${currentYear}`);
        if (res.data.success) {
          setPayrolls(res.data.payrolls);
        }
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const payrolls = await getAllPayroll();
      setPayrolls(payrolls);
      setChartData(getMonthlyPayrollData(payrolls));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getActivities = async () => {
      try {
        const res = await api.get("/employee/payroll/activities");
        if (res.data.success) {
          const payrolls = res.data.payrolls;
          const grouped = payrolls.reduce((acc, payroll) => {
            const month = new Date(payroll.payDate).toLocaleString("default", {
              month: "long",
              year: "numeric",
            });
            if (!acc[month]) {
              acc[month] = {
                payrollPeriodName: payroll.payrollperiodName,
                totalNetSalary: 0,
                totalEarnings: 0,
                employeeCount: 0,
                status: payroll.status,
                payDate: payroll.payDate,
              };
            }
            acc[month].totalNetSalary += payroll.netSalary || 0;
            acc[month].totalEarnings += payroll.totalEarnings || 0;
            acc[month].employeeCount += 1;
            return acc;
          }, {});
          const result = Object.values(grouped);
          setPayrolls(result);
        }
      } catch (error) {
        console.error("Error fetching payroll activities:", error);
      }
    };
    getActivities();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const tabs = [
    "Payroll Summary",
    "Payroll Breakdown",
    "Approval Workflow",
    "Audit Trail",
  ];

  const mockEmployees = [
    {
      name: "Windy Gold",
      department: "Business Development",
      grade: "Full Staff",
      basicSalary: "₦300,000.00",
      housingAllow: "₦20,000.00",
      wardrobeAllow: "₦10,000.00",
      transportAllow: "₦50,000.00",
      medicalAllow: "₦12,000.00",
      netPay: "₦314,152.53",
    },
    {
      name: "Kelechi Amadi",
      department: "Information Technology",
      grade: "Junior Staff -2",
      basicSalary: "₦280,000.00",
      housingAllow: "₦12,000.00",
      wardrobeAllow: "₦8,000.00",
      transportAllow: "₦40,000.00",
      medicalAllow: "₦9,000.00",
      netPay: "₦281,103.41",
    },
    {
      name: "Hauwa Lawal",
      department: "Finance & Accounts",
      grade: "Junior Staff -2",
      basicSalary: "₦280,000.00",
      housingAllow: "₦12,000.00",
      wardrobeAllow: "₦8,000.00",
      transportAllow: "₦40,000.00",
      medicalAllow: "₦9,000.00",
      netPay: "₦281,103.41",
    },
    {
      name: "Samuel Obi",
      department: "Business Development",
      grade: "Senior Staff -1",
      basicSalary: "₦310,000.00",
      housingAllow: "₦24,000.00",
      wardrobeAllow: "₦18,000.00",
      transportAllow: "₦40,000.00",
      medicalAllow: "₦9,000.00",
      netPay: "₦178,800.69",
    },
    {
      name: "Blessing Udo",
      department: "Research",
      grade: "Senior Staff -1",
      basicSalary: "₦400,000.00",
      housingAllow: "₦12,000.00",
      wardrobeAllow: "₦8,000.00",
      transportAllow: "₦40,000.00",
      medicalAllow: "₦9,000.00",
      netPay: "₦371,068.05",
    },
  ];

  useEffect(() => {
    setEmployees(mockEmployees);
  }, []);

  const mockBreakdowns = [
    {
      name: "Windy Gold",
      department: "Business Development",
      grade: "Full Staff",
      basicSalary: 300000,
      housingAllow: 20000,
      wardrobeAllow: 10000,
      transportAllow: 50000,
      medicalAllow: 12000,
      grossPay: 392000,
      deductions: 77847.47,
      netPay: 314152.53,
    },
    {
      name: "Kelechi Amadi",
      department: "Information Technology",
      grade: "Junior Staff -2",
      basicSalary: 280000,
      housingAllow: 12000,
      wardrobeAllow: 8000,
      transportAllow: 40000,
      medicalAllow: 9000,
      grossPay: 349000,
      deductions: 67896.59,
      netPay: 281103.41,
    },
    {
      name: "Hauwa Lawal",
      department: "Finance & Accounts",
      grade: "Junior Staff -2",
      basicSalary: 280000,
      housingAllow: 12000,
      wardrobeAllow: 8000,
      transportAllow: 40000,
      medicalAllow: 9000,
      grossPay: 349000,
      deductions: 67896.59,
      netPay: 281103.41,
    },
    {
      name: "Samuel Obi",
      department: "Business Development",
      grade: "Senior Staff -1",
      basicSalary: 310000,
      housingAllow: 24000,
      wardrobeAllow: 18000,
      transportAllow: 40000,
      medicalAllow: 9000,
      grossPay: 401000,
      deductions: 222199.31,
      netPay: 178800.69,
    },
    {
      name: "Blessing Udo",
      department: "Research",
      grade: "Senior Staff -1",
      basicSalary: 400000,
      housingAllow: 12000,
      wardrobeAllow: 8000,
      transportAllow: 40000,
      medicalAllow: 9000,
      grossPay: 469000,
      deductions: 97931.95,
      netPay: 371068.05,
    },
  ];

  const mockWorkflow = [
    {
      step: "Draft",
      title: "Draft Created",
      description: "Payroll was created by HR Admin",
      date: "Sept 24, 2026 · 9:00 AM",
      status: "completed",
      actor: "HR Admin",
    },
    {
      step: "Submitted",
      title: "Submitted for Review",
      description: "Payroll submitted for accounts review",
      date: "Sept 25, 2026 · 10:45 AM",
      status: "current",
      actor: "HR Admin",
    },
    {
      step: "Approval",
      title: "Accounts Review",
      description: "Pending approval by Accounts Department",
      date: "",
      status: "pending",
      actor: "Accounts Department",
    },
    {
      step: "Published",
      title: "Publish Payroll",
      description: "Payroll will be published after approval",
      date: "",
      status: "pending",
      actor: "System",
    },
  ];

  const mockAuditTrail = [
    {
      action: "Created",
      description: "Payroll draft created by HR Admin",
      user: "HR Admin",
      role: "HR Manager",
      timestamp: "Sept 24, 2026 · 9:00 AM",
      ip: "192.168.1.1",
    },
    {
      action: "Updated",
      description: "Updated employee earnings and deductions",
      user: "HR Admin",
      role: "HR Manager",
      timestamp: "Sept 24, 2026 · 2:30 PM",
      ip: "192.168.1.1",
    },
    {
      action: "Submitted",
      description: "Submitted for Accounts Department review",
      user: "HR Admin",
      role: "HR Manager",
      timestamp: "Sept 25, 2026 · 10:45 AM",
      ip: "192.168.1.1",
    },
    {
      action: "Viewed",
      description: "Opened payroll record",
      user: "Accounts Dept",
      role: "Finance Officer",
      timestamp: "Sept 25, 2026 · 11:20 AM",
      ip: "192.168.1.45",
    },
  ];

  const formatCurrency = (value) => {
    return `₦${value.toLocaleString()}`;
  };

  return (
    <>
      <main className="flex-1 p-8">
        <div className=" mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="hover:text-gray-900 cursor-pointer">Payroll</span>
            <span>/</span>
            <span className="hover:text-gray-900 cursor-pointer">
              Payroll Batches
            </span>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {payrollDetails.periodName}
            </span>
          </nav>

          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {payrollDetails.periodName}
              </h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md font-medium">
                {payrollDetails.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                <MdDownload size={18} />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                More actions
                <MdExpandMore size={18} />
              </button>
              <button className="px-4 py-2 bg-[#9eceec] text-black font-bold rounded-lg hover:bg-[#7db8d8] transition-colors text-sm">
                Submit Payroll for Review
              </button>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-gray-600 mb-8">
            Payroll for {payrollDetails.dateRange}
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {/* Total Employees */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <MdPerson className="text-blue-600" size={24} />
                </div>
                <h3 className="text-sm font-medium text-gray-600">
                  Total Employees
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {payrollDetails.totalEmployees}
              </p>
              <p className="text-sm text-gray-500 mt-1">Employees in payroll</p>
            </div>

            {/* Gross Payroll */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <MdAccountBalanceWallet className="text-green-600" size={24} />
                </div>
                <h3 className="text-sm font-medium text-gray-600">
                  Gross Payroll
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(payrollDetails.grossPayroll)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total earnings</p>
            </div>

            {/* Total Deductions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <MdReceiptLong className="text-red-600" size={24} />
                </div>
                <h3 className="text-sm font-medium text-gray-600">
                  Total Deductions
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(payrollDetails.totalDeductions)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total deductions</p>
            </div>

            {/* Total Net Pay */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <MdAccountBalance className="text-purple-600" size={24} />
                </div>
                <h3 className="text-sm font-medium text-gray-600">
                  Total Net Pay
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(payrollDetails.totalNetPay)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total take home pay</p>
            </div>

            {/* Current Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Current Status
              </h3>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span className="text-gray-900 font-medium text-sm">
                  Pending Accounts Review
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Submitted and awaiting review by Accounts Department
              </p>
            </div>
          </div>

          {/* Workflow Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Prepared By
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <MdPerson className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {payrollDetails.preparedBy.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payrollDetails.preparedBy.role}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Submitted
                </h4>
                <div className="flex items-center gap-2">
                  <MdEvent className="text-gray-400" size={18} />
                  <p className="text-sm text-gray-900">
                    {payrollDetails.submittedAt}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Next Approval
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <MdPerson className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {payrollDetails.nextApproval.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payrollDetails.nextApproval.role}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Last Updated
                </h4>
                <div className="flex items-center gap-2">
                  <MdEvent className="text-gray-400" size={18} />
                  <p className="text-sm text-gray-900">
                    {payrollDetails.lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Table Section */}
          {activeTab === "Payroll Summary" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  placeholder="Search employee..."
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <div className="flex items-center gap-3">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Departments</option>
                    <option>Business Development</option>
                    <option>Information Technology</option>
                    <option>Finance & Accounts</option>
                    <option>Research</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    <MdFilterList size={18} />
                    Filters
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Basic Salary
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Housing Allow.
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Wardrobe Allow.
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transport Allow.
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Medical Allow.
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Net Pay
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedEmployees.map((emp, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {emp.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {emp.department}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {emp.grade}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">
                            {emp.basicSalary}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">
                            {emp.housingAllow}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">
                            {emp.wardrobeAllow}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">
                            {emp.transportAllow}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">
                            {emp.medicalAllow}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                            {emp.netPay}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Showing {employees.length > 0 ? startIndex + 1 : 0} to {endIndex} of {employees.length} employees
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdChevronLeft size={18} />
                  </button>

                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={page > totalPages}
                      className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${
                        currentPage === page
                          ? "bg-[#4f46e5] text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      } ${page > totalPages ? "opacity-30 cursor-not-allowed" : ""}`}
                    >
                      {page}
                    </button>
                  ))}

                  {totalPages > 4 && <span className="text-gray-400">...</span>}

                  {totalPages > 4 && (
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={`w-8 h-8 flex items-center justify-center rounded border text-sm font-medium ${
                        currentPage === totalPages
                          ? "bg-[#4f46e5] text-white border-[#4f46e5]"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Payroll Breakdown" && (
            <div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Deductions</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% Deductions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockBreakdowns.map((row, index) => {
                        const deductionPercent = ((row.deductions / row.grossPay) * 100).toFixed(1);
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{row.department}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{row.grade}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-right">{formatCurrency(row.grossPay)}</td>
                            <td className="px-6 py-4 text-sm text-red-600 text-right">{formatCurrency(row.deductions)}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{formatCurrency(row.netPay)}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${deductionPercent}%` }} />
                                </div>
                                <span className="text-xs text-gray-600 w-12 text-right">{deductionPercent}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-sm text-gray-500 mb-1">Total Gross Payroll</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(18450000)}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-sm text-gray-500 mb-1">Total Deductions</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(2180000)}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <p className="text-sm text-gray-500 mb-1">Total Net Pay</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(16270000)}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Approval Workflow" && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="relative">
                {mockWorkflow.map((step, index) => (
                  <div key={index} className="flex gap-6 relative">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          step.status === "completed"
                            ? "bg-green-100 text-green-700 border-2 border-green-500"
                            : step.status === "current"
                            ? "bg-orange-100 text-orange-700 border-2 border-orange-500"
                            : "bg-gray-100 text-gray-400 border-2 border-gray-300"
                        }`}
                      >
                        {step.status === "completed" ? "✓" : index + 1}
                      </div>
                      {index < mockWorkflow.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 min-h-[60px] ${
                            step.status === "completed" ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-8 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{step.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          <p className="text-xs text-gray-400 mt-1">Actor: {step.actor}</p>
                        </div>
                        {step.date && (
                          <span className="text-xs text-gray-500 whitespace-nowrap">{step.date}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Audit Trail" && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockAuditTrail.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700">
                            {row.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{row.user}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.role}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{row.timestamp}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{row.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Run Payroll">
        <CreatePayroll onSuccess={handleCloseModal} />
      </Modal>
    </>
  );
};

export default PayrollDashboard;
