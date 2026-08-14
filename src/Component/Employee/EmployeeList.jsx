import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { EmployeeButtons, fetchDepartments } from "../../utils/EmployeeHelper";
import LoadingState from "../reuseables/LoadingState";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";
import {
  FaSearch,
  FaPlus,
  FaUsers,
  FaUser,
  FaUserClock,
  FaGraduationCap,
  FaBuilding,
  FaSlidersH,
  FaDownload,
} from "react-icons/fa";

const EmployeeList = () => {
  const { showError } = useToastContext();
  const [employees, setEmployees] = useState([]);
  const [emloading, setEmloading] = useState(false);
  const [filterEmployee, setFilterEmployee] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleDeleted = (id) => {
    const data = employees.filter((emp) => emp._id !== id);
    setEmployees(data);
    setFilterEmployee(data);
    setCurrentPage(1);
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
            employeeId: employee.employeeId || `EMP-${String(sno).padStart(3, "0")}`,
            department_Name: employee.job?.department?.department_Name || "N/A",
            name: employee.userId?.fullname || "N/A",
            profileImage: (
              <img
                src={`${import.meta.env.VITE_UPLOADS_URL}/${
                  employee.userId?.profileImage
                }`}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            ),
            role: employee.job?.position || "N/A",
            grade: employee.job?.grade?.gradeName || "N/A",
            status: "Active",
            department_Id: employee.job?.department?._id,
          }));
          setEmployees(data);
          setFilterEmployee(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
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

  useEffect(() => {
    const loadDepartments = async () => {
      const depts = await fetchDepartments(showError);
      if (depts) setDepartments(depts);
    };
    loadDepartments();
  }, [showError]);

  useEffect(() => {
    let records = [...employees];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      records = records.filter((emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.department_Name?.toLowerCase().includes(query) ||
        emp.role?.toLowerCase().includes(query),
      );
    }

    if (selectedDepartment !== "all") {
      records = records.filter((emp) => emp.department_Id === selectedDepartment);
    }

    if (sortBy === "name-asc") {
      records.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      records.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilterEmployee(records);
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment, sortBy, employees]);

  const totalEmployees = employees.length;
  const fullStaff = employees.filter((emp) =>
    (emp.grade || "").toLowerCase().includes("permanent") ||
    (emp.grade || "").toLowerCase().includes("full"),
  ).length;

  const contractStaff = employees.filter((emp) =>
    (emp.grade || "").toLowerCase().includes("contract"),
  ).length;

  const trainees = employees.filter((emp) =>
    (emp.role || "").toLowerCase().includes("trainee") ||
    (emp.role || "").toLowerCase().includes("intern"),
  ).length;

  const deptCount = new Set(employees.map((emp) => emp.department_Name)).size;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filterEmployee.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(filterEmployee.length / rowsPerPage);

  return (
    <LoadingState loading={emloading} loadingText="Loading employees...">
      <div className="flex flex-col w-full py-6 px-8">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                {totalEmployees} Total Employees
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Manage and view all employees in the organization
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2">
              <FaDownload size={14} />
              Export
            </button>
            <button className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 flex items-center gap-2">
              <FaSlidersH size={14} />
              Filter
            </button>
            <Link
              to="/admin-dashboard/add-employee"
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <FaPlus size={14} />
              Add Employee
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FaUsers className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Employees</p>
                <p className="text-2xl font-bold text-slate-900">{totalEmployees}</p>
                <p className="text-xs text-slate-400">All active employees</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <FaUser className="text-emerald-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Full Staff</p>
                <p className="text-2xl font-bold text-slate-900">{fullStaff}</p>
                <p className="text-xs text-slate-400">Permanent employees</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <FaUserClock className="text-amber-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Contract Staff</p>
                <p className="text-2xl font-bold text-slate-900">{contractStaff}</p>
                <p className="text-xs text-slate-400">Contract employees</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FaGraduationCap className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Trainees</p>
                <p className="text-2xl font-bold text-slate-900">{trainees}</p>
                <p className="text-xs text-slate-400">Trainees & interns</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <FaBuilding className="text-pink-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Departments</p>
                <p className="text-2xl font-bold text-slate-900">{deptCount}</p>
                <p className="text-xs text-slate-400">Active departments</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name, role or department"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.department_Name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
              <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                <FaSlidersH className="text-slate-600" size={16} />
              </button>
              <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                <svg
                  className="w-4 h-4 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedData.length > 0 ? (
                  paginatedData.map((emp) => (
                    <tr
                      key={emp._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {emp.sno}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {emp.profileImage}
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {emp.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {emp.employeeId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <FaBuilding
                              className="text-purple-600"
                              size={14}
                            />
                          </div>
                          <span className="text-sm text-slate-700">
                            {emp.department_Name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {emp.role}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {emp.grade}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <EmployeeButtons
                          id={emp._id}
                          handleDeleted={handleDeleted}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-sm text-slate-500"
                    >
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                {filterEmployee.length > 0 ? startIndex + 1 : 0} to{" "}
                {Math.min(startIndex + rowsPerPage, filterEmployee.length)} of{" "}
                {filterEmployee.length} employees
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-9-7 9-7m0 0l9 7-9 7m-9-7v14"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
                        currentPage === page
                          ? "bg-purple-600 text-white"
                          : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="ml-2 px-2 py-1 border border-slate-300 rounded text-sm"
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </LoadingState>
  );
};

export default EmployeeList;
