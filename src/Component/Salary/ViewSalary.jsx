import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom";
import { columns } from "../../utils/SalaryHelper";
import LoadingState from "../reuseables/LoadingState";
import { useToastContext } from "../../Context/ToastContext";

const ViewSalary = () => {
  const [salary, setSalary] = useState([]);
  const [filteredSalary, setFilteredSalary] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { showError } = useToastContext();

  useEffect(() => {
    const fecthSalaries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3001/api/salary/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          let sno = 1;
          const data = await response.data.salary.map((sal) => ({
            sno: sno++,
            staffId: sal.employeeId.employeeId,
            salary: sal.basicSalary,
            allowances: sal.allowances,
            deductions: sal.deductions,
            total: sal.netSalary,
            payDate: sal.payDate,
          }));

          setSalary(data);
          // setFilteredSalary(response.data.salary)
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
      } finally {
        setLoading(false);
      }
    };
    fecthSalaries();
  }, []);

  return (
    <div>
      <div className="px-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mt-5">Staff Salary Records</h3>
        </div>
        <div className="mt-5">
          <LoadingState
            loading={loading}
            loadingText="Loading salary records..."
          >
            <DataTable columns={columns} data={salary} pagination />
          </LoadingState>
        </div>
      </div>
    </div>
  );
};

export default ViewSalary;
