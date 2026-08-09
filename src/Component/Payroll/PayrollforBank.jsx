import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  bankPayrollCollumn,
} from "../../utils/PayrollHelpers";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import { useToastContext } from "../../Context/ToastContext";
import LoadingState from "../reuseables/LoadingState";
import Loader from "../reuseables/Loader";
import { api } from "../../api/request";
const GeneratePayrollForBank = () => {
  const { showSuccess, showError } = useToastContext();
  const [payroll, setPayroll] = useState([]);
  const [department, setDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [payDate, setPayDate] = useState("");
  const [payrollByDepartment, setPayrollByDepartment] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getPayroll = async () => {
      try {
        setLoading(true);
        const response = await api.get("/employee/payroll/list",);
        if (response.data.success) {
          const res = response.data.payroll.map((pay) => ({
            EmployeeName: pay.employeeId.userId.fullname,
            Bank: pay.employeeId.job.bankName,
            Account: pay.employeeId.job.bankAccountNumber,
            NetPay: pay.netSalary,
          }));
          setPayroll(res);
          setLoading(false);
        } else {
          showError(response.data.error);
          setLoading(false);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
        setLoading(false);
      }
    };
    getPayroll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3001/api/employee/payroll/department/",
        { payDate, department: selectedDepartment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        const res = response.data.filteredPayrollByDepartment.map((pay) => ({
          EmployeeName: pay.employeeId.userId.fullname,
          Department: pay.employeeId.job.department.department_Name,
          Grade: pay.employeeId.job.grade.gradeName,
          Period: pay.period,
          NetPay: pay.netSalary,
          Status: pay.status,
        }));
        setPayrollByDepartment(res);
        showSuccess("Payroll Successful");

        setLoading(false);
      } else {
        showError(response.data.error);
        setLoading(false);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        showError(error.response.data.error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const getDepartments = async () => {
      const deps = await fetchDepartments(showError);
      setDepartment(deps);
    };
    getDepartments();
  }, []);

  const isPayroll = payroll.length > 0;
  return (
    <LoadingState loading={loading} loadingText="Loading payroll data...">
      <div className="px-3 flex justify-between">
        <div>
          <h2 className="text-2xl text-black font-bold pt-8 pb-5 font-sans">
            Payroll Details
          </h2>
          <p className="text-sm text-black/80 font-thin pb-5 font-sans">
            View and manage your payroll for your employee
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between pt-3 pr-7 space-x-6">
            <select
              name="department"
              id=""
              className="border px-2 py-1 w-[200px] h-[36px] mt-7 rounded-full text-sm"
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">Select department</option>
              {department.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.department_Name}
                </option>
              ))}
            </select>
            <input
              type="month"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              className="border px-2 py-1 w-[200px] h-[36px] mt-7 rounded-full text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 mt-7 py-2.5 rounded-lg text-black bg-[#9eceec] font-bold text-sm shadow-sm hover:bg-white/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader size="sm" /> : null}
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      {payrollByDepartment && payrollByDepartment.length > 0 ? (
        <div className="pl-3 mr-10 pr-10">
          <DataTable
            columns={bankPayrollCollumn}
            data={payrollByDepartment}
            pagination
          />
        </div>
      ) : isPayroll ? (
        <div className="pl-3 mr-10 pr-10">
          <DataTable columns={bankPayrollCollumn} data={payroll} pagination />
        </div>
      ) : (
        <div>Payroll list loaded ✅</div>
      )}
    </LoadingState>
  );
};

export default GeneratePayrollForBank;
