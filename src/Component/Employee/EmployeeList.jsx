import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { EmployeeButtons } from "../../utils/EmployeeHelper";
import LoadingState from "../reuseables/LoadingState";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";
import {
  FaArrowLeft,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaChevronDown,
  FaPlus,
} from "react-icons/fa";

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
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
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
          console.log(error.response.data.error);
        } else {
          showError(
            error.message || "An error occurred while fetching employees",
          );
        }
      } finally {
        setEmloading(false);
      }
    };

    fetchEmployees();
  }, [showError]);

  const handleFilter = (e) => {
    const query = e.target.value.toLowerCase();
    const records = employees.filter((emp) =>
      emp.name.toLowerCase().includes(query),
    );
    setFilterEmployee(records);
  };

  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      width: "80px",
      style: {
        fontSize: "14px",
        color: "#4c739a",
      },
    },
    {
      name: "Image",
      selector: (row) => row.profileImage,
      width: "80px",
      cell: (row) => (
        <div className="flex items-center justify-center">
          {row.profileImage}
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      width: "200px",
      sortable: true,
      style: {
        fontSize: "14px",
        color: "#0d141b",
        fontWeight: "500",
      },
    },
    {
      name: "Department",
      selector: (row) => row.department_Name,
      width: "180px",
      sortable: true,
      style: {
        fontSize: "14px",
        color: "#4c739a",
      },
    },
    {
      name: "Role",
      selector: (row) => row.role,
      width: "200px",
      style: {
        fontSize: "14px",
        color: "#4c739a",
      },
    },
    {
      name: "Grade",
      selector: (row) => row.grade,
      width: "150px",
      style: {
        fontSize: "14px",
        color: "#4c739a",
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <EmployeeButtons id={row._id} handleDeleted={handleDeleted} />
        </div>
      ),
      width: "150px",
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f8fafc",
        borderBottom: "2px solid #cfdbe7",
      },
    },
    headCells: {
      style: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#0d141b",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        color: "#0d141b",
        borderBottom: "1px solid #f1f5f9",
      },
    },
    rows: {
      style: {
        backgroundColor: "#ffffff",
        "&:hover": {
          backgroundColor: "#f8fafc",
        },
      },
    },
    pagination: {
      style: {
        borderTop: "2px solid #cfdbe7",
        backgroundColor: "#ffffff",
      },
    },
  };

  return (
    <LoadingState loading={emloading} loadingText="Loading employees...">
      <div className="relative flex min-h-screen w-full flex-col bg-slate-50 overflow-x-hidden font-inter">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search employees..."
              onChange={handleFilter}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100">
            <FaBell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100">
            <FaEnvelope size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 pl-4 border-l border-slate-200 ml-2">
            <span className="text-sm font-medium text-slate-700">Acme Corporation</span>
            <FaChevronDown size={12} className="text-slate-400" />
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                Manage Employees
              </h1>
              <p className="text-sm text-slate-500">
                View and manage all employee information across the organization
              </p>
            </div>
            <Link
              to="/admin-dashboard/add-employee"
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 flex items-center gap-2"
            >
              <FaPlus size={14} />
              Add New Employee
            </Link>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6">
            <DataTable
              columns={columns}
              data={filterEmployee}
              pagination
              customStyles={customStyles}
              highlightOnHover
              pointerOnHover
            />
          </div>
        </div>
      </div>
    </div>
    </LoadingState>
  );
};

export default EmployeeList;
