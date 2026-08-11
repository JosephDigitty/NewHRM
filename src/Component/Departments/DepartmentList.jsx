import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelpers";
import Loader from "../reuseables/Loader";
import useToast from "../../utils/useToast";
import { api } from "../../api/request";
import {
  Download,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import CustomPagination from "../reuseables/CustomPagination";
import PageHeader from "../reuseables/PageHeader";
import TableToolbar from "../reuseables/TableToolbar";
import StatCard from "../reuseables/StatCard";

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

  const sortOptions = [
    { value: "name-asc", label: "Sort by: Department Name (A-Z)" },
    { value: "name-desc", label: "Sort by: Department Name (Z-A)" },
    { value: "employees-asc", label: "Sort by: Employees (Low to High)" },
    { value: "employees-desc", label: "Sort by: Employees (High to Low)" },
  ];

  const totalEmployees = department.reduce(
    (sum, dep) => sum + dep.employeeCount,
    0
  );
  const assignedHeads = department.filter(
    (dep) => dep.departmentHead !== "Not assigned"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {depLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="mx-auto px-6 py-8">
          <PageHeader
            title="Departments"
            count={department.length}
            countLabel="Total Departments"
            description="Manage and organize all departments in the organization."
            actions={
              <>
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
              </>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={
                <div
                  className="w-6 h-6 bg-purple-600 rounded"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  }}
                ></div>
              }
              iconBg="bg-purple-50"
              title="All departments"
              value={department.length}
            />
            <StatCard
              icon={
                <div className="flex -space-x-1">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
              }
              iconBg="bg-green-50"
              title="Across all departments"
              value={totalEmployees}
            />
            <StatCard
              icon={
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              }
              iconBg="bg-orange-50"
              title="Currently active"
              value={department.length}
            />
            <StatCard
              icon={
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-blue-600 rounded-t-full"></div>
              }
              iconBg="bg-blue-50"
              title="Assigned heads"
              value={assignedHeads}
            />
          </div>

          <TableToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search department..."
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={sortOptions}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            viewModeOptions={["list", "grid"]}
          />

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
