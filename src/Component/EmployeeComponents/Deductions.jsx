import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/authContext";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";

export const Deductions = () => {
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
        const res = await api.get(`employee/payroll/${id}`);
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
  const lastPayrollIndex = payroll?.length - 1;
  const data = payroll[lastPayrollIndex]
    ? [
        { label: "PAYE", amount: payroll[lastPayrollIndex].monthlyPAYE },
        { label: "pension", amount: payroll[lastPayrollIndex].pensionPerMonth },
      ]
    : [];
  const ded1 = payroll[lastPayrollIndex]?.monthlyPAYE;
  const ded2 = payroll[lastPayrollIndex]?.pensionPerMonth;
  const totalDeductions = ded1 + ded2;
  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Deductions</h3>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label} className="flex justify-between">
            <span>{item.label}</span>
            <span className="text-red-500 font-medium">
              ₦ -{item.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-blue-100 p-3 rounded-lg font-semibold flex justify-between">
        <span>Total Deductions</span>
        <span className="text-red-600">
          ₦{totalDeductions.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default Deductions;
