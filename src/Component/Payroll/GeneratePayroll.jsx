import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { allPayrollCollumn } from "../../utils/PayrollHelpers";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import LoadingState from "../reuseables/LoadingState";
import { useToastContext } from "../../Context/ToastContext";
import { api } from "../../api/request";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const GeneratePayroll = () => {
  const { showSuccess, showError } = useToastContext();
  const [payroll, setPayroll] = useState([]);
  const [department, setDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [payDate, setPayDate] = useState("");
  const [payrollByDepartment, setPayrollByDepartment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getPayroll = async () => {
      try {
        setLoading(true);
        const response = await api.get("/employee/payroll/list" );
        if (response.data.success) { 
          const res = response.data.payroll.map((pay) => ({
          EmployeeName: pay.employeeId.userId.fullname,
          Department: pay.employeeId.job?.department?.department_Name,
          Grade: pay.employeeId.job?.grade?.gradeName,
          basicSalary: pay.basicSalary,
          housingAllowance: pay.housingAllowance,
          wardrobeAllowance:pay.wardrobeAllowance,
          transportAllowance:pay.transportAllowance,
          medicalAllowance: pay.medicalAllowance,
          Period: pay.period,
          NetPay: pay.netSalary,
          Status: pay.status,
          }));
          setPayroll(res);
          setLoading(false);
        } else {
          showError(response.data.error);
          setError(response.data.error);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
      }
    };
    getPayroll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post(
        "/employee/payroll/department/",
        { payDate, department: selectedDepartment },
      );
      if (response.data.success) {
        const res = response.data.filteredPayrollByDepartment.map((pay) => ({
          EmployeeName: pay.employeeId.userId.fullname,
          Department: pay.employeeId.job?.department?.department_Name,
          Grade: pay.employeeId.job?.grade?.gradeName,
          basicSalary: pay.basicSalary,
          housingAllowance: pay.housingAllowance,
          wardrobeAllowance:pay.wardrobeAllowance,
          transportAllowance:pay.transportAllowance,
          medicalAllowance: pay.medicalAllowance,
          Period: pay.period,
          NetPay: pay.netSalary,
          Status: pay.status,
        }));
        setPayrollByDepartment(res);
        showSuccess("Payroll generated successfully");

        setLoading(false);
      } else {
        showError(response.data.error);
        setError(response.data.error);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        showError(error.response.data.error);
      }
    } finally {
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

  const downloadExcel = () => {
  // decide which data to export
  const dataToExport =
    payrollByDepartment.length > 0 ? payrollByDepartment : payroll;

  if (!dataToExport || dataToExport.length === 0) {
    showError("No data available to download");
    return;
  }

  // convert JSON → worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  // create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll");

  // generate buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // save file
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, `Payroll_${new Date().toISOString()}.xlsx`);
};

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
              className="px-6 mt-7 py-2.5 rounded-lg text-black bg-[#9eceec] font-bold text-sm shadow-sm hover:bg-white/60 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {payrollByDepartment && payrollByDepartment.length > 0 ? (
        <div className="pl-3 mr-10 pr-10">
          <DataTable
            columns={allPayrollCollumn}
            data={payrollByDepartment}
            pagination
          />
        </div>
      ) : isPayroll ? (
        <div className="pl-3 mr-10 pr-10">
          <DataTable columns={allPayrollCollumn} data={payroll} pagination />
        </div>
      ) : (
        <div>Payroll list loaded ✅</div>
      )}

      <div className="flex justify-end mr-18">
       <button 
       onClick={() => {
      console.log("clicked");
      downloadExcel()}}
       className="px-6 mt-7 py-2.5 rounded-lg text-black bg-[#9eceec] font-bold text-sm shadow-sm hover:bg-white/60 transition-colors">
       download
       </button>
      </div>
    </LoadingState>
  );
};

export default GeneratePayroll;
