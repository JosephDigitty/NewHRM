import React from "react";
import {
  Calendar,
  Clock,
  Building2,
  Paperclip,
  Edit,
  MoreHorizontal,
  CheckCircle,
  ChevronRight,
  Grid,
  BarChart,
  Users,
  Settings,
  Search,
  Bell,
  Plus,
  ShieldCheck,
  Hourglass,
  Code,
  BadgeCheck,
  Send,
  Menu,
  Star,
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Keep the existing AppraisalSidebar and AppraisalNavBar
import AppraisalSidebar from "../AppraisalSidebar";
import AppraisalNavBar from "../AppraisalNavBar";

const TaskDetail = () => {
  const teamMembers = [
    {
      name: "Sarah Jenkins",
      role: "Senior Developer",
      subRole: "Lead",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuACUZ4aaq8rUlszpuxMn2YkdJ1ZBj__4Iu7vnJ35dDnjiSf79O0nAkdKDdg9-9q8F1f5lyU-6mo9tMT1FV6Z5WBse9p4m9wedozITOok7J-INLab3W6-a44156ZgSWNpyu55tcZnWuaxChrEs9KanKOnebYca4aCCfomZvIZ5WxhxA9rU7ocPt_djC_gB0tU4O5Twl_xaEnwg8u0ofQBfB71D6ZfJcsvxgI_UFP3TJbXUskjVZ8k6pTnTvvVgWerKsFqBJDJR4Nr7g",
    },
    {
      name: "Michael Chen",
      role: "DevOps Engineer",
      subRole: null,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBIG6RRzY8q7kd1wEJnbgxJhTPmUq3TL4CG1jSd8k8775KGkBgUNSv8lrPvB6nnOpeBGWprWXwGP2lcYBd7S73o3-ymC3e65OGx0gR70bu9uf8DlftvmKsb6BsigQEKTlGbFcr7EbfuxaiZ2cYTQaDZnfc5iB7tdCiwbgIcnKihfE7cBtQcPkZ2j8yqKXDdSxOZOJPJjt39cHQt6swzysDR7HQEsw0s3Q4BavAnKm2gEiwoUZID6sTZi8xu16numWbZ-CZF3j9ERU8",
    },
  ];

  const timelineItems = [
    {
      type: "complete",
      title: "Task moved to In Progress",
      time: "Today, 9:42 AM",
      author: "Sarah Jenkins",
    },
    {
      type: "primary",
      title: "New file uploaded",
      time: "Yesterday, 4:30 PM",
      author: "Michael Chen",
      file: "specs_v2.pdf",
    },
    {
      type: "default",
      title: "Task Created",
      time: "Oct 24, 2023",
      author: "Alex Morgan",
    },
  ];

  const comments = [
    {
      author: "Sarah Jenkins",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuArNeT5jYBgKo7lIdQO7aYpuqgnc4ptq0kkWZowtkmJrJe_-n-pvpo3OKMx4Md0yqDr8F2bJ3MdYSCPvfeRCO6wldvDUbKIPsSB67d5MRxOGtctKFt7Yo-lXPZ7QyjjtEr7rDm0Eru1VwaomztlmOZvGqlyUgKz0asIWa5RCWKZSYOy9NdjYt6LaLbQo4zztjZbr9dJy3Utejh7ZIq27ewx6aLqUEtEpRXv0tt25XpFZ9A8wzTgMlCpG7E-K9wBGWg0GQ7xxmrEZHQ",
      content:
        "I've started the dry run on the staging environment. Will update metrics shortly.",
      time: "2 hours ago",
      isSelf: false,
    },
    {
      author: "You",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBufsuH4gIfCbz6GGzZnr5Pocx6goVXMI_FoFKBrNRSB_MnYQvzxcyXYEm9xpfeyJ61L7A-zeAtu5db8PsmiI4HqhDUOSS77OFPS1eazrKl8GRCvU686zsNBguMbukohmnTmFFd8bSNOt8WExwLKOV0RlxeRwh1WDatXDQj7lzgJHwJITXMKtvIylJmMaK63fg5jOQ9HF9kJ0fqcFPAC332NWwIsYGT9YFObJM4EQy63J39bNZizvqwBw1_3urZZf8lNlApdzFwkZQ",
      content: "Great, please ensure the backup script runs first.",
      time: "1 hour ago",
      isSelf: true,
    },
  ];

  return (
    <div className="flex h-screen bg-[#f5f7f8] dark:bg-[#0f1b23]">
      {/* Sidebar */}
      <AppraisalSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative ">
        {/* Navigation Bar */}
        <AppraisalNavBar />

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pt-20">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-slate-500">
              <NavLink
                to="#"
                className="hover:text-[#70c6ff] transition-colors"
              >
                Projects
              </NavLink>
              <ChevronRight className="w-4 h-4 mx-2" />
              <NavLink
                to="#"
                className="hover:text-[#70c6ff] transition-colors"
              >
                Q3 Review
              </NavLink>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-slate-900 dark:text-slate-100 font-semibold">
                Task #1024
              </span>
            </nav>

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold uppercase tracking-wide">
                    In Progress
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs font-bold uppercase tracking-wide">
                    High Priority
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Q3 System Migration - Phase 1
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                  Migrate legacy employee database to the new cloud
                  infrastructure.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button className="h-10 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
                  <Edit className="w-4 h-4" />
                  Update
                </button>
                <div className="relative group/menu">
                  <button className="h-10 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 hidden group-hover/menu:block z-20">
                    <NavLink
                      to="#"
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Extend Deadline
                    </NavLink>
                    <NavLink
                      to="#"
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Reassign Task
                    </NavLink>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
                    <NavLink
                      to="#"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete Task
                    </NavLink>
                  </div>
                </div>
                <button className="h-10 px-6 rounded-lg bg-[#70c6ff] hover:bg-[#70c6ff]/90 text-[#101518] font-bold text-sm shadow-sm flex items-center gap-2 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </button>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Task Info, Performance, Team */}
              <div className="lg:col-span-2 space-y-8">
                {/* Key Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                      Due Date
                    </p>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                      <Calendar className="w-4 h-4 text-[#70c6ff]" />
                      Oct 30, 2023
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                      Effort
                    </p>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                      <Clock className="w-4 h-4 text-[#70c6ff]" />
                      42 Hours
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                      Department
                    </p>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                      <Building2 className="w-4 h-4 text-[#70c6ff]" />
                      Engineering
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                      Attachments
                    </p>
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                      <Paperclip className="w-4 h-4 text-[#70c6ff]" />4 Files
                    </div>
                  </div>
                </div>

                {/* Description & Criteria */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                      Task Overview
                    </h3>
                    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                      <p>
                        The current legacy database is causing latency issues
                        during peak hours. This phase involves setting up the
                        new cloud schema and performing a dry-run migration of
                        user data. Special attention must be paid to data
                        integrity validation scripts.
                      </p>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-[#15202b]">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-[#70c6ff]" />
                      Performance Criteria (KPIs)
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#1a2632] rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="mt-0.5 text-purple-500">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">
                            Zero Data Loss
                          </p>
                          <p className="text-xs text-slate-500">
                            Must verify record counts match 100%.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#1a2632] rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="mt-0.5 text-blue-500">
                          <Hourglass className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">
                            Downtime &lt; 2h
                          </p>
                          <p className="text-xs text-slate-500">
                            Migration window is strictly limited.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#1a2632] rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="mt-0.5 text-purple-500">
                          <Code className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">
                            Code Coverage
                          </p>
                          <p className="text-xs text-slate-500">
                            New scripts must have &gt;90% test coverage.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Assigned Team
                    </h3>
                    <button className="text-[#70c6ff] text-sm font-semibold hover:underline">
                      Manage Team
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="p-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-slate-800"
                            style={{ backgroundImage: `url(${member.avatar})` }}
                          />
                          <div>
                            <p className="text-slate-900 dark:text-white font-medium text-sm">
                              {member.name}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {member.role} •{" "}
                              {member.subRole && (
                                <span className="text-blue-500">
                                  {member.subRole}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 rounded bg-[#70c6ff]/10 text-[#70c6ff] hover:bg-[#70c6ff]/20 text-xs font-bold transition-colors flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Appraise Member
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Timeline & Comments */}
              <div className="space-y-6">
                {/* Timeline */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                    Activity Timeline
                  </h3>
                  <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-8">
                    {timelineItems.map((item, index) => (
                      <div key={index} className="relative">
                        <div
                          className={`absolute -left-[21px] top-1 bg-white dark:bg-[#1a2632] border-2 rounded-full w-3 h-3 ${
                            item.type === "complete"
                              ? "border-purple-500"
                              : item.type === "primary"
                                ? "border-[#70c6ff]"
                                : "border-slate-300"
                          }`}
                        />
                        <p className="text-sm text-slate-900 dark:text-white font-medium">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.time} by {item.author}
                        </p>
                        {item.file && (
                          <div className="mt-2 flex items-center gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 w-fit">
                            <span className="text-red-500 text-sm font-medium">
                              {item.file}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-[400px]">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-[#15202b]">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Comments (3)
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.map((comment, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          comment.isSelf ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full bg-cover bg-center shrink-0"
                          style={{
                            backgroundImage: `url(${comment.avatar})`,
                          }}
                        />
                        <div
                          className={`${
                            comment.isSelf ? "flex flex-col items-end" : ""
                          }`}
                        >
                          <div
                            className={`${
                              comment.isSelf
                                ? "bg-[#70c6ff]/20 dark:bg-[#70c6ff]/10 rounded-2xl rounded-tr-none"
                                : "bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-none"
                            } px-4 py-2`}
                          >
                            <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                              {comment.author}
                            </p>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {comment.content}
                            </p>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 ml-2">
                            {comment.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-[#1a2632]">
                    <div className="relative flex items-center">
                      <input
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-1 focus:ring-[#70c6ff] placeholder-slate-400 text-slate-900 dark:text-white"
                        placeholder="Write a comment..."
                        type="text"
                      />
                      <button className="absolute right-2 p-1.5 bg-[#70c6ff] rounded-full text-[#101518] hover:bg-[#70c6ff]/90 transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Spacer */}
            <div className="h-8" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDetail;
