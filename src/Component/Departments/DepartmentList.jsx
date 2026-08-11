import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelpers";
import Loader from "../reuseables/Loader";
import useToast from "../../utils/useToast";
import { api } from "../../api/request";
import {
  Download,
  Plus,
  Search,
  ArrowUpDown,
  LayoutList,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const CustomPagination = ({ currentPage, rowsPerPage, rowCount, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(rowCount / rowsPerPage));
  const start = rowCount === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, rowCount);

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
      <div className="text-sm text-gray-500">
        Showing {start} to {end} of {rowCount} departments
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-purple-600 text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const DepartmentList = () => {
  const [department, setdepartment] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState("list");
  const { showError } = useToast();

  const handleDeleted = async (id) => {
    const data = department.filter((dep) => dep._id !== id);
    setdepartment(data);
    setFilteredDepartments(data);
  };

  const handleViewEmployees = (deptId) => {
    console.log("View employees for department:", deptId);
  };

  const handleExport = () => {
    console.log("Export departments");
  };

  useEffect(() => {
    const fetchData = async () => {
      setDepLoading(true);
      try {
        const [deptRes, empRes] = await Promise.all([
          api.get("/department"),
          api.get("/employee"),
        ]);

        if (deptRes.data.success) {
          const depts = deptRes.data.departments;
          const emps = empRes.data.success ? empRes.data.employees : [];

          const empCountByDept = {};
          const headByDept = {};

          emps.forEach((emp) => {
            const deptId = emp.job?.department?._id || emp.job?.department;
            if (deptId) {
              empCountByDept[deptId] = (empCountByDept[deptId] || 0) + 1;

              const position = (emp.job?.position || "").toLowerCase();
              const role = (emp.role || "").toLowerCase();
              if (
                position.includes("manager") ||
                position.includes("head") ||
                position.includes("director") ||
                position.includes("chief") ||
                role.includes("manager") ||
                role.includes("head")
              ) {
                if (!headByDept[deptId]) {
                  headByDept[deptId] = {
                    name: emp.personal?.fullName || "Unknown",
                    position: emp.job?.position || "Manager",
                    image: emp.userId?.profileImage || null,
                  };
                }
              }
            }
          });

          const data = depts.map((dept, index) => {
            const head = headByDept[dept._id];
            return {
              _id: dept._id,
              sno: index + 1,
              department_Name: dept.department_Name,
              description: dept.description || "",
              employeeCount: empCountByDept[dept._id] || 0,
              departmentHead: head?.name || "Not assigned",
              headPosition: head?.position || "",
              headImage: head?.image || null,
              status: "Active",
              Action: (
                <DepartmentButtons
                  _id={dept._id}
                  handleDeleted={handleDeleted}
                />
              ),
            };
          });

          setdepartment(data);
          setFilteredDepartments(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
        showError(error.message);
      } finally {
        setDepLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = department;

    if (searchQuery) {
      filtered = filtered.filter((dep) =>
        dep.department_Name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.department_Name.localeCompare(b.department_Name);
        case "name-desc":
          return b.department_Name.localeCompare(a.department_Name);
        case "employees-asc":
          return a.employeeCount - b.employeeCount;
        case "employees-desc":
          return b.employeeCount - a.employeeCount;
        default:
          return 0;
      }
    });

    setFilteredDepartments(filtered);
  }, [searchQuery, sortBy, department]);

  return (
    <div className="min-h-screen bg-gray-50">
      {depLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  Departments
                </h1>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                  {department.length} Total Departments
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                Manage and organize all departments in the organization.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download size={16} />
                Export
              </button>
              <Link
                to="/admin-dashboard/departments/add"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                <Plus size={16} />
                Add Department
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <div
                  className="w-6 h-6 bg-purple-600 rounded"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                ></div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {department.length}
                </p>
                <p className="text-xs text-gray-500">All departments</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <div className="flex -space-x-1">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {department.reduce((sum, dep) => sum + dep.employeeCount, 0)}
                </p>
                <p className="text-xs text-gray-500">Across all departments</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {department.length}
                </p>
                <p className="text-xs text-gray-500">Currently active</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-blue-600 rounded-t-full"></div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    department.filter(
                      (dep) => dep.departmentHead !== "Not assigned",
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-500">Assigned heads</p>
              </div>
            </div>
          </div>

          {/* Search, Sort, and View Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="name-asc">
                    Sort by: Department Name (A-Z)
                  </option>
                  <option value="name-desc">
                    Sort by: Department Name (Z-A)
                  </option>
                  <option value="employees-asc">
                    Sort by: Employees (Low to High)
                  </option>
                  <option value="employees-desc">
                    Sort by: Employees (High to Low)
                  </option>
                </select>
                <ArrowUpDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 ${viewMode === "list" ? "bg-purple-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  <LayoutList size={18} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 ${viewMode === "grid" ? "bg-purple-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  <LayoutGrid size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredDepartments}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 20]}
              paginationComponent={CustomPagination}
              customStyles={{
                table: {
                  style: {
                    borderRadius: "0px",
                  },
                },
                rows: {
                  style: {
                    minHeight: "72px",
                    borderBottom: "1px solid #f0f0f0",
                  },
                  highlightOnHoverStyle: {
                    backgroundColor: "transparent",
                  },
                },
                headCells: {
                  style: {
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    paddingTop: "16px",
                    paddingBottom: "16px",
                    backgroundColor: "#fafafa",
                    color: "#9ca3af",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #f0f0f0",
                  },
                },
                cells: {
                  style: {
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    paddingTop: "16px",
                    paddingBottom: "16px",
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
