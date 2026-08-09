import React from "react";
import StatRow from "../reuseables/EmployeeReuseable/StatRow";

const RequestSummary = () => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">Request Summary</h2>

      <StatRow label="Leave type" value="Annual leave" />
      <StatRow label="Available balance" value="12 days" />
    </div>
  );
};

export default RequestSummary;
