import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/authContext";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";

export const Allowances = () => {
  const { showSuccess, showError } = useToastContext();
  const { user } = useAuth();
  const id = user?._id;

  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(false);
    const fetchPayroll = async () => {
      try {
        const res = await api.get(`/employee/payroll/${id}`);
        if (res.data.success) {
          setPayroll(res.data.payroll);

          showSuccess(res.data.message);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
          showError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, [id]);
  const lastPayrollIndex = payroll?.length - 1;
  const data = payroll[lastPayrollIndex]
    ? [
        {
          label: "Housing Allowance",
          amount: payroll[lastPayrollIndex].housingAllowance,
        },
        {
          label: "Transport Allowance",
          amount: payroll[lastPayrollIndex].transportAllowance,
        },
        {
          label: "Medical Allowance",
          amount: payroll[lastPayrollIndex].medicalAllowance,
        },
        {
          label: "Wardrobe Allowance",
          amount: payroll[lastPayrollIndex].wardrobeAllowance,
        },
      ]
    : [];
  const all1 = payroll[lastPayrollIndex]?.housingAllowance;
  const all2 = payroll[lastPayrollIndex]?.transportAllowance;
  const all3 = payroll[lastPayrollIndex]?.medicalAllowance;
  const all4 = payroll[lastPayrollIndex]?.wardrobeAllowance;
  const totalAllowance = all1 + all2 + all3 + all4;
  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Allowances & Benefits</h3>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label} className="flex justify-between">
            <span>{item.label}</span>
            <span className="text-green-600 font-medium">
              ₦{item.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-blue-100 p-3 rounded-lg font-semibold flex justify-between">
        <span>Total allowances</span>
        <span>₦{totalAllowance.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default Allowances;
