import React, { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  FileBarChart2,
  Home,
  LogOut,
  Menu,
  MoreVertical,
  Search,
  Settings,
  Timer,
  Users,
  X,
} from "lucide-react";

/* =========================================================
   MOCK DATA
   Replace this later with API response
========================================================= */

const appraisalPeriods = [
  {
    id: "period-001",
    name: "Annual Appraisal 2026",
    startDate: "01 Jan 2026",
    endDate: "31 Dec 2026",
    status: "Active",
  },
  {
    id: "period-002",
    name: "Mid-Year Appraisal 2026",
    startDate: "01 Jun 2026",
    endDate: "30 Jun 2026",
    status: "Closed",
  },
];

const employees = [
  {
    id: 1,
    employeeId: "EMP-001",
    name: "John Doe",
    position: "Senior Associate",
    department: "Corporate",
    avatar:
      "https://i.pravatar.cc/100?img=12",
    appraisalPeriod: "Annual Appraisal 2026",
    selfAppraisal: {
      status: "Completed",
      date: "15 May 2026",
    },
    status: "Awaiting Your Review",
    dueDate: "20 Dec 2026",
    daysLeft: 5,
  },
  {
    id: 2,
    employeeId: "EMP-002",
    name: "Sarah James",
    position: "Associate",
    department: "Litigation",
    avatar:
      "https://i.pravatar.cc/100?img=47",
    appraisalPeriod: "Annual Appraisal 2026",
    selfAppraisal: {
      status: "Completed",
      date: "12 May 2026",
    },
    status: "Awaiting Your Review",
    dueDate: "20 Dec 2026",
    daysLeft: 5,
  },
  {
    id: 3,
    employeeId: "EMP-003",
    name: "Michael Obi",
    position: "Associate",
    department: "Corporate",
    avatar:
      "https://i.pravatar.cc/100?img=11",
    appraisalPeriod: "Annual Appraisal 2026",
    selfAppraisal: {
      status: "Pending",
      date: null,
    },
    status: "Awaiting Self-Appraisal",
    dueDate: "20 Dec 2026",
    daysLeft: 5,
  },
  {
    id: 4,
    employeeId: "EMP-004",
    name: "Jane Williams",
    position: "Senior Associate",
    department: "Finance",
    avatar:
      "https://i.pravatar.cc/100?img=44",
    appraisalPeriod: "Annual Appraisal 2026",
    selfAppraisal: {
      status: "Completed",
      date: "10 May 2026",
    },
    status: "Awaiting Your Review",
    dueDate: "20 Dec 2026",
    daysLeft: 5,
  },
  {
    id: 5,
    employeeId: "EMP-005",
    name: "Peter Okafor",
    position: "Associate",
    department: "Litigation",
    avatar:
      "https://i.pravatar.cc/100?img=13",
    appraisalPeriod: "Annual Appraisal 2026",
    selfAppraisal: {
      status: "Completed",
      date: "25 Apr 2026",
    },
    status: "Overdue",
    dueDate: "15 Dec 2026",
    daysLeft: -5,
  },
  {
    id: 6,
    employeeId: "EMP-006",
    name: "Esther Yusuf",
    position: "Associate",
    department: "Corporate",
    avatar:
      "https://i.pravatar.cc/100?img=45",
    appraisalPeriod: "Annual Appraisal 2026",
    selfAppraisal: {
      status: "Completed",
      date: "18 May 2026",
    },
    status: "In Progress",
    dueDate: "20 Dec 2026",
    daysLeft: 5,
  },
  {
    id: 7,
    employeeId: "EMP-007",
    name: "Daniel Adisa",
    position: "Analyst",
    department: "Finance",
    avatar:
      "https://i.pravatar.cc/100?img=14",
    appraisalPeriod: "Annual Appraisal 2026",
    selfAppraisal: {
      status: "Pending",
      date: null,
    },
    status: "Awaiting Self-Appraisal",
    dueDate: "20 Dec 2026",
    daysLeft: 5,
  },
];

/* =========================================================
   SIDEBAR
========================================================= */

const sidebarItems = [
  {
    label: "Dashboard",
    icon: Home,
  },
  {
    label: "My Team",
    icon: Users,
  },
  {
    label: "My Appraisals",
    icon: ClipboardCheck,
    active: true,
  },
  {
    label: "KPI & Goals",
    icon: FileBarChart2,
  },
  {
    label: "Reports",
    icon: FileBarChart2,
  },
  {
    label: "Appraisal Periods",
    icon: CalendarDays,
  },
  {
    label: "Employees",
    icon: Users,
  },
  {
    label: "Training",
    icon: ClipboardCheck,
  },
  {
    label: "Settings",
    icon: Settings,
  },
];

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon: Icon,
  title,
  value,
  subtitle,
  iconClass,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={27} strokeWidth={1.8} />
        </div>

        <div>
          <p className="text-sm text-slate-600">{title}</p>

          <h3 className="mt-1 text-3xl font-semibold text-slate-950">
            {value}
          </h3>

          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const styles = {
    "Awaiting Your Review":
      "bg-blue-50 text-blue-600 border-blue-100",
    "Awaiting Self-Appraisal":
      "bg-amber-50 text-amber-600 border-amber-100",
    "In Progress":
      "bg-purple-50 text-purple-700 border-purple-100",
    Overdue:
      "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium ${
        styles[status] ||
        "bg-slate-50 text-slate-600 border-slate-100"
      }`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   SELF APPRAISAL STATUS
========================================================= */

function SelfAppraisalStatus({ appraisal }) {
  const completed = appraisal.status === "Completed";

  return (
    <div className="flex items-start gap-2">
      {completed ? (
        <CheckCircle2
          size={17}
          className="mt-0.5 shrink-0 text-green-500"
        />
      ) : (
        <Clock3
          size={17}
          className="mt-0.5 shrink-0 text-amber-500"
        />
      )}

      <div>
        <p
          className={`text-sm font-medium ${
            completed ? "text-green-600" : "text-amber-600"
          }`}
        >
          {appraisal.status}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {appraisal.date || "Not submitted"}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({ employee, onClick }) {
  if (employee.status === "Awaiting Your Review") {
    return (
      <button
        onClick={() => onClick(employee)}
        className="rounded-md bg-[#4b2bc3] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#3f23a8]"
      >
        Appraise
      </button>
    );
  }

  if (employee.status === "In Progress") {
    return (
      <button
        onClick={() => onClick(employee)}
        className="rounded-md border border-[#6d4ce6] px-4 py-2 text-xs font-semibold text-[#4b2bc3] transition hover:bg-purple-50"
      >
        Continue
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick(employee)}
      className="rounded-md border border-[#b9a7f7] px-4 py-2 text-xs font-semibold text-[#4b2bc3] transition hover:bg-purple-50"
    >
      View
    </button>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function MyTeamAppraisals() {
  const [selectedPeriod, setSelectedPeriod] =
    useState("Annual Appraisal 2026");

  const [selectedStatus, setSelectedStatus] =
    useState("All Status");

  const [search, setSearch] = useState("");

  const [mobileSidebar, setMobileSidebar] =
    useState(false);

  const [openMenu, setOpenMenu] = useState(null);

  /* -------------------------------------------------------
     FILTER DATA
  ------------------------------------------------------- */

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesPeriod =
        selectedPeriod === "All Periods" ||
        employee.appraisalPeriod === selectedPeriod;

      const matchesStatus =
        selectedStatus === "All Status" ||
        employee.status === selectedStatus;

      const searchValue = search.toLowerCase();

      const matchesSearch =
        employee.name.toLowerCase().includes(searchValue) ||
        employee.employeeId.toLowerCase().includes(searchValue) ||
        employee.department.toLowerCase().includes(searchValue);

      return (
        matchesPeriod &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [selectedPeriod, selectedStatus, search]);

  /* -------------------------------------------------------
     ACTION
  ------------------------------------------------------- */

  const handleAppraise = (employee) => {
    console.log("Selected employee:", employee);

    // Later:
    // navigate(`/appraisals/${employee.id}`);
  };

  const handleExport = () => {
    console.log("Export appraisal data", filteredEmployees);

    // Later:
    // call backend export endpoint
  };

  return (
    <div className="min-h-screen bg-[#fafbfe] text-slate-900">
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileSidebar(false)}
        />
      )}
      <main className="min-h-screen lg:ml-[22px]">
        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="flex h-[88px] items-center justify-between border-b border-slate-100 bg-white px-5 sm:px-8 lg:px-9">
          <button
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileSidebar(true)}
          >
            <Menu size={22} />
          </button>

          <div className="ml-auto flex items-center gap-5">
            {/* Notification */}

            <button className="relative rounded-full p-2 text-slate-700 hover:bg-slate-50">
              <Bell size={24} strokeWidth={1.6} />

              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                3
              </span>
            </button>

            <div className="h-8 w-px bg-slate-200" />

            {/* User */}

            <button className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/100?img=68"
                alt="David Smith"
                className="h-10 w-10 rounded-full object-cover"
              />

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  David Smith
                </p>

                <p className="text-xs text-slate-500">
                  Finance Manager
                </p>
              </div>

              <ChevronDown
                size={17}
                className="text-slate-700"
              />
            </button>
          </div>
        </header>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <section className="px-5 py-7 sm:px-8 lg:px-9">
          {/* Page title */}

          <div className="mb-7">
            <h1 className="text-[28px] font-semibold tracking-tight text-slate-950">
              My Team Appraisals
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Employees assigned to you for performance
              appraisal.
            </p>
          </div>

          {/* =================================================
              SUMMARY + CURRENT CYCLE
          ================================================= */}

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_373px]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                icon={Users}
                title="Total Assigned"
                value="12"
                subtitle="Employees"
                iconClass="bg-purple-50 text-[#4b2bc3]"
              />

              <SummaryCard
                icon={Timer}
                title="Awaiting Your Review"
                value="7"
                subtitle="Employees"
                iconClass="bg-amber-50 text-amber-500"
              />

              <SummaryCard
                icon={CheckCircle2}
                title="Completed"
                value="5"
                subtitle="Employees"
                iconClass="bg-green-50 text-green-500"
              />

              <SummaryCard
                icon={Clock3}
                title="Overdue"
                value="2"
                subtitle="Employees"
                iconClass="bg-red-50 text-red-500"
              />
            </div>

            {/* Current Cycle */}

            <div className="rounded-xl border border-purple-200 bg-[#f7f4ff] p-5 shadow-sm">
              <p className="text-xs font-medium text-[#302080]">
                Current Appraisal Cycle
              </p>

              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                Annual Appraisal 2026
              </h2>

              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <CalendarDays size={16} />

                <span>
                  01 Jan 2026 - 31 Dec 2026
                </span>
              </div>

              <p className="mt-4 text-sm font-semibold text-[#4b2bc3]">
                7 employees awaiting your review
              </p>

              <button
                onClick={() => {
                  const employee = employees.find(
                    (item) =>
                      item.status ===
                      "Awaiting Your Review"
                  );

                  if (employee) {
                    handleAppraise(employee);
                  }
                }}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-md bg-[#4b2bc3] py-3 text-sm font-medium text-white transition hover:bg-[#3e23a6]"
              >
                Start Next Appraisal

                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="mt-7 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[268px_245px_1fr_auto]">
              {/* Period */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Appraisal Period
                </label>

                <div className="relative">
                  <select
                    value={selectedPeriod}
                    onChange={(e) =>
                      setSelectedPeriod(e.target.value)
                    }
                    className="h-10 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#4b2bc3] focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="All Periods">
                      All Periods
                    </option>

                    {appraisalPeriods.map((period) => (
                      <option
                        key={period.id}
                        value={period.name}
                      >
                        {period.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-3 top-3 text-slate-500"
                  />
                </div>
              </div>

              {/* Status */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value)
                    }
                    className="h-10 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#4b2bc3] focus:ring-2 focus:ring-purple-100"
                  >
                    <option>All Status</option>
                    <option>Awaiting Your Review</option>
                    <option>Awaiting Self-Appraisal</option>
                    <option>In Progress</option>
                    <option>Overdue</option>
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-3 top-3 text-slate-500"
                  />
                </div>
              </div>

              {/* Search */}

              <div>
                <label className="mb-2 block text-sm font-medium text-transparent">
                  Search
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-3 text-slate-500"
                  />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search employee by name..."
                    className="h-10 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#4b2bc3] focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              {/* Export */}

              <div>
                <label className="mb-2 block text-sm font-medium text-transparent">
                  Export
                </label>

                <button
                  onClick={handleExport}
                  className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#b9a7f7] px-5 text-sm font-medium text-[#4b2bc3] transition hover:bg-purple-50"
                >
                  <Download size={17} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-white">
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-800">
                      #
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-800">
                      Employee
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-800">
                      Position
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-800">
                      Department
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-800">
                      Appraisal Period
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-800">
                      Self-Appraisal
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-800">
                      Status
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-800">
                      Due Date
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold text-slate-800">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map(
                      (employee, index) => (
                        <tr
                          key={employee.id}
                          className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                        >
                          {/* Number */}

                          <td className="px-5 py-5 text-sm font-medium text-slate-800">
                            {index + 1}
                          </td>

                          {/* Employee */}

                          <td className="px-4 py-5">
                            <div className="flex items-center gap-3">
                              <img
                                src={employee.avatar}
                                alt={employee.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />

                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {employee.name}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                  {employee.employeeId}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Position */}

                          <td className="px-4 py-5 text-sm text-slate-700">
                            {employee.position}
                          </td>

                          {/* Department */}

                          <td className="px-4 py-5 text-sm text-slate-700">
                            {employee.department}
                          </td>

                          {/* Period */}

                          <td className="px-4 py-5 text-sm text-slate-700">
                            {employee.appraisalPeriod}
                          </td>

                          {/* Self Appraisal */}

                          <td className="px-4 py-5">
                            <SelfAppraisalStatus
                              appraisal={
                                employee.selfAppraisal
                              }
                            />
                          </td>

                          {/* Status */}

                          <td className="px-4 py-5">
                            <StatusBadge
                              status={employee.status}
                            />
                          </td>

                          {/* Due Date */}

                          <td className="px-4 py-5">
                            <div className="flex items-start gap-2">
                              <CalendarDays
                                size={16}
                                className="mt-0.5 text-slate-600"
                              />

                              <div>
                                <p className="text-sm text-slate-700">
                                  {employee.dueDate}
                                </p>

                                {employee.daysLeft < 0 ? (
                                  <p className="mt-1 text-xs font-medium text-red-500">
                                    Overdue by{" "}
                                    {Math.abs(
                                      employee.daysLeft
                                    )}{" "}
                                    days
                                  </p>
                                ) : (
                                  <p className="mt-1 text-xs text-slate-500">
                                    {employee.daysLeft}{" "}
                                    days left
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Action */}

                          <td className="px-4 py-5">
                            <div className="flex items-center gap-2">
                              <ActionButton
                                employee={employee}
                                onClick={handleAppraise}
                              />

                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setOpenMenu(
                                      openMenu ===
                                        employee.id
                                        ? null
                                        : employee.id
                                    )
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                                >
                                  <MoreVertical
                                    size={17}
                                  />
                                </button>

                                {openMenu ===
                                  employee.id && (
                                  <div className="absolute right-0 top-10 z-30 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                                    <button
                                      onClick={() => {
                                        console.log(
                                          "View employee",
                                          employee
                                        );
                                        setOpenMenu(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                      View Details
                                    </button>

                                    <button
                                      onClick={() => {
                                        console.log(
                                          "Send reminder",
                                          employee
                                        );
                                        setOpenMenu(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                      Send Reminder
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-5 py-16 text-center"
                      >
                        <div className="flex flex-col items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <Search
                              size={21}
                              className="text-slate-400"
                            />
                          </div>

                          <p className="mt-3 text-sm font-medium text-slate-800">
                            No employees found
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Try changing your filters or
                            search term.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* =================================================
                TABLE FOOTER
            ================================================= */}

            <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">
                  {filteredEmployees.length > 0
                    ? 1
                    : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium text-slate-700">
                  {filteredEmployees.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">
                  {filteredEmployees.length}
                </span>{" "}
                employees
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-300"
                >
                  <ChevronLeft size={17} />
                </button>

                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-[#4b2bc3] text-xs font-semibold text-white">
                  1
                </button>

                <button
                  disabled
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-300"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}