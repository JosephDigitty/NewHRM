import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../../api/request";
import { useAuth } from "../../Context/authContext";
import { Link } from "react-router-dom";

const AppraisalTable = () => {
  const [activeFilter, setActiveFilter] = useState("All Appraisals");
  const [appraisals, setAppraisals] = useState([]);
  const { user } = useAuth();
  const employeeId = user?._id;

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const getAppraisals = async () => {
      if (!employeeId) return;
      try {
        const res = await api.post("/appraisal/employeeKpis", { employeeId });
        if (res.data.success) {
          setAppraisals(res.data.appraisals);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getAppraisals();
  }, [employeeId]);

  // --- FILTER LOGIC ---
  const filteredAppraisals = appraisals.filter((appraisal) => {
    if (activeFilter === "All Appraisals") return true;
    if (activeFilter === "Active") return appraisal.status === "Awaiting Appraisal";
    if (activeFilter === "Completed") return appraisal.status === "Appraised";
    if (activeFilter === "Drafts") return appraisal.status === "Draft";
    return true;
  });

  // --- PAGINATION CALCULATIONS ---
  const totalPages = Math.ceil(filteredAppraisals.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppraisals.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    // Map status to colors
    const config = {
      "Awaiting Appraisal": { color: "amber", label: "Active" },
      "Appraised": { color: "emerald", label: "Completed" },
      "Draft": { color: "indigo", label: "Draft" },
    };

    const { color, label } = config[status] || { color: "primary", label: status };

    const colorClasses = {
      primary: "bg-primary/10 text-primary",
      amber: "bg-amber-100 text-amber-700 ",
      indigo: "bg-indigo-100 text-indigo-700",
      emerald: "bg-emerald-100 text-emerald-700"
    };

    const dotColors = {
      primary: "bg-primary",
      amber: "bg-amber-500",
      indigo: "bg-indigo-500",
      emerald: "bg-emerald-500"
    };

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${colorClasses[color]}`}>
        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dotColors[color]}`}></span>
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Table Filters */}
      <div className="flex items-center gap-4 border-b border-slate-200 ">
        {["All Appraisals", "Active", "Completed", "Drafts"].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-3 text-sm font-semibold transition-colors ${
              activeFilter === filter
                ? "border-b-2 border-primary text-primary"
                : "text-slate-500 hover:text-slate-900"
            }`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Appraisal Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 ">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Appraisal Period</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Supervisor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Score</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 ">
              {currentItems.map((appraisal, index) => (
                <tr key={appraisal._id || index} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 ">{appraisal?.cycle?.cycleName}</span>
                      <span className="text-xs text-slate-500">
                        {new Date(appraisal?.cycle?.startDate).toLocaleDateString()} - {new Date(appraisal?.cycle?.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/10"
                        src={`${import.meta.env.VITE_UPLOADS_URL}/${appraisal.supervisor?.userId?.profileImage}`}
                        alt="avatar"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 ">{appraisal?.supervisor?.userId?.fullname}</span>
                        <span className="text-xs text-slate-500">{appraisal?.supervisor?.job?.position}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="font-bold text-slate-900">{appraisal.totalScore || "—"}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {getStatusBadge(appraisal.status)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link 
                      to={`/appraisal-dashboard/my-appraisal/${appraisal._id}`} 
                      className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${
                        appraisal.status === "Awaiting Appraisal"
                          ? "bg-black text-white hover:bg-slate-800"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {appraisal.status === "Awaiting Appraisal" ? "Appraise" : "View"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table Footer/Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold">{filteredAppraisals.length === 0 ? 0 : indexOfFirstItem + 1}</span> to <span className="font-bold">{Math.min(indexOfLastItem, filteredAppraisals.length)}</span> of <span className="font-bold">{filteredAppraisals.length}</span> results
          </p>  
          <div className="flex gap-2">
            <button 
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  currentPage === page 
                    ? "bg-primary text-white" 
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppraisalTable;