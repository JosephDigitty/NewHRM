import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/authContext";
import { api } from "../../api/request";

const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {user} = useAuth()
  const employeeId = user?._id
  console.log("AUTH USER:", user)
  useEffect(() => {
    const fetchEmployeeLeaves = async () => {
      try {
        setLoading(true);
        const response = await api.post("/leave/employee", {employeeId});
        if (response.data.success){
            console.log(response.data.leaveRequests)
            setLeaves(response.data.leaveRequests|| []);
            setLoading(false)
        } else {
          console.log(response.data)  
          console.log("AUTH USER:", user)
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load employee leave requests."
        );
      } finally {
        setLoading(false);
      }
    };
      fetchEmployeeLeaves();
  }, [employeeId]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

 

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Employee Leave History
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View all leave requests submitted by this employee.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Total Requests
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {leaves.length}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Approved
          </p>

          <p className="mt-2 text-2xl font-semibold text-green-600">
            {
              leaves.filter(
                (leave) => leave.status === "approved"
              ).length
            }
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Pending
          </p>

          <p className="mt-2 text-2xl font-semibold text-yellow-600">
            {
              leaves.filter(
                (leave) => leave.status === "pending"
              ).length
            }
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Rejected
          </p>

          <p className="mt-2 text-2xl font-semibold text-red-600">
            {
              leaves.filter(
                (leave) => leave.status === "rejected"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Leave Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            Leave Requests
          </h2>
        </div>

        {leaves.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500">
              No leave requests found for this employee.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-gray-500">
                    Leave Type
                  </th>

                  <th className="px-6 py-4 text-left font-medium text-gray-500">
                    Start Date
                  </th>

                  <th className="px-6 py-4 text-left font-medium text-gray-500">
                    End Date
                  </th>

                  <th className="px-6 py-4 text-left font-medium text-gray-500">
                    Days
                  </th>

                  <th className="px-6 py-4 text-left font-medium text-gray-500">
                    Reason
                  </th>

                  <th className="px-6 py-4 text-left font-medium text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left font-medium text-gray-500">
                    Applied On
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {leaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="hover:bg-gray-50 transition"
                  >

                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {leave.leaveType?.name ||
                          leave.leaveType?.leaveTypeName ||
                          "Leave"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(leave.startDate)}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(leave.endDate)}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        {leave.numberOfDays}
                      </span>
                    </td>

                    <td className="px-6 py-4 max-w-xs">
                      <p
                        className="text-gray-600 truncate"
                        title={leave.reason}
                      >
                        {leave.reason}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(leave.createdAt)}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeLeaves;