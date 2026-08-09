import React, { useEffect, useState } from "react";
import SummaryCards from "../../Component/EmployeeComponents/SummaryCards";
import PaymentRows from "../../Component/EmployeeComponents/PaymentRows";
import { useAuth } from "../../Context/authContext";
import { useToastContext } from "../../Context/ToastContext";
import axios from "axios";
import { api } from "../../api/request";

const PayslipHistory = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToastContext();
  const id = user?._id;

  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(false);
    const fetchPayroll = async () => {
      try {
        const res = await api.get(`/employee/payroll/${id}`,);
        if (res.data.success) {
          setPayroll(res.data.payroll);

          showSuccess(res.data.message);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        } else {
          showError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const payrollNumber = payroll?.length;
  const lastPayrollIndex = payroll?.length - 1;
  const ded1 = payroll[lastPayrollIndex]?.monthlyPAYE;
  const ded2 = payroll[lastPayrollIndex]?.pensionPerMonth;
  const totalDeductions = ded1 + ded2;
  const ActualGrossPay = payroll[lastPayrollIndex]?.totalEarnings || 0;
  const grossPay = formatCurrency(ActualGrossPay);
  const ActualNetPay = ActualGrossPay - totalDeductions || 0;
  const netPay = formatCurrency(ActualNetPay);
  const period = payroll?.period;

  let sum = 0;

  for (let i = 0; i < payroll?.length; i++) {
    sum += Number(payroll[i]?.netSalary);
  }

  const payments = payroll?.map((p) => ({
    employeeName: p.employeeId.userId.fullname,
    period: p.payrollperiodName,
    sub: p.period,
    gross: Math.round(Number(p.totalEarnings)).toLocaleString(),
    net: Number(
      p.netSalary
    ).toLocaleString(),
    salary: Math.round(Number(p.basicSalary)).toLocaleString(),
    housingAllowance: Number(p.housingAllowance).toLocaleString(),
    wardrobeAllowance: Number(p.wardrobeAllowance).toLocaleString(),
    transportAllowance: Number(p.transportAllowance).toLocaleString(),
    medicalAllowance: Number(p.medicalAllowance).toLocaleString(),
    pension: Number(p.pensionPerMonth).toLocaleString(),
    paye: Math.round(Number(p.monthlyPAYE)).toLocaleString(),
    totalDeductions: Math.round(Number(p.pensionPerMonth + p.monthlyPAYE)).toLocaleString(),
    status: p.status,
    date: p.period,
    oneTimeAllowances: p.oneTimeAllowances || [],
    oneTimeDeductions: p.oneTimeDeductions || [],
    permAllowances: p.permAllowances || [],
    permDeductions: p.permDeductions || []
  }));

  return (
    <div className="p-10 bg-[#dfe8ee] min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Payslip History</h1>
        <p className="text-gray-600 text-sm">
          View and download your previous payslips.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <SummaryCards
          title="Payslip History"
          value={payrollNumber}
          subtitle="number of paychecks"
          icon="📄"
        />
        <SummaryCards
          title="Last Payment"
          value={netPay}
          subtitle=""
          icon="💵"
        />
        <SummaryCards
          title="YTD Earnings"
          value={formatCurrency(sum)}
          subtitle="Year to Date"
          icon="💳"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow mt-10 overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold">Payment History</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Pay period</th>
              <th className="p-4">Gross pay</th>
              <th className="p-4">Net pay</th>
              <th className="p-4">Status</th>
              <th className="p-4">Pay date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <PaymentRows key={i} {...p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayslipHistory;
