import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/request";
import DataTable from "react-data-table-component";
import useToast from "../../utils/useToast";
import LoadingState from "../reuseables/LoadingState";
import { Search, SlidersHorizontal, Eye } from "lucide-react";
import { ActionCell, ActionButton } from "../../utils/TableActions";

export default function LeaveManagement() {
  const [leave, setLeave] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredLeave, setFilterLeave] = useState([]);
  const { showError } = useToast();
  const [activeStatus, setActiveStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      width: "80px",
    },
    {
      name: "Employee Name",
      selector: (row) => row.employeeName,
      width: "180px",
    },
    {
      name: "Leave Type",
      selector: (row) => row.leaveType,
      width: "150px",
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => new Date(row.startDate).toLocaleDateString("en-GB"),
      width: "140px",
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => new Date(row.endDate).toLocaleDateString("en-GB"),
      width: "140px",
    },
    {
      name: "Days",
      selector: (row) => row.NumberOfDays,
      width: "80px",
    },
    {
      name: "Status",
      cell: (row) => {
        const statusColors = {
          Pending: "bg-amber-100 text-amber-800",
          Approved: "bg-purple-100 text-purple-800",
          Rejected: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusColors[row.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {row.status}
          </span>
        );
      },
      width: "120px",
    },
    {
      name: "Action",
      cell: (row) => <LeaveButton id={row.id} />,
      width: "100px",
    },
  ];

  useEffect(() => {
    const getLeave = async () => {
      try {
        setLoading(true);
        const res = await api.get("/leave/leave-request");
        if (res.data.success) {
          let sno = 1;
          const data = res.data.leave.map((lev) => ({
            id: lev._id,
            sno: sno++,
            employeeName: lev.employee.fullname,
            leaveType: lev.leaveType.name,
            startDate: lev.startDate,
            endDate: lev.endDate,
            NumberOfDays: lev.numberOfDays,
            status: lev.status,
          }));
          setLeave(data);
          setFilterLeave(data);
        }
      } catch {
        showError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    getLeave();
  }, [showError]);

  const applyFilters = (searchTerm, status) => {
    let filtered = leave;

    if (searchTerm) {
      filtered = filtered.filter((lev) =>
        lev.employeeName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (status !== "All") {
      filtered = filtered.filter(
        (lev) => lev.status.toLowerCase() === status.toLowerCase(),
      );
    }

    setFilterLeave(filtered);
  };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    applyFilters(searchQuery, status);
  };

  const customStyles = {
    rows: {
      style: {
        minHeight: "64px",
        borderBottom: "1px solid #f0f0f0",
      },
    },
    headCells: {
      style: {
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "16px",
        paddingBottom: "16px",
        backgroundColor: "#fafafa",
        color: "#6b7280",
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
  };

  return (
    <LoadingState loading={loading} loadingText="Loading leave requests...">
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Leave Requests
              </h1>
              <p className="text-gray-500 mt-1">
                Manage and review employee leave applications
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by employee name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    applyFilters(e.target.value, activeStatus);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex gap-2">
                {["All", "pending", "approved", "rejected"].map((status) => (
                  <button
                    onClick={() => handleStatusChange(status)}
                    key={status}
                    className={`px-4 h-10 rounded-lg text-sm font-medium transition-colors ${
                      activeStatus === status
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredLeave}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 20]}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </LoadingState>
  );
}

const LeaveButton = ({ id }) => {
  const Navigate = useNavigate();
  return (
    <ActionCell>
      <ActionButton
        icon={Eye}
        title="View"
        variant="view"
        onClick={() => Navigate(`/admin-dashboard/leave/${id}`)}
      />
    </ActionCell>
  );
};
