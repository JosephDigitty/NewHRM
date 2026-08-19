import React, { useEffect, useState } from "react";
import { api } from "../api/request";
import { Link } from "react-router-dom";
import useToast from "../utils/useToast";
import { getAllCycles, getAllEmployee } from "../utils/DyamicDashboard";

const statusStyles = {
  open: "bg-purple-100 text-purple-700 border-purple-200",
  closed: "bg-red-100 text-red-700 border-red-200",
  Scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-slate-100 text-slate-600 border-slate-200",
  Draft: "bg-amber-100 text-amber-700 border-amber-200",
};

const AppraisalCycles = () => {
  const [employees, setEmployees] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const [empData, cycleData] = await Promise.all([
          getAllEmployee(),
          getAllCycles(),
        ]);
        setEmployees(empData || []);
        setCycles(cycleData || []);

        const res = await api.get("/appraisal/appraisals");
        if (res.data.success) {
          setAppraisals(res.data.appraisalCycle);
        } else {
          showError(res.data.message);
        }
      } catch (error) {
        console.error(error);
        showError("Failed to fetch appraisal data");
      } finally {
        setLoading(false);
      }
    };
    getDashboardData();
  }, [showError]);

  // Derived Stats
  const totals = cycles.reduce(
    (acc, cycle) => {
      if (cycle.status === "open") acc.open += 1;
      if (cycle.status === "closed") acc.closed += 1;
      return acc;
    },
    { open: 0, closed: 0 },
  );

  // Pagination Logic
  const totalPages = Math.ceil(appraisals.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = appraisals.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen p-6 lg:p-10 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Appraisal Cycles Management
            </h1>
            <p className="text-slate-500 text-lg">
              View and manage all performance review periods.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            + Create New Cycle
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Open"
            value={`${totals.open} Cycles`}
            color="green"
          />
          <StatCard
            title="Closed"
            value={`${totals.closed} Cycles`}
            color="blue"
          />
          <StatCard
            title="Total"
            value={`${cycles.length} Cycles`}
            color="slate"
          />
          <StatCard
            title="Participants"
            value={`${employees.length} Employees`}
            color="indigo"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr className="text-xs uppercase text-slate-500 font-bold">
                  <th className="px-6 py-4">Appraisal Name</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">End Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentItems.map((cycle, index) => (
                  <tr
                    key={cycle._id || index}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {cycle.cycleName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {cycle.des || "No description"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {new Date(cycle.startDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {new Date(cycle.endDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full border ${statusStyles[cycle.status] || "bg-gray-100"}`}
                      >
                        {cycle.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        to={`/appraisal-dashboard/appraisal-cycle/${cycle._id}`}
                        className="text-indigo-600 font-semibold hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t gap-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <b>{appraisals.length === 0 ? 0 : indexOfFirstItem + 1}</b> to{" "}
              <b>{Math.min(indexOfLastItem, appraisals.length)}</b> of{" "}
              <b>{appraisals.length}</b> cycles
            </p>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${currentPage === 1 ? "bg-slate-50 text-slate-300 cursor-not-allowed" : "bg-white text-slate-700 hover:bg-slate-50"}`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === page ? "bg-indigo-600 text-white" : "bg-white text-slate-700 border hover:bg-slate-50"}`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${currentPage === totalPages || totalPages === 0 ? "bg-slate-50 text-slate-300 cursor-not-allowed" : "bg-white text-slate-700 hover:bg-slate-50"}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">
          {title}
        </p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
};

export default AppraisalCycles;
