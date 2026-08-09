import { Calendar, Download, History } from "lucide-react";

const DashboardHeader = ({ cycle }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          My Performance Dashboard
        </h1>

        <div className="flex items-center gap-2 mt-2">
          <Calendar className="text-primary text-sm" />
          <p className="text-slate-600 font-medium">
            Review Cycle:{" "}
            <span className="text-primary font-bold">{cycle}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm shadow-sm">
          <Download className="text-lg" />
          Download Report
        </button>

        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#5048e5] text-white rounded-xl font-bold text-sm shadow-lg">
          <History className="text-lg" />
          View History
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
