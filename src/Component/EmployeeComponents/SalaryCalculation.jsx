import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/authContext";
import axios from "axios";
import { useToastContext } from "../../Context/ToastContext";
import { api } from "../../api/request";

export const SalaryCalculation = () => {
  const { showError } = useToastContext();
  const { user } = useAuth();
  const id = user?._id;

  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(false);
    const fetchPayroll = async () => {
      try {
        const res = await api.get(
          `/employee/payroll/${id}`,
        );
        if (res.data.success) {
          setPayroll(res.data.payroll);
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
  const lastPayrollIndex = payroll?.length - 1 || 0;
  const BaseSalary = payroll[lastPayrollIndex]?.basicSalary || 0;
  const ded1 = payroll[lastPayrollIndex]?.monthlyPAYE || 0;
  const ded2 = payroll[lastPayrollIndex]?.pensionPerMonth || 0;
  const totalDeductions = ded1 + ded2;
  const all1 = payroll[lastPayrollIndex]?.housingAllowance || 0;
  const all2 = payroll[lastPayrollIndex]?.transportAllowance || 0;
  const all3 = payroll[lastPayrollIndex]?.medicalAllowance || 0;
  const all4 = payroll[lastPayrollIndex]?.wardrobeAllowance || 0;
  const totalAllowance = all1 + all2 + all3 + all4;
  const grossSalary = BaseSalary + totalAllowance;
  const netSalary = grossSalary - totalDeductions;
  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Salary Calculation</h3>

      <div className="flex justify-between mb-2">
        <span>Base Salary</span>
        <span className="font-medium">₦ {BaseSalary.toLocaleString()}</span>
      </div>

      <div className="text-green-600 flex justify-between mb-2">
        <span>+ Total Allowances</span>
        <span>₦ {totalAllowance.toLocaleString()}</span>
      </div>

      <div className="border-t my-3"></div>

      <div className="flex justify-between mb-2">
        <span>Gross Pay</span>
        <span className="font-medium">₦ {grossSalary.toLocaleString()}</span>
      </div>

      <div className="text-red-600 flex justify-between mb-2">
        <span>- Total Deductions</span>
        <span>₦ -{totalDeductions.toLocaleString()}</span>
      </div>

      <div className="mt-4 bg-blue-100 p-3 rounded-lg font-semibold flex justify-between">
        <span>Net pay</span>
        <span className="text-green-600">₦ {netSalary.toLocaleString()}</span>
      </div>
    </div>
  );
};
export default SalaryCalculation;
