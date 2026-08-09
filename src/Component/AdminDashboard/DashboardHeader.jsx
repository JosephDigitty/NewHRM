// components/appraisal/DashboardHeader.jsx

import { Download, Plus } from "lucide-react";

const DashboardHeader = ({ onCreate }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Appraisal Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Overview of performance review cycles.
        </p>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white text-sm font-semibold hover:bg-slate-50">
          <Download /> Export Data
        </button>

        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5048e5] text-white text-sm font-semibold"
        >
          <Plus /> New Cycle
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;