import React, { useEffect, useState } from "react";
import { api } from "../api/request";
import { useAuth } from "../Context/authContext";
import useToast from "../utils/useToast";

export default function AssignKpiPage() {
  const [appraisalPeriod, setAppraisalPeriod] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [supervisorId, setSupervisorId] = useState("");
  const [appraisalCycleId, setAppraisalCycleId] = useState("");
  const { user } = useAuth();
  const employeeId = user?._id;
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAppraisals = async () => {
      try {
        const res = await api.get("/appraisal/appraisals");
        res.data.success
          ? setAppraisalPeriod(res.data.appraisalCycle)
          : showError(res.data.message);
      } catch (error) {
        showError(error.response?.data?.message || "Something went wrong");
      }
    };
    getAppraisals();
  }, []);
  useEffect(() => {
    const getEmployee = async () => {
      try {
        const res = await api.get("/employee");
        res.data.success
          ? (setEmployees(res.data.employees), console.log(res.data))
          : showError(res.data.message);
      } catch (error) {
        showError(error.response?.data?.message || "Something went wrong");
      }
    };
    getEmployee();
  }, []);

  const totalWeight = kpis.reduce((sum, k) => sum + Number(k.weight), 0);

  const addKpi = () => {
    setKpis([...kpis, { title: "", weight: 0, description: "", metric: "" }]);
  };

  const removeKpi = (index) => {
    setKpis(kpis.filter((_, i) => i !== index));
  };

  const updateKpi = (index, field, value) => {
    const updated = [...kpis];
    updated[index][field] = value;
    setKpis(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/appraisal/asign-kpi", {
        employeeId,
        supervisorId,
        appraisalCycleId,
        kpis,
      });
      if (res.data.success) {
        showSuccess(res.data.message);
      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen bg-background-light  px-6 py-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Performance</span>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <span className="text-[#87CEEB] font-medium">Assign KPIs</span>
            </nav>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Set Performance Goals
            </h1>
            <p className="mt-2 text-slate-600 ">
              Define key performance indicators and expectations for the
              upcoming review cycle.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Appraisal Period
              </label>
              <div className="relative">
                <select
                  name=""
                  value={appraisalCycleId}
                  onChange={(e) => setAppraisalCycleId(e.target.value)}
                  className="appearance-none rounded-xl border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold"
                >
                  <option value="">Select Appraisal Period</option>
                  {appraisalPeriod.map((app) => (
                    <option key={app._id} name="cycle" value={app._id}>
                      {app.cycleName}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">
                  expand_more
                </span>
              </div>
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200  bg-white  px-5 py-2.5 text-sm font-bold shadow-sm transition-all hover:bg-slate-50 ">
              <span className="material-symbols-outlined text-lg">
                description
              </span>
              Load Template
            </button>
          </div>
        </div>
        <div className="flex gap-8 ">
          <aside className="w-[800px]">
            <div className="rounded-xl border border-[#87CEEB]  bg-white  p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                Employee Details
              </h3>
              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 ">
                    Select Team Member
                  </label>
                  <div className="relative">
                    <select
                      name="supervisorId"
                      value={supervisorId}
                      onChange={(e) => setSupervisorId(e.target.value)}
                      className="w-full appearance-none rounded-xl border-slate-200  bg-slate-50  p-3 pr-10 text-sm focus:border-[#87CEEB] focus:ring-[#87CEEB]"
                    >
                      <option value="">Select Supervisor</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp?.userId?.fullname}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-[#87CEEB]/5 p-4 flex items-center gap-4 border border-[#87CEEB]/10">
                  <div
                    className="h-12 w-12 flex-shrink-0 rounded-full bg-slate-200 overflow-hidden"
                    data-alt="Portrait of Alex Rivera employee"
                  >
                    <img
                      alt="Alex Rivera"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAatRCSKUgAalFao7yo5s7cESTelLYcNLQRRAFI9nCoIs0rKzI6FhtTb2lxvEy0M6dLhkGlkgNZp_CeP811-dkCbGjx541FUu8IC1G3xd4nF78rRlUPcx6a0WFHcFCpD5B6CzxuVfGBnE01Q4EeLzb8ofG9MpIqo-1nyIQwl5SKXXWJuMmOaitbJBv2xZ-pxWkOp2bgjfmldLd_7KmWgrXYwMpDaHzqp_tAKnHLkajffmIkEdQWA_0HJr5UFVs56T_AY8kxl1uG3RA"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 ">
                      {user?.fullname}
                    </p>
                    <p className="text-xs text-slate-500">
                      Product Engineering
                    </p>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Appraisal Period</span>
                    <span>Q4 2024</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Reviewer</span>
                    <span>You (Supervisor)</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Current Status</span>
                    <span className="text-amber-600 ">KPI Drafting</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <div className="space-y-6">
            {kpis.map((kpi, index) => (
              <div
                key={index}
                className="relative rounded-xl border border-[#87CEEB]  bg-white  p-6 shadow-sm"
              >
                <button
                  onClick={() => removeKpi(index)}
                  className="absolute top-4 right-4 text-red-500"
                >
                  Delete
                </button>

                <div className="mb-4 flex items-center gap-2">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#87CEEB]/10 text-[#87CEEB] font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-bold">KPI</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="md:col-span-3">
                    <label className="text-xs font-bold text-slate-500">
                      KPI TITLE
                    </label>
                    <input
                      value={kpi.title}
                      onChange={(e) =>
                        updateKpi(index, "title", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500">
                      Weight (%)
                    </label>
                    <input
                      type="number"
                      value={kpi.weight}
                      onChange={(e) =>
                        updateKpi(index, "weight", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="text-xs font-bold text-slate-500">
                      Description
                    </label>
                    <textarea
                      rows="2"
                      value={kpi.description}
                      onChange={(e) =>
                        updateKpi(index, "description", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="text-xs font-bold text-slate-500">
                      Target Metric
                    </label>
                    <input
                      value={kpi.metric}
                      onChange={(e) =>
                        updateKpi(index, "metric", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* ADD KPI */}
            <button
              type="button"
              onClick={addKpi}
              className="w-full border-2 border-dashed rounded-xl p-6 hover:bg-slate-50"
            >
              + Add New KPI
            </button>
          </div>
        </div>
        {/* KPI LIST */}

        {/* SUMMARY */}
        <div className="mt-8 bg-slate-900 text-white rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400">Total Weight</p>
            <p className="text-3xl font-bold">{totalWeight} / 100%</p>
          </div>

          <div>
            <p className="text-xs text-slate-400">KPI Count</p>
            <p className="text-3xl font-bold">{kpis.length}</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#87CEEB] px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Save & Publish"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
