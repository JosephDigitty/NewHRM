import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/request";
import DataTable from "react-data-table-component";
import { LeaveButton } from "../../utils/LeaveHelper";
import { useToastContext } from "../../Context/ToastContext";
import LoadingState from "../reuseables/LoadingState";

export default function LeaveManagement() {
  const [leave, setLeave] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredLeave, setFilterLeave] = useState([]);
  const { showSuccess, showError } = useToastContext();
  const [activeStatus, setActiveStatus] = useState("All");
   

  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      width: "80px",
    },
    {
      name: "Employee Name",
      selector: (row) => row.employeeName,
      width: "150px",
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
      width: "150px",
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => new Date(row.endDate).toLocaleDateString("en-GB"),
      width: "180px",
    },
    {
      name: "Number of Days",
      selector: (row) => row.NumberOfDays,
      width: "150px",
    },
    {
      name: "status",
      selector: (row) => row.status,
      width: "150px",
    },
    {
      name: "Action",
      cell: (row) => <LeaveButton id={row.id} />,
    },
  ];

  useEffect(() => {
    const getLeave = async () => {
      try {
        setLoading(true);
        const res = await api.get("/leave/leave-request");
        if (res.data.success) {
          showSuccess("Leave requests fetched successfully");
          console.log(res.data.leave);
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
          setFilterLeave(data)
        } else {
          showError(res.data.message);
        }
      } catch (err) {
        console.log(err);
        showError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    getLeave();
  }, []);

  const handleFilter = (e) => {
    const records = leave.filter((lev) => 
    lev.employeeName.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilterLeave(records)
  }

  const applyFilters = (searchTerm, status) => {
  let filtered = leave;

  // Filter by Search Term
  if (searchTerm) {
    filtered = filtered.filter((lev) =>
      lev.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filter by Status
  if (status !== "All") {
    filtered = filtered.filter((lev) => lev.status === status);
  }

  setFilterLeave(filtered);
};

  return (
    <LoadingState loading={loading} loadingText="Loading leave requests...">
      <div className="min-h-screen bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] px-4 md:px-10 lg:px-20 py-10">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 ">
          Leave Requests
        </h1>
        <p className="text-gray-500 ">
          Manage and review employee leave applications
        </p>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by employee name..."
            className="w-full lg:w-1/3 h-12 px-4 rounded-lg bg-gray-100 text-sm text-gray-900 focus:ring-2 focus:ring-primary outline-none"
            onChange={(e) => applyFilters(e.target.value, activeStatus)}
          />
          {/* Date Filter */}
          <input
            type="text"
            placeholder="Select date range"
            className="w-full lg:w-1/4 h-12 px-4 rounded-lg bg-gray-100 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
          />
          {/* Status Filters */}
          <div className="flex gap-2 overflow-x-auto">
            {["All", "pending", "approved", "rejected"].map((status) => (
              <button
              onClick={() => {
              setActiveStatus(status);
              applyFilters(document.querySelector('input[type="text"]').value, status);
              }}
                key={status}
                className={`px-4 h-10 rounded-lg text-sm font-medium ${
                  status === "All"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
       <div className="mt-5">
         <DataTable columns={columns} data={filteredLeave} pagination />
       </div>
    </div>
    </LoadingState>
  );
}

const statusColor = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};
