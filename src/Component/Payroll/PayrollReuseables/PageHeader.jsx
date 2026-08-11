import React from "react";
import { MdDownload, MdExpandMore } from "react-icons/md";

const PageHeader = ({ periodName, status, dateRange, onExport, onMoreActions, onSubmitForReview }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-900">{periodName}</h2>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md font-medium">
            {status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <MdDownload size={18} />
            Export
          </button>
          <button
            onClick={onMoreActions}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            More actions
            <MdExpandMore size={18} />
          </button>
          <button
            onClick={onSubmitForReview}
            className="px-4 py-2 bg-[#9eceec] text-black font-bold rounded-lg hover:bg-[#7db8d8] transition-colors text-sm"
          >
            Submit Payroll for Review
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-8">Payroll for {dateRange}</p>
    </div>
  );
};

export default PageHeader;
