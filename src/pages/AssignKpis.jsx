import React, { useState } from "react";
import { FileText, Trash2, PlusCircle, Info } from "lucide-react";

const AssignKpis = () => {
  const [kpis, setKpis] = useState([
    {
      id: 1,
      title: "Code Quality & Peer Review Participation",
      weight: 30,
      description:
        "Maintain a test coverage of >85% and complete at least 5 in-depth code reviews per week.",
      targetMetric: "85% Unit Test Coverage",
    },
    {
      id: 2,
      title: "Feature Release Schedule",
      weight: 40,
      description:
        "Deliver the 'Project Phoenix' modules on or before the agreed sprint deadlines.",
      targetMetric: "100% On-time delivery for Q4 Sprints",
    },
  ]);

  const addKpi = () => {
    const newKpi = {
      id: kpis.length + 1,
      title: "",
      weight: 0,
      description: "",
      targetMetric: "",
    };
    setKpis([...kpis, newKpi]);
  };

  const deleteKpi = (id) => {
    setKpis(kpis.filter((kpi) => kpi.id !== id));
  };

  const updateKpi = (id, field, value) => {
    setKpis(
      kpis.map((kpi) => (kpi.id === id ? { ...kpi, [field]: value } : kpi)),
    );
  };

  const totalWeight = kpis.reduce(
    (sum, kpi) => sum + parseInt(kpi.weight || 0),
    0,
  );

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      <main className="">
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          {/* Page Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <span>Performance</span>
                <span className="text-xs">›</span>
                <span className="text-primary font-medium">Assign KPIs</span>
              </nav>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                Set Performance Goals
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Define key performance indicators and expectations for the
                upcoming review cycle.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-bold shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700">
                <FileText className="text-lg" />
                Load Template
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Sidebar: Employee Selection */}
            <aside className="lg:col-span-1">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                  Employee Details
                </h3>
                <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Select Team Member
                    </label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 pr-10 text-sm focus:border-primary focus:ring-primary">
                        <option value="">Choose an employee</option>
                        <option selected>Alex Rivera (Senior Developer)</option>
                        <option>Sarah Chen (Product Designer)</option>
                        <option>James Wilson (Project Lead)</option>
                        <option>Maria Garcia (QA Specialist)</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        ▼
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#5048e5]/5 p-4 flex items-center gap-4 border border-primary/10">
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-slate-200 overflow-hidden">
                      <img
                        alt="Alex Rivera"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAatRCSKUgAalFao7yo5s7cESTelLYcNLQRRAFI9nCoIs0rKzI6FhtTb2lxvEy0M6dLhkGlkgNZp_CeP811-dkCbGjx541FUu8IC1G3xd4nF78rRlUPcx6a0WFHcFCpD5B6CzxuVfGBnE01Q4EeLzb8ofG9MpIqo-1nyIQwl5SKXXWJuMmOaitbJBv2xZ-pxWkOp2bgjfmldLd_7KmWgrXYwMpDaHzqp_tAKnHLkajffmIkEdQWA_0HJr5UFVs56T_AY8kxl1uG3RA"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Alex Rivera
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
                      <span className="text-amber-600 dark:text-amber-400">
                        KPI Drafting
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Form Area: KPI Assignment */}
            <div className="lg:col-span-2 space-y-6">
              {kpis.map((kpi, index) => (
                <div
                  key={kpi.id}
                  className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:border-primary/50"
                >
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => deleteKpi(kpi.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="text-lg" />
                    </button>
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5048e5]/10 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="font-bold">
                      {index === 0
                        ? "Primary Goal"
                        : index === 1
                          ? "Project Delivery"
                          : `KPI ${index + 1}`}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="md:col-span-3">
                      <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">
                        KPI Title
                      </label>
                      <input
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                        placeholder="Enter KPI Title"
                        type="text"
                        value={kpi.title}
                        onChange={(e) =>
                          updateKpi(kpi.id, "title", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">
                        Weight (%)
                      </label>
                      <input
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                        placeholder="0"
                        type="number"
                        value={kpi.weight}
                        onChange={(e) =>
                          updateKpi(kpi.id, "weight", e.target.value)
                        }
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">
                        Description
                      </label>
                      <textarea
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                        placeholder="Describe the expectations for this KPI..."
                        rows="2"
                        value={kpi.description}
                        onChange={(e) =>
                          updateKpi(kpi.id, "description", e.target.value)
                        }
                      ></textarea>
                    </div>

                    <div className="md:col-span-4">
                      <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">
                        Target Metric
                      </label>
                      <input
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                        placeholder="e.g. 10% increase in revenue"
                        type="text"
                        value={kpi.targetMetric}
                        onChange={(e) =>
                          updateKpi(kpi.id, "targetMetric", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty KPI Template */}
              <div className="group relative rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-6 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/80">
                <button
                  onClick={addKpi}
                  className="flex w-full flex-col items-center justify-center gap-3 py-4 text-slate-500 hover:text-primary transition-colors"
                >
                  <PlusCircle className="text-4xl" />
                  <span className="text-sm font-bold">Add New KPI Row</span>
                </button>
              </div>

              {/* Summary & Controls */}
              <div className="mt-8 rounded-xl bg-slate-900 p-6 text-white dark:bg-[#5048e5]/20 dark:text-slate-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Total Weight
                      </p>
                      <p className="text-3xl font-black">
                        {totalWeight}{" "}
                        <span className="text-xl font-normal text-slate-400">
                          / 100%
                        </span>
                      </p>
                    </div>
                    <div className="h-10 w-px bg-slate-700"></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        KPI Count
                      </p>
                      <p className="text-3xl font-black">{kpis.length}</p>
                    </div>
                  </div>

                  <div className="flex w-full md:w-auto gap-3">
                    <button className="flex-1 rounded-xl border border-slate-700 px-6 py-3 text-sm font-bold transition-colors hover:bg-slate-800">
                      Discard Changes
                    </button>
                    <button
                      className={`flex-1 rounded-xl px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 ${totalWeight === 100 ? "bg-[#5048e5] shadow-primary/30" : "bg-slate-600 cursor-not-allowed"}`}
                    >
                      Save & Publish
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <Info className="text-sm" />
                  <p>
                    Total weight must equal 100% before you can publish these
                    KPIs to the employee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssignKpis;
