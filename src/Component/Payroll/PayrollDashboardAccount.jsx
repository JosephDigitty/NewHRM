import React, { useEffect, useState } from "react";
import {
  MdAccountBalance,
  MdPerson,
  MdReceiptLong,
  MdRequestQuote,
  MdHealthAndSafety,
  MdAddCard,
  MdAccountBalanceWallet
} from "react-icons/md";
import ActionCard from "./PayrollReuseables/ActionCard";
import TableHeader from "./PayrollReuseables/TableHeaders";
import PayrollRow from "./PayrollReuseables/PayrollRow";
import Modal from "../reuseables/Modal";
import CreatePayroll from "./CreatePayroll";
import { getAllPayroll, getMonthlyPayrollData } from "../../utils/DyamicDashboard";
import { api } from "../../api/request";

const AccountPayrollDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartData, setChartData] = useState([])
  const [payrolls, setPayrolls] = useState([])
  const currentYear = new Date().getFullYear()
  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(`/employee/payroll/activities?year=${currentYear}`)
      if (res.data.success) {
        setPayrolls(res.data.payrolls)
        console.log(res.data)
        } else {
          console.log(res.data)
        }
    } 
    fetch()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const payrolls = await getAllPayroll()
      setPayrolls(payrolls)
      setChartData(getMonthlyPayrollData(payrolls))
      console.log(chartData)
    }
    fetchData()
  }, [])

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
//payrow 
  useEffect(() => {
  const getActivities = async () => {
    const res = await api.get("/employee/payroll/activities")
    if (res.data.success) {
      const payrolls = res.data.payrolls

      // Group by month
      const grouped = payrolls.reduce((acc, payroll) => {
        const month = new Date(payroll.payDate).toLocaleString("default", { month: "long", year: "numeric" })
        
        if (!acc[month]) {
          acc[month] = {
            payrollPeriodName: payroll.payrollperiodName,
            totalNetSalary: 0,
            totalEarnings: 0,
            employeeCount: 0,
            status: payroll.status,
            payDate: payroll.payDate,
          }
        }
        acc[month].totalNetSalary += payroll.netSalary || 0
        acc[month].totalEarnings += payroll.totalEarnings || 0
        acc[month].employeeCount += 1

        return acc
      }, {})

      // Convert object to array
      const result = Object.values(grouped)
      setPayrolls(result)
    }
  }
  getActivities()
}, [])

  return (
    <>
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Payroll Overview
              </h2>
              <p className="text-gray-900 mt-1">
                Manage your payroll efficiently and accurately.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleOpenModal}
                className="px-6 py-2.5 rounded-lg text-black bg-[#9eceec] font-bold text-sm shadow-sm hover:bg-white/60 transition-colors"
              >
                Run Payroll
              </button>
            </div>
          </div>

          {/* Run Payroll Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Run Payroll"
          >
            <CreatePayroll onSuccess={handleCloseModal} />
          </Modal>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              <ActionCard
                href="/user-exe-dashboard/hmo"
                icon={<MdHealthAndSafety size={30} />}
                label="Hmo Management"
              />
               <ActionCard
                href="/user-exe-dashboard/payroll/pension"
                icon={<MdAccountBalance size={30} />}
                label="Pension"
              />
              <ActionCard
                href="/user-exe-dashboard/payroll/payee"
                icon={<MdPerson size={30} />}
                label="Payee"
              />
              <ActionCard
                href="/user-exe-dashboard/payroll/itfs"
                icon={<MdReceiptLong size={30} />}
                label="ITFS"
              />
              <ActionCard
                href="/user-exe-dashboard/payroll/generate-Payroll"
                icon={<MdAddCard size={30} />}
                label="Generate Payroll for departments"
              />
              <ActionCard
                href="/user-exe-dashboard/payroll/generate-new"
                icon={<MdAddCard size={30} />}
                label="Generate Payroll"
              />
              <ActionCard
                href="/user-exe-dashboard/payroll/latest"
                icon={<MdAccountBalanceWallet size={30} />}
                label="Payroll Management"
              />
            </div>
          </div>
          {/* Recent Payroll Activities */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Recent Payroll Activities
            </h3>
            <div className="bg-background-light dark:bg-background-dark rounded-lg border border-[#70c6ff]/20 dark:border-[#70c6ff]/30 overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#70c6ff]/5 dark:bg-[#70c6ff]/10">
                  <tr>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Payroll Name</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Employees</TableHeader>
                    <TableHeader>Total Amount</TableHeader>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#70c6ff]/20 dark:divide-[#70c6ff]/30">
                  <PayrollRow
                    date="2024-07-26"
                    name="July Payroll"
                    status="Completed"
                    employees={15}
                    amount="$25,000"
                  />
                  <PayrollRow
                    date="2024-07-12"
                    name="Bi-Weekly Payroll"
                    status="Completed"
                    employees={10}
                    amount="$12,500"
                  />
                  <PayrollRow
                    date="2024-06-28"
                    name="June Payroll"
                    status="Completed"
                    employees={15}
                    amount="$24,500"
                  />
                  <PayrollRow
                    date="2024-06-14"
                    name="Bi-Weekly Payroll"
                    status="Completed"
                    employees={10}
                    amount="$12,000"
                  />
                  <PayrollRow
                    date="2024-05-31"
                    name="May Payroll"
                    status="Completed"
                    employees={15}
                    amount="$24,000"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AccountPayrollDashboard;
