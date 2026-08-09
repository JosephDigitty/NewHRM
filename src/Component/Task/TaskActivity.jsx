import React from "react";
import {
  Grid,
  LayoutDashboard,
  CheckCircle,
  Users,
  TrendingUp,
  FolderOpen,
  Settings,
  Search,
  Bell,
  HelpCircle,
  Calendar,
  Folder,
  Plus,
  RefreshCw,
  MoreHorizontal,
  Download,
  Bold,
  Italic,
  List,
  Paperclip,
  Send,
  Edit,
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Keep the existing AppraisalSidebar and AppraisalNavBar
import AppraisalSidebar from "../AppraisalSidebar";
import AppraisalNavBar from "../AppraisalNavBar";

const TaskActivity = () => {
  const activityItems = [
    {
      type: "system",
      title: "System created this task",
      time: "2 days ago",
    },
    {
      type: "comment",
      author: "Sarah Jones",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCG2VtSkw5Y9FJBslubHcyww4p8votUtXZL2QHyd5uk_iI90iTbCvDzLT7Z-I58R2Cd5vGP8Vxb97W-GeWKEOYSR4UtcJmBpnHnp6BjGTq010fE1gErqfkJgiZy5ksPtseOrZItcoW8AMk-UD09R2wPLLcun6w_f-ZbUybwqzNr2GysEcI2XMXGNiqfrCohOZYIsJxy1L6xF55Rz6ratjzFa4dZcElAAoNWgCPdRD0X7K0soS47yQFDZba5l-rnfHORtUWbhg88ZQs",
      content:
        "I've uploaded the initial draft for the self-assessment based on the templates we discussed. Please review section 3 specifically, as I had some questions about the KPI metrics.",
      time: "Oct 12, 10:30 AM",
      file: "Draft_v1.pdf",
      fileSize: "2.4 MB",
    },
    {
      type: "status",
      from: "To Do",
      to: "In Progress",
      time: "5 hours ago",
    },
    {
      type: "comment",
      author: "Alex Morgan",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDRsgHI-ygvYK4pd4-5Vtn4cO8fXFrp7yUfT7CV0wk72mYpjv3RH683B0YQhjz6qBrzdI80Ae9yOoaJbGSMhBYrTwJIuCuNaoqHJIiPT8oBd3QTpBHKKZx_YTqU3CQsQ0pcFDOF-eZkAkEHDYo4zOL_yhdLx19xE9Nc7UU83I2FShq8TBnAIovnvbyJnLvpvD_AB-cZTSSXOQkWUBbkF7Pk5BLN5iGmc-B3lTQMxr9VVlBL4lq42M8vdhJyxfuJU9H1xJ59RwV8vJQ",
      content:
        "Thanks Sarah, looking good. I'll add my comments directly to the doc by EOD. Regarding section 3, let's sync tomorrow morning for 15 mins.",
      time: "Just now",
      isSelf: true,
    },
  ];

  const timelineTabs = [
    { label: "All", active: true },
    { label: "Comments", active: false },
    { label: "History", active: false },
  ];

  const currentUser = {
    name: "Alex Morgan",
    role: "Team Lead",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtAcxZnD2Sp1pnzFEGq7MwxfXKDOhWW6wQy66iYBaoVAmKf_fDl-e8S7aO-keW28_aZXoKPc2lwXNA5DhMtJQVG9c4-6enBaJzzSDHCzuqJUT47yk5hTp-P_-lfvKQxrKxf85IcGC7n0bFKc2nzz1iA9zJMuXjDMkhBXJQXuEevHSVAEfV0FzuD38byuVrFJQfM4y8lTo036AaZc7-a6nF4Ei3Vgdg8IAj_akrdsI6368oDPQB5iIZ7U6cZUfmdo34Ghtq0k5zkD8",
  };

  return (
    <div className="flex h-screen bg-[#f5f7f8] dark:bg-[#0f1b23]">
      {/* Sidebar */}
      <AppraisalSidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative  ">
        {/* Top Navigation */}
        <AppraisalNavBar />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f5f7f8] p-6 pb-24 scroll-smooth pt-20">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm font-medium text-slate-500">
              <NavLink
                to="#"
                className="hover:text-[#70c6ff] transition-colors"
              >
                Tasks
              </NavLink>
              <span className="mx-2 text-slate-300">/</span>
              <NavLink
                to="#"
                className="hover:text-[#70c6ff] transition-colors"
              >
                Performance Reviews
              </NavLink>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900">Q3 Goals - Sarah Jones</span>
            </nav>

            {/* Task Header Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/60">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 uppercase tracking-wide">
                      In Progress
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100 uppercase tracking-wide">
                      High Priority
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                    Performance Review: Q3 Goals for Sarah Jones
                  </h2>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button className="h-10 px-4 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Task
                  </button>
                  <button className="h-10 px-4 rounded-lg bg-[#70c6ff] hover:bg-[#5bb8f5] text-[#0f1b23] font-bold text-sm shadow-sm transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">
                    Assignee
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBhd6H1eWfHtQbEex-rexHYV3d3mfhkhyMSt6kA1VOhBDDfwrAXYl4Er3aDUomjBAR3T8i5rJ7i7zsOFT8hSvn2L7sPOrynVW-ntw9TsQP0xMgy6-00nmbsyKjaPuWRzPuBzKg2RfE4lld4lbDYHGJbu0EmnBohpknj5baO4QVjUNZZweWXJE1HihOFtjb0xOT1cpO2otIaceUIBWIkV8ktsYh75-DD6pNBPsoPQ8JyhTB2OK4rRZqwp9q6WqNPxU-vF2UeQ0LXgXM')`,
                      }}
                    />
                    <span className="text-sm font-semibold text-slate-900">
                      Sarah Jones
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">
                    Reviewer
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCu3SaDcqT_bWuHt7VtsYMOqHcHKa5cVoldjrciNX6m_3kGWfJ2fC6TnJgZsipWTFHQ0m4lXknH2o9qDOKhP8tr39i3Xdbxi2HPrDb7RIzLdrH6PnembhsdGLgFD7VmOWnVO9xozKEHCz7otgr3Nq1c5SQUasGqW3EGKzLHwWw8mtWehS4RpRVqbI2bv_Z6FnL7IpeN7o_rU4QzkNHseKHqbDcIKKxC5hksHU7OakO8UWH1VpbKATMxsWQ3ukJIlYPxqyjzDhqtOlg')`,
                      }}
                    />
                    <span className="text-sm font-semibold text-slate-900">
                      Alex Morgan
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">
                    Due Date
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">
                      Oct 15, 2023
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">
                    Project
                  </p>
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">
                      Q3 Reviews
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Activity & Comments
                </h3>
                <div className="flex bg-white rounded-lg p-0.5 border border-slate-200">
                  {timelineTabs.map((tab, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                        tab.active
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="relative pl-8 md:pl-12 space-y-8">
                {/* Timeline Line */}
                <div className="absolute left-4 md:left-6 top-2 bottom-0 w-0.5 bg-slate-200" />

                {activityItems.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Timeline Icon */}
                    <div
                      className={`absolute -left-[2.1rem] md:-left-[2.6rem] top-0 w-8 md:w-10 rounded-full border-4 border-[#f5f7f8] flex items-center justify-center z-10 ${
                        item.type === "system"
                          ? "bg-slate-100 text-slate-500"
                          : item.type === "status"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-white overflow-hidden"
                      }`}
                    >
                      {item.type === "system" && <Plus className="w-4 h-4" />}
                      {item.type === "status" && (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      {item.type === "comment" && (
                        <img
                          alt={item.author}
                          className="w-full h-full object-cover"
                          src={item.avatar}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pt-1 md:pt-2">
                      {item.type === "system" ? (
                        <p className="text-sm text-slate-500">
                          <span className="font-semibold text-slate-900">
                            System
                          </span>{" "}
                          {item.title}
                          <span className="text-slate-400 mx-1">•</span>{" "}
                          {item.time}
                        </p>
                      ) : item.type === "status" ? (
                        <p className="text-sm text-slate-500">
                          Status changed from{" "}
                          <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                            {item.from}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-xs">
                            {item.to}
                          </span>
                          <span className="text-slate-400 mx-1">•</span>{" "}
                          {item.time}
                        </p>
                      ) : (
                        <div
                          className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-[#70c6ff]/30 transition-colors ${
                            item.isSelf ? "ring-2 ring-[#70c6ff]/5" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">
                                {item.author}
                              </span>
                              {item.isSelf && (
                                <span className="px-2 py-0.5 rounded bg-[#70c6ff]/20 text-blue-800 text-[10px] font-bold uppercase">
                                  You
                                </span>
                              )}
                              <span className="text-xs text-slate-400">
                                {item.time}
                              </span>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-slate-700 text-sm leading-relaxed mb-3">
                            {item.content}
                          </p>
                          {item.file && (
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-100 transition-colors cursor-pointer group/file w-full sm:w-fit">
                              <div className="w-10 h-10 rounded bg-red-100 flex items-center justify-center text-red-500">
                                <span className="font-bold text-sm">PDF</span>
                              </div>
                              <div className="flex flex-col min-w-[120px]">
                                <span className="text-sm font-semibold text-slate-900 group-hover/file:text-blue-700">
                                  {item.file}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {item.fileSize}
                                </span>
                              </div>
                              <button className="ml-4 p-1 rounded-full hover:bg-white text-slate-400 hover:text-blue-600 transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* End of History Marker */}
                <div className="relative">
                  <div className="absolute -left-[1.6rem] md:-left-[2.1rem] top-2 w-4 h-4 rounded-full bg-slate-200 border-4 border-[#f5f7f8] z-10" />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Sticky Comment Input Footer */}
        <div className="bg-white border-t border-slate-200 p-4 absolute bottom-0 w-full z-20">
          <div className="max-w-5xl mx-auto flex gap-4">
            <div className="hidden sm:block shrink-0">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${currentUser.avatar})`,
                }}
              />
            </div>
            <div className="flex-1 relative">
              <div className="w-full border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#70c6ff]/20 focus-within:border-[#70c6ff] transition-all bg-slate-50 focus-within:bg-white">
                <textarea
                  className="w-full p-3 bg-transparent border-none focus:ring-0 text-sm text-slate-900 resize-none placeholder:text-slate-400"
                  placeholder="Write a comment..."
                  rows="3"
                />
                {/* Toolbar */}
                <div className="flex items-center justify-between px-2 py-2 bg-white border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="Bold"
                    >
                      <Bold className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="Italic"
                    >
                      <Italic className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="List"
                    >
                      <List className="w-5 h-5" />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors flex items-center gap-1"
                      title="Attach file"
                    >
                      <Paperclip className="w-5 h-5" />
                      <span className="text-xs font-medium hidden sm:inline">
                        Attach
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button className="bg-[#70c6ff] hover:bg-[#5bb8f5] text-[#0f1b23] text-sm font-bold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                      <span>Send</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskActivity;
