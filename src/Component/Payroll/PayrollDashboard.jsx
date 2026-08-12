import React, { useEffect, useState } from "react";
import {
  MdAccountBalance,
  MdPerson,
  MdReceiptLong,
  MdAccountBalanceWallet,
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
import Breadcrumb from "./PayrollReuseables/Breadcrumb";
import PageHeader from "./PayrollReuseables/PageHeader";
import StatsCards from "./PayrollReuseables/StatsCards";
import WorkflowSection from "./PayrollReuseables/WorkflowSection";
import Tabs from "./PayrollReuseables/Tabs";
import Pagination from "./PayrollReuseables/Pagination";
import EmployeeTable from "./PayrollReuseables/EmployeeTable";
import PayrollBreakdownTab from "./PayrollReuseables/PayrollBreakdownTab";
import ApprovalWorkflowTab from "./PayrollReuseables/ApprovalWorkflowTab";
import AuditTrailTab from "./PayrollReuseables/AuditTrailTab";

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
          <Breadcrumb periodName={payrollDetails.periodName} />

          <PageHeader
            periodName={payrollDetails.periodName}
            status={payrollDetails.status}
            dateRange={payrollDetails.dateRange}
          />

          <StatsCards
            totalEmployees={payrollDetails.totalEmployees}
            grossPayroll={payrollDetails.grossPayroll}
            totalDeductions={payrollDetails.totalDeductions}
            totalNetPay={payrollDetails.totalNetPay}
            status="Pending Accounts Review"
            statusDescription="Submitted and awaiting review by Accounts Department"
          />

          <WorkflowSection
            preparedBy={payrollDetails.preparedBy}
            submittedAt={payrollDetails.submittedAt}
            nextApproval={payrollDetails.nextApproval}
            lastUpdated={payrollDetails.lastUpdated}
          />

          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

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

              <EmployeeTable
                employees={paginatedEmployees}
                columns={[
                  { header: "Employee Name", align: "left" },
                  { header: "Department", align: "left" },
                  { header: "Grade", align: "left" },
                  { header: "Basic Salary", align: "right" },
                  { header: "Housing Allow.", align: "right" },
                  { header: "Wardrobe Allow.", align: "right" },
                  { header: "Transport Allow.", align: "right" },
                  { header: "Medical Allow.", align: "right" },
                  { header: "Net Pay", align: "right" },
                ]}
                renderRow={(emp, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.grade}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">{emp.basicSalary}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">{emp.housingAllow}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">{emp.wardrobeAllow}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">{emp.transportAllow}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">{emp.medicalAllow}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{emp.netPay}</td>
                  </tr>
                )}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPrev={handlePrev}
                onNext={handleNext}
                showingText={`Showing ${employees.length > 0 ? startIndex + 1 : 0} to ${endIndex} of ${employees.length} employees`}
              />
            </div>
          )}

          {activeTab === "Payroll Breakdown" && (
            <PayrollBreakdownTab
              breakdowns={mockBreakdowns}
              formatCurrency={formatCurrency}
              totals={{ gross: 18450000, deductions: 2180000, net: 16270000 }}
            />
          )}

          {activeTab === "Approval Workflow" && (
            <ApprovalWorkflowTab steps={mockWorkflow} />
          )}

          {activeTab === "Audit Trail" && (
            <AuditTrailTab auditData={mockAuditTrail} />
          )}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Run Payroll">
        <CreatePayroll onSuccess={handleCloseModal} />
      </Modal>
    </>
  );
};

export default PayrollDashboard;
