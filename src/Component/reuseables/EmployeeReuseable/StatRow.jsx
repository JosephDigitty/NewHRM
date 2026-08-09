import React from "react";

const StatRow = ({ label, value, color }) => (
  <div className="flex justify-between mb-2">
    <span>{label}</span>
    <span className={`font-medium ${color}`}>{value}</span>
  </div>
);

export default StatRow;
