import React from "react";

const Breadcrumb = ({ periodName }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <span className="hover:text-gray-900 cursor-pointer">Payroll</span>
      <span>/</span>
      <span className="hover:text-gray-900 cursor-pointer">Payroll Batches</span>
      <span>/</span>
      <span className="text-gray-900 font-medium">{periodName}</span>
    </nav>
  );
};

export default Breadcrumb;
