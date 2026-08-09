import React, { useState } from "react";
import {
  LayoutDashboard,
  CheckCircle,
  Users,
  FileText,
  Settings,
  BarChart3,
  Search,
  Bell,
  HelpCircle,
  Calendar,
  ChevronRight,
  Trash2,
  Save,
  ArrowLeft,
  Send,
  Target,
  TrendingUp,
  Link as LinkIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import AppraisalSidebar from "../AppraisalSidebar";
import AppraisalNavBar from "../AppraisalNavBar";

const EditTask = () => {
  const [formData, setFormData] = useState({
    title: "Q3 Performance Review Setup",
    description:
      "Prepare the initial templates and schedule the review meetings for the engineering department. Ensure all new hires from Q2 are included in the cycle.",
    assignee: "Michael Chen",
    dueDate: "2023-10-15",
    priority: "High",
    status: "In Progress",
    linkedOKR: "Objective 2: Improve Team Efficiency by 15%",
    performanceImpact: 4,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const priorities = ["Low", "Medium", "High", "Critical"];
  const statuses = ["To Do", "In Progress", "Under Review", "Done"];
  const okrs = [
    "Objective 1: Launch Q4 Marketing Campaign",
    "Objective 2: Improve Team Efficiency by 15%",
    "Objective 3: Reduce Technical Debt",
    "None",
  ];

  return (
    <div className="flex h-screen bg-[#f5f7f8] dark:bg-[#0f1b23]">
      <AppraisalSidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative  ">
        <AppraisalNavBar />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth pt-20">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            {/* Breadcrumbs */}
            <nav className="flex text-sm font-medium text-slate-500 dark:text-slate-400">
              <NavLink
                to="/appraisal-dashboard"
                className="hover:text-[#70c6ff] transition-colors"
              >
                Dashboard
              </NavLink>
              <span className="mx-2">/</span>
              <NavLink
                to="/appraisal-dashboard/tasks"
                className="hover:text-[#70c6ff] transition-colors"
              >
                Task Management
              </NavLink>
              <span className="mx-2">/</span>
              <span className="text-slate-900 dark:text-white">Edit Task</span>
            </nav>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Edit Task: {formData.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Modify task details, assignee, and related performance
                  metrics.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Delete Task
                </button>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-[#15222b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 lg:p-8">
              <form className="flex flex-col gap-8">
                {/* SECTION 1: GENERAL INFO */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                    General Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Task Title
                      </span>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1b23] text-slate-900 dark:text-white focus:border-[#70c6ff] focus:ring-[#70c6ff] h-11 px-4 placeholder:text-slate-400"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Description
                      </span>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1b23] text-slate-900 dark:text-white focus:border-[#70c6ff] focus:ring-[#70c6ff] min-h-[120px] p-4 placeholder:text-slate-400 resize-none"
                        placeholder="Describe the task details..."
                      />
                    </label>
                  </div>
                </div>

                {/* SECTION 2: LOGISTICS */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                    Logistics & Assignment
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assignee */}
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Assignee
                      </span>
                      <select
                        value={formData.assignee}
                        onChange={(e) =>
                          handleInputChange("assignee", e.target.value)
                        }
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1b23] text-slate-900 dark:text-white focus:border-[#70c6ff] focus:ring-[#70c6ff] h-11 px-4"
                      >
                        <option>Michael Chen</option>
                        <option>Sarah Williams</option>
                        <option>David Miller</option>
                      </select>
                    </label>
                    {/* Due Date */}
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Due Date
                      </span>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) =>
                            handleInputChange("dueDate", e.target.value)
                          }
                          className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1b23] text-slate-900 dark:text-white focus:border-[#70c6ff] focus:ring-[#70c6ff] h-11 pl-10 pr-4"
                        />
                      </div>
                    </label>
                    {/* Priority */}
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Priority
                      </span>
                      <select
                        value={formData.priority}
                        onChange={(e) =>
                          handleInputChange("priority", e.target.value)
                        }
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1b23] text-slate-900 dark:text-white focus:border-[#70c6ff] focus:ring-[#70c6ff] h-11 px-4"
                      >
                        {priorities.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </label>
                    {/* Status */}
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Status
                      </span>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1b23] text-slate-900 dark:text-white focus:border-[#70c6ff] focus:ring-[#70c6ff] h-11 px-4"
                      >
                        {statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                {/* SECTION 3: PERFORMANCE METRICS */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                    HR & Appraisal Context
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Related Goal */}
                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Linked OKR / Goal
                      </span>
                      <select
                        value={formData.linkedOKR}
                        onChange={(e) =>
                          handleInputChange("linkedOKR", e.target.value)
                        }
                        className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1b23] text-slate-900 dark:text-white focus:border-[#70c6ff] focus:ring-[#70c6ff] h-11 px-4"
                      >
                        {okrs.map((okr) => (
                          <option key={okr}>{okr}</option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-500">
                        This task contributes to the completion of the selected
                        objective.
                      </p>
                    </label>
                    {/* Performance Impact */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Performance Impact
                        </span>
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-[#70c6ff]/10 text-slate-700 dark:text-[#70c6ff]">
                          High Impact
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-400">Low</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={formData.performanceImpact}
                          onChange={(e) =>
                            handleInputChange(
                              "performanceImpact",
                              e.target.value,
                            )
                          }
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#70c6ff]"
                        />
                        <span className="text-xs text-slate-400">High</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Estimated weight of this task in the employee's
                        quarterly review.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACTION BAR */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-2">
                  <button
                    type="button"
                    className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#70c6ff] hover:bg-[#5dbcfc] text-[#0f1b23] font-bold shadow-sm shadow-[#70c6ff]/20 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditTask;
