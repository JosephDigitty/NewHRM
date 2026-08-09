import { useEffect, useState } from "react";
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useToastContext } from "../../Context/ToastContext";

const AddSalary = () => {
  const navigate = useNavigate();
  const [departments, setdepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [salary, setSalary] = useState({
    employeeId: "",
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    department: null,
    payDate: null,
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { showError } = useToastContext();

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments(showError);
      setdepartments(departments);
    };
    getDepartments();
  }, []);
  useEffect(() => {}, [departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSalary((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleDepartment = async (e) => {
    const emps = await getEmployees(e.target.value, showError);
    setEmployees(emps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3001/api/salary/add`,
        salary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/Employees");
      }
    } catch (error) {
      if (error.response && !error.response.data.sucess) {
        showError(error.response.data.error);
      }
    }
  };
  return (
    <>
      {departments ? (
        <div className="max-w-4xl max-auto mt-10 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6">Add Salary</h2>
          <form onSubmit={handleSubmit}>
            {/* department */}
            <div>
              <label
                name="department"
                className="block text-sm font-medium text-gray-700"
              >
                {" "}
                Department{" "}
              </label>
              <select
                name="department"
                onChange={handleDepartment}
                className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.department_Name}
                  </option>
                ))}
              </select>
            </div>
            {/* employee */}
            <div>
              <label
                name="employeeId"
                className="block text-sm font-medium text-gray-700"
              >
                {" "}
                Employee{" "}
              </label>
              <select
                name="employeeId"
                onChange={handleChange}
                className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.userId.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {" "}
                  Basic Salary{" "}
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  onChange={handleChange}
                  placeholder="Basic Salary"
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              {/* Allownaces */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {" "}
                  Allowances{" "}
                </label>
                <input
                  type="number"
                  name="allowances"
                  onChange={handleChange}
                  placeholder="Insert Salary"
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              {/* Deductions*/}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {" "}
                  Deductions{" "}
                </label>
                <input
                  type="number"
                  name="deductions"
                  onChange={handleChange}
                  placeholder="Insert Salary"
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                />
              </div>
              {/* PayDate */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pay Date
                </label>
                <input
                  type="date"
                  name="payDate"
                  placeholder="Insert Date of Birth"
                  className="mt-1 p-2 block w-full border rounded-md border-gray-300"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
            <button className="px-4 py-1 w-full text-white my-3 bg-teal-600 mr-6 ml-3 rounded-md cursor-pointer hover:bg-teal-800">
              Add Salary
            </button>
          </form>
        </div>
      ) : (
        <div className="max-w-4xl max-auto mt-10 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6">Employee not found</h2>
        </div>
      )}
    </>
  );
};

export default AddSalary;
