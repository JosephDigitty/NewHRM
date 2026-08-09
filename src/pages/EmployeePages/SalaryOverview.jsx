import React, { useEffect } from "react";
import SummaryCards from "../../Component/EmployeeComponents/SummaryCards";
import Allowances from "../../Component/EmployeeComponents/Allowances";
import Deductions from "../../Component/EmployeeComponents/Deductions";
import SalaryCalculation from "../../Component/EmployeeComponents/SalaryCalculation";
import { DollarSign, Wallet, CalendarDays } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../Context/authContext";
import { useToastContext } from "../../Context/ToastContext";
import axios from "axios";
import { api } from "../../api/request";

const SalaryOverview = () => {
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
        const res = await api.get( `/employee/payroll/${id}`, );
        if (res.data.success) {
          setPayroll(res.data.payroll);

          showSuccess(res.data.message);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
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
  const lastDayCurrentMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );
  const lastDayPreviousMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    0
  );
  const lastPayrollIndex = payroll?.length - 1;
  const ded1 = payroll[lastPayrollIndex]?.monthlyPAYE;
  const ded2 = payroll[lastPayrollIndex]?.pensionPerMonth;
  const totalDeductions = ded1 + ded2;
  const ActualGrossPay = payroll[lastPayrollIndex]?.totalEarnings || 0;
  const grossPay = formatCurrency(ActualGrossPay);
  const ActualNetPay = ActualGrossPay - totalDeductions || 0;
  const netPay = formatCurrency(ActualNetPay);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Current Salary Overview</h1>
      <p>Current Salary Overview</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCards
          icon={<DollarSign size={20} />}
          title="Gross Pay"
          value={grossPay}
          subtitle="monthly"
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
        />

        <SummaryCards
          icon={<Wallet size={20} />}
          title="Net Pay"
          value={netPay}
          subtitle="Take home amount"
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
        />

        <SummaryCards
          icon={<CalendarDays size={20} />}
          title="Next pay date"
          value={lastDayCurrentMonth.toLocaleDateString("en-US")}
          subtitle={`Last Paid: ${lastDayPreviousMonth.toLocaleDateString(
            "en-US"
          )}`}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
      </div>
      <Allowances />
      <Deductions />
      <SalaryCalculation />
    </div>
  );
};

export default SalaryOverview;
