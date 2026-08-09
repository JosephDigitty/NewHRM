import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../../api/request";
import { useAuth } from "../../Context/authContext";
import { Link } from "react-router-dom";

const SupervisorTable = () => {
  const [activeFilter, setActiveFilter] = useState("All Appraisals");
  const [appraisals, setAppraisals] = useState([])
  const {user} = useAuth()
  const supervisorId = user?._id

  useEffect(() => {
     const getAppraisals = async () => {
       try {
        const res = await api.post("/appraisal/supervisorKpis", {supervisorId})
        if(res.data.success) {
          console.log(res.data)
          setAppraisals(res.data.appraisals)
        } else {
          console.log(res.data.message)
        }
       } catch (error) {
        alert(error)
       }
     }
     getAppraisals()
  },[])
 

  const filters = ["All Appraisals", "Active", "Completed", "Drafts"];

  const getStatusBadge = (status, color) => {
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
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Table Filters */}
      <div className="flex items-center gap-4 border-b border-slate-200 ">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`px-4 py-3 text-sm font-semibold transition-colors ${
              activeFilter === filter
                ? "border-b-2 border-primary text-primary"
                : "text-slate-500 hover:text-slate-900"
            }`}
            onClick={() => setActiveFilter(filter)}
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Average Score</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 ">
              {appraisals.map((appraisal, index) => (
                <tr key={index} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 ">{appraisal?.cycle?.cycleName}</span>
                      <span className="text-xs text-slate-500">{appraisal.dateRange}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/10"
                        src={`${import.meta.env.VITE_UPLOADS_URL}/${
                         appraisal.employee.profileImage
                        }`}
                        alt={`${appraisal.supervisor.name}'s avatar`}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 ">{appraisal?.employee?.fullname}</span>
                        <span className="text-xs text-slate-500">{appraisal.employee?.job?.position ||"Team Lead"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-sm font-medium ${
                      appraisal.averageScore === "Pending"
                        ? "italic text-slate-400"
                        : "font-bold text-slate-900"
                    }`}>
                      {appraisal.totalScore}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {getStatusBadge(appraisal.status)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link to={`/appraisal-dashboard/team-appraisals/${appraisal._id}`} className={`rounded-lg px-4 py-1.5 text-sm font-bold cursor-pointer transition-all ${
                      appraisal.status === "Awaiting supervisor review"
                        ? "bg-black text-white hover:bg-primary/90"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200  "
                    }`}>
                      {appraisal.status === "Awaiting supervisor review"? "Appraise" : "View"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer/Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-500">Showing <span className="font-bold">4</span> of <span className="font-bold">12</span> results</p>
          <div className="flex gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 disabled:opacity-50" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">1</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">2</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 ">3</button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorTable;
