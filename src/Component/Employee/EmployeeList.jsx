import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { EmployeeButtons } from "../../utils/EmployeeHelper";
import LoadingState from "../reuseables/LoadingState";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";
const EmployeeList = () => {
  const { showError } = useToastContext();
  const [employees, setEmployees] = useState([]);
  const [emloading, setEmloading] = useState(false);
  const [filterEmployee, setFilterEmployee] = useState([]);

  const handleDeleted = (id) => {
    const data = employees.filter((emp) => emp._id !== id);
    setEmployees(data);
    setFilterEmployee(data);
  };
  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      width: "80px",
    },
    {
      name: "Image",
      selector: (row) => row.profileImage,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      width: "150px",
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department_Name,
      width: "150px",
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      width: "180px",
    },
    {
      name: "Grade",
      selector: (row) => row.grade,
      width: "150px",
    },
    {
      name: "Action",
      cell: (row) => (
        <EmployeeButtons id={row._id} handleDeleted={handleDeleted} />
      ),
    },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmloading(true);
      try {
        const response = await api.get("/employee");

        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees?.map((employee) => ({
            _id: employee._id,
            sno: sno++,
            department_Name: employee.job?.department?.department_Name,
            name: employee.userId.fullname,
            profileImage: (
              <img
                src={`${import.meta.env.VITE_UPLOADS_URL}/${
                  employee.userId.profileImage
                }`}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
            ),
            role: employee.job.position,
            grade: employee.job.grade.gradeName,
          }));

          setEmployees(data);
          setFilterEmployee(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
          console.log(error.response.data.error)
        } else {
          showError(
            error.message || "An error occurred while fetching employees"
          );
        }
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
    <LoadingState loading={emloading} loadingText="Loading employees...">
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
          <Link
            to="/admin-dashboard/add-employee"
            className="px-4 py-1 bg-teal-600 text-white rounded"
          >
            Add New Employee
          </Link>
        </div>
        <div className="mt-5">
          <DataTable columns={columns} data={filterEmployee} pagination />
        </div>
      </div>
    </LoadingState>
  );
};

export default EmployeeList;
