import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { PayrollPermanentButtons, columns } from "../../utils/EmployeeHelper";
import axios from "axios";
import LoadingState from "../reuseables/LoadingState";
import { useToastContext } from "../../Context/ToastContext";
import { api } from "../../api/request";
const EmployeePermanent = () => {
  const { showError } = useToastContext();
  const [employees, setEmployees] = useState([]);
  const [emloading, setEmloading] = useState(false);
  const [filterEmployee, setFilterEmployee] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmloading(true);
      try {
        const response = await api.get("/employee");
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.employees.map((employee) => ({
            _id: employee._id,
            sno: sno++,
            department_Name: employee.job.department.department_Name,
            name: employee.userId.fullname,
            profileImage: (
              <img
                src={`http://localhost:3001/uploads/${employee.userId.profileImage}`}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
            ),
            Action: <PayrollPermanentButtons id={employee._id} />,
          }));
          setEmployees(data);
          setFilterEmployee(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
        showError(error.message);
      } finally {
        setEmloading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
    const records = employees.filter((emp) =>
      emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilterEmployee(records);
  };

  return (
    <LoadingState
      loading={emloading}
      loadingText="Loading permanent employees..."
    >
      <div className="px-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold">Manage Employee</h3>
        </div>
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by Employee name"
            className="px-4 py-0.5 border"
            onChange={handleFilter}
          />
        </div>
        <div className="mt-5">
          <DataTable columns={columns} data={filterEmployee} pagination />
        </div>
      </div>
    </LoadingState>
  );
};

export default EmployeePermanent;
