import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { allPensionCollumn } from "../../utils/PayrollHelpers";
import { useToastContext } from "../../Context/ToastContext";
import LoadingState from "../reuseables/LoadingState";
import Loader from "../reuseables/Loader";
import { api } from "../../api/request";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const GeneratePayee = () => {
  const { showSuccess, showError } = useToastContext();
  const [payee, setPayee] = useState([]);
  const [payDate, setPayDate] = useState("");
  const [payeePeriod, setPayeePeriod] = useState([]);
  const [payeeByPeriod, setPayeeByPeriod] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  useEffect(() => {
    const getPayee = async () => {
      try {
        setLoading(true);
        const response = await api.get("/employee/payee/all",);
        if (response.data.success) {
          const res = response.data.payroll.map((pay) => ({
            EmployeeName: pay.employeeId.userId.fullname,
            Department: pay.employeeId.job?.department?.department_Name,
            Grade: pay.employeeId.job?.grade?.gradeName,
            Period: pay.period,
            Amount: pay.amount,
          }));
          setPayee(res);
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
    getPayee();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post(
        "/api/employee/payee/period/",
        { payDate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        const res = response.data.filteredPAYE.map((pay) => ({
          EmployeeName: pay.employeeId?.userId?.fullname,
          Department: pay.employeeId.job?.department?.department_Name,
          Grade: pay.employeeId.job?.grade?.gradeName,
          Period: pay.period,
          Amount: pay.amount,
        }));
        setPayeeByPeriod(res);
        showSuccess("Payroll Successful");

        setLoading(false);
        setPayeePeriod(response.data.filteredPAYE);
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
  const sumPayee = payeePeriod.reduce((acc, item) => acc + item.amount, 0);
  const payeeInNaira = formatCurrency(sumPayee);
  const isPayee = payee.length > 0;

      const downloadExcel = () => {
      // decide which data to export
      const dataToExport =
        payeeByPeriod.length > 0 ? payeeByPeriod : payee;
    
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
    
      saveAs(blob, `Paye_${new Date().toISOString()}.xlsx`);
    };
  return (
    <LoadingState loading={loading} loadingText="Loading PAYE data...">
      <div className="px-3 flex justify-between">
        <div>
          <h2 className="text-3xl text-black font-bold pt-8 pb-5 font-sans">
            Payee Details
          </h2>
          <p className="text-sm text-black/80 font-thin pb-5 font-sans">
            View and manage Payee Deduction for your employee
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between pt-3 pr-7 space-x-6">
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
      {payeeByPeriod && payeeByPeriod.length > 0 ? (
        <div className="pl-3 mr-10 pr-10">
          <p className="font-thin text-lg text-black font-sans pb-3">
            {`Total pension for the period is ${payeeInNaira}`}
          </p>
          <DataTable
            columns={allPensionCollumn}
            data={payeeByPeriod}
            pagination
          />
        </div>
      ) : isPayee ? (
        <div className="pl-3 mr-10 pr-10">
          <DataTable columns={allPensionCollumn} data={payee} pagination />
        </div>
      ) : (
        <div>loading...</div>
      )}
      <div className="flex justify-end mr-18">
       <button 
       onClick={() => {
        console.log("clicked")
      downloadExcel()}}
       className="px-6 mt-7 py-2.5 rounded-lg text-black bg-[#9eceec] font-bold text-sm shadow-sm hover:bg-white/60 transition-colors">
       download
       </button>
      </div>
    </LoadingState>
  );
};

export default GeneratePayee;
