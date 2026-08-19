import React from "react";

const LeaveActivityItem = ({ title, dateRange, appliedDate, status }) => (
  <div className="bg-white p-4 rounded-xl shadow border mb-3 flex justify-between items-center">
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-gray-600">{dateRange}</p>
      <p className="text-xs text-gray-400">Applied: {appliedDate}</p>
    </div>

    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        status === "Approved"
          ? "bg-purple-100 text-purple-600"
          : status === "Pending"
            ? "bg-orange-100 text-orange-500"
            : "bg-red-100 text-red-600"
      }`}
    >
      {status}
    </span>
  </div>
);
export default LeaveActivityItem;
