import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock3,
  Download,
  Filter,
  Search,
  Settings,
  UserCheck,
  Users,
  UserRound,
  Hourglass,
  Mail,
  Eye,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { api } from "../../api/request";


const getStatusConfig = (status) => {
  switch (status) {
    case "Appraised":
      return {
        icon: CircleCheck,
        className: "bg-green-50 text-green-600",
        iconClass: "text-green-500",
      };

    case "Awaiting Appraisal":
      return {
        icon: Hourglass,
        className: "bg-amber-50 text-amber-600",
        iconClass: "text-amber-500",
      };

    default:
      return {
        icon: Clock3,
        className: "bg-gray-100 text-gray-600",
        iconClass: "text-gray-500",
      };
  }
};

const getRatingClass = (rating) => {
  switch (rating) {
    case "Excellent":
      return "bg-green-50 text-green-600";

    case "Very Good":
      return "bg-green-50 text-green-600";

    case "Good":
      return "bg-blue-50 text-blue-600";

    case "Needs Improvement":
      return "bg-amber-50 text-amber-600";

    case "Poor":
      return "bg-red-50 text-red-600";

    case "0":
    case 0:
    case null:
    case undefined:
      return "bg-gray-100 text-gray-400";

    default:
      return "bg-gray-100 text-gray-400";
  }
};

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon size={22} className={iconColor} strokeWidth={2} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500">{title}</p>

          <p className="mt-1 text-2xl font-bold tracking-tight text-[#11152D]">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DONUT CHART
========================================================= */

function PerformanceDonut() {
  const segments = [
    {
      label: "Excellent (90-100%)",
      value: 18,
      percentage: "18.4%",
      color: "#16A34A",
    },
    {
      label: "Very Good (75-89%)",
      value: 52,
      percentage: "53.1%",
      color: "#3B82F6",
    },
    {
      label: "Good (60-74%)",
      value: 23,
      percentage: "23.5%",
      color: "#FBBF24",
    },
    {
      label: "Needs Improvement (40-59%)",
      value: 5,
      percentage: "5.1%",
      color: "#8B5CF6",
    },
    {
      label: "Poor (<40%)",
      value: 0,
      percentage: "0%",
      color: "#EF4444",
    },
  ];

  const total = segments.reduce((sum, item) => sum + item.value, 0);

  let cumulative = 0;

  const gradient = segments
    .map((segment) => {
      const start = (cumulative / total) * 360;
      cumulative += segment.value;
      const end = (cumulative / total) * 360;

      return `${segment.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <div className="flex items-center gap-8">
      <div className="relative h-32 w-32 shrink-0">
        <div
          className="h-full w-full rounded-full"
          style={{
            background: `conic-gradient(${gradient})`,
          }}
        />

        <div className="absolute inset-[25px] flex items-center justify-center rounded-full bg-white">
          <div className="text-center">
            <p className="text-lg font-bold text-[#11152D]">98</p>
            <p className="text-[9px] text-gray-400">Employees</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="flex items-center justify-between gap-6 text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />

              <span className="text-gray-600">{segment.label}</span>
            </div>

            <div className="flex gap-2 font-medium text-gray-700">
              <span>{segment.value}</span>
              <span className="text-gray-400">({segment.percentage})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   DEPARTMENT PERFORMANCE
========================================================= */

function DepartmentPerformance() {
  const departments = [
    { name: "Legal", score: 85.6 },
    { name: "Finance", score: 82.3 },
    { name: "Corporate", score: 79.8 },
    { name: "Operations", score: 76.1 },
    { name: "IT", score: 74.2 },
  ];

  return (
    <div className="space-y-5">
      {departments.map((department) => (
        <div
          key={department.name}
          className="grid grid-cols-[70px_1fr_45px] items-center gap-3 text-xs"
        >
          <span className="text-gray-600">{department.name}</span>

          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#4C2BCF]"
              style={{
                width: `${department.score}%`,
              }}
            />
          </div>

          <span className="text-right font-medium text-gray-600">
            {department.score}%
          </span>
        </div>
      ))}

      <button className="mt-2 flex items-center gap-2 text-xs font-medium text-[#4C2BCF] hover:underline">
        View detailed analysis
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

/* =========================================================
   OUTSTANDING CARD
========================================================= */

function OutstandingAppraisals({ onViewAll }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#11152D]">
        Outstanding Appraisals
      </h3>

      <p className="mt-1 text-[11px] leading-5 text-gray-500">
        Employees who have not completed the appraisal process.
      </p>

      <div className="mt-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hourglass size={17} className="text-amber-500" />
            <span className="text-xs text-gray-600">
              Awaiting Self-Appraisal
            </span>
          </div>

          <span className="text-xs font-semibold text-gray-700">12</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck size={17} className="text-blue-500" />
            <span className="text-xs text-gray-600">
              Awaiting Supervisor
            </span>
          </div>

          <span className="text-xs font-semibold text-gray-700">15</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock3 size={17} className="text-gray-400" />
            <span className="text-xs text-gray-600">Not Started</span>
          </div>

          <span className="text-xs font-semibold text-gray-700">0</span>
        </div>
      </div>

      <div className="my-5 border-t border-gray-100" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700">
          Total Outstanding
        </span>

        <span className="text-sm font-bold text-[#4C2BCF]">27</span>
      </div>

      <button
        onClick={onViewAll}
        className="mt-5 flex w-full items-center justify-center rounded-lg bg-[#4C2BCF] py-2.5 text-xs font-semibold text-white transition hover:bg-[#3d21b1]"
      >
        View All Outstanding
      </button>
    </div>
  );
}

/* =========================================================
   QUICK ACTIONS
========================================================= */

function QuickActions() {
  const actions = [
    {
      title: "Send Reminders",
      description: "Send reminder to employees and supervisors",
      icon: Mail,
    },
    {
      title: "Export Report",
      description: "Download performance report",
      icon: Download,
    },
    {
      title: "Performance Settings",
      description: "Configure performance preferences",
      icon: Settings,
    },
    {
      title: "Appraisal Periods",
      description: "Manage appraisal periods",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-[#11152D]">Quick Actions</h3>

      <div className="mt-4">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className={`flex w-full items-center gap-3 py-3 text-left transition hover:bg-gray-50 ${
                index !== actions.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2EFFF]">
                <Icon size={16} className="text-[#4C2BCF]" />
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700">
                  {action.title}
                </p>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function PerformanceReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const employeesPerPage = 8;

  /* -----------------------------------------------
     Calculate summary statistics from backend data
  ------------------------------------------------ */
 
  useEffect(() => {
  const getAppraisals = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/appraisal");

      console.log("Appraisal API:", res.data);

      setAppraisals(res.data?.appraisal || []);
    } catch (error) {
      console.error("Error fetching appraisals:", error);
      setError("Failed to load appraisal data.");
    } finally {
      setLoading(false);
    }
  };

  getAppraisals();
}, []);

/* =========================================================
   APPRAISAL PERIODS
========================================================= */

const appraisalPeriods = useMemo(() => {
  return [
    ...new Map(
      appraisals
        .filter((item) => item.cycle?._id)
        .map((item) => [
          item.cycle._id,
          {
            id: item.cycle._id,
            name: item.cycle.cycleName,
            startDate: item.cycle.startDate,
            endDate: item.cycle.endDate,
            status: item.cycle.status,
          },
        ])
    ).values(),
  ];
}, [appraisals]);


/* =========================================================
   SELECT FIRST PERIOD AFTER API LOAD
========================================================= */

useEffect(() => {
  if (appraisalPeriods.length === 0) {
    return;
  }

  const periodExists = appraisalPeriods.some(
    (period) => period.id === selectedPeriod
  );

  if (!periodExists) {
    setSelectedPeriod(appraisalPeriods[0].id);
  }
}, [appraisalPeriods, selectedPeriod]);


/* =========================================================
   APPRAISALS FOR SELECTED PERIOD
========================================================= */

const filteredAppraisals = useMemo(() => {
  if (!selectedPeriod) return [];

  return appraisals.filter(
    (appraisal) => appraisal.cycle?._id === selectedPeriod
  );
}, [appraisals, selectedPeriod]);


/* =========================================================
   EMPLOYEES
========================================================= */

const employees = useMemo(() => {
  return filteredAppraisals.map((appraisal) => ({
    id: appraisal._id,

    name: appraisal.employee?.fullname || "Unknown Employee",

    email: appraisal.employee?.email || "",

    avatar: appraisal.employee?.profileImage
      ? appraisal.employee.profileImage
      : "https://i.pravatar.cc/100?img=32",

    department:
      appraisal.employee?.job?.department || "N/A",

    supervisor:
      appraisal.supervisor?.personal?.fullname ||
      appraisal.supervisor?.fullname ||
      appraisal.supervisor?.userId ||
      "N/A",

    kpiScore: null,

    competencyScore: null,

    finalScore:
      typeof appraisal.totalScore === "number"
        ? appraisal.totalScore
        : null,

    rating:
      appraisal.rating && appraisal.rating !== "0"
        ? appraisal.rating
        : null,

    status: appraisal.status || "Unknown",

    cycle: appraisal.cycle?.cycleName || "N/A",

    // Keep original record available
    appraisal,
  }));
}, [filteredAppraisals]);


/* =========================================================
   SUMMARY STATISTICS
========================================================= */

const stats = useMemo(() => {
  const total = employees.length;

  const completed = employees.filter(
    (employee) => employee.status === "Appraised"
  ).length;

  const awaiting = employees.filter(
    (employee) => employee.status === "Awaiting Appraisal"
  ).length;

  const scoredEmployees = employees.filter(
    (employee) =>
      typeof employee.finalScore === "number" &&
      employee.finalScore > 0
  );

  const average =
    scoredEmployees.length > 0
      ? scoredEmployees.reduce(
          (sum, employee) => sum + employee.finalScore,
          0
        ) / scoredEmployees.length
      : 0;

  return {
    total,
    completed,
    awaiting,
    average: average.toFixed(1),
  };
}, [employees]);


/* =========================================================
   FILTERS
========================================================= */

const filteredEmployees = useMemo(() => {
  return employees.filter((employee) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      employee.name.toLowerCase().includes(search) ||
      employee.id.toLowerCase().includes(search);

    const matchesDepartment =
      departmentFilter === "All" ||
      employee.department === departmentFilter;

    const matchesStatus =
      statusFilter === "All" ||
      employee.status === statusFilter;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesStatus
    );
  });
}, [
  employees,
  searchTerm,
  departmentFilter,
  statusFilter,
]);

const totalPages = Math.ceil(
  filteredEmployees.length / employeesPerPage
);

const paginatedEmployees = filteredEmployees.slice(
  (page - 1) * employeesPerPage,
  page * employeesPerPage
);

/* =========================================================
   DEPARTMENTS
========================================================= */

const departments = [
  "All",
  ...new Set(
    employees
      .map((employee) => employee.department)
      .filter((department) => department !== "N/A")
  ),
];


/* =========================================================
   STATUSES
========================================================= */

const statuses = [
  "All",
  "Appraised",
  "Awaiting Appraisal",
];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#11152D]">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-gray-200 bg-white">
        <div className="flex min-h-[88px] items-center justify-between gap-6 px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#11152D]">
              Performance Reports
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              View performance summary and detailed reports for all employees.
            </p>
          </div>

          <div className="flex items-center gap-5">
            {/* Appraisal Period */}

            <div className="hidden sm:block">
              <label className="mb-1.5 block text-[10px] font-semibold text-gray-700">
                Appraisal Period
              </label>

              <div className="relative">
                <CalendarDays
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="h-9 w-64 appearance-none rounded-lg border border-gray-200 bg-white pl-9 pr-9 text-xs font-medium text-gray-700 outline-none focus:border-[#4C2BCF] focus:ring-2 focus:ring-[#4C2BCF]/10"
                >
                  {appraisalPeriods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            {/* Notification */}

            <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100">
              <Bell size={19} className="text-gray-600" />

              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
                3
              </span>
            </button>

            {/* User */}

            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/100?img=32"
                alt="Mary Manager"
                className="h-9 w-9 rounded-full object-cover"
              />

              <div className="hidden md:block">
                <p className="text-xs font-semibold text-gray-800">
                  Mary Manager
                </p>
                <p className="text-[10px] text-gray-500">HR Manager</p>
              </div>

              <ChevronDown size={14} className="text-gray-500" />
            </div>
          </div>
        </div>
      </header>

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <main className="px-6 py-6 lg:px-8">
        {/* ================================================
            SUMMARY CARDS
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <StatCard
            title="Total Employees"
            value={stats.total}
            subtitle="For selected period"
            icon={Users}
            iconBg="bg-[#F2EFFF]"
            iconColor="text-[#4C2BCF]"
          />

         <StatCard
          title="Appraised"
          value={stats.completed}
          subtitle={
            stats.total > 0
              ? `${((stats.completed / stats.total) * 100).toFixed(1)}% of total`
              : "0% of total"
          }
          icon={CircleCheck}
          iconBg="bg-green-50"
          iconColor="text-green-500"
        />

          <StatCard
            title="Awaiting Appraisal"
            value={stats.awaiting}
            subtitle={
              stats.total > 0
                ? `${((stats.awaiting / stats.total) * 100).toFixed(1)}% of total`
                : "0% of total"
            }
            icon={Hourglass}
            iconBg="bg-amber-50"
            iconColor="text-amber-500"
          />

          <StatCard
          title="Average Performance"
          value={`${stats.average}/5`}
          subtitle="Average appraisal score"
          icon={SlidersHorizontal}
          iconBg="bg-[#F2EFFF]"
          iconColor="text-[#4C2BCF]"
        />
        </section>

        {/* ================================================
            TABS
        ================================================= */}

        <div className="mt-6 border-b border-gray-200">
          <div className="flex gap-8 overflow-x-auto">
            {["Overview", "Employee Performance", "Outstanding Appraisals"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative whitespace-nowrap pb-3 text-xs font-medium transition ${
                    activeTab === tab
                      ? "text-[#4C2BCF]"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab}

                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#4C2BCF]" />
                  )}
                </button>
              )
            )}
          </div>
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        {activeTab === "Overview" && (
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_295px]">
            {/* ============================================
                LEFT COLUMN
            ============================================ */}

            <div className="min-w-0">
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Table Header */}

                <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-[#11152D]">
                      Performance Summary
                    </h2>

                    <p className="mt-1 text-[11px] text-gray-500">
                      Overall performance of employees for the selected
                      appraisal period.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {/* Search */}

                    <div className="relative">
                      <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search employee..."
                        className="h-9 w-48 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs outline-none placeholder:text-gray-400 focus:border-[#4C2BCF] focus:ring-2 focus:ring-[#4C2BCF]/10"
                      />
                    </div>

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition ${
                        showFilters
                          ? "border-[#4C2BCF] bg-[#F5F2FF] text-[#4C2BCF]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Filter size={14} />
                      Filters
                    </button>
                  </div>
                </div>

                {/* Filters */}

                {showFilters && (
                  <div className="flex flex-wrap gap-3 border-b border-gray-100 bg-gray-50/50 p-4">
                    <div>
                      <label className="mb-1 block text-[10px] font-medium text-gray-500">
                        Department
                      </label>

                      <select
                        value={departmentFilter}
                        onChange={(e) =>
                          handleDepartmentChange(e.target.value)
                        }
                        className="h-8 rounded-md border border-gray-200 bg-white px-3 text-xs outline-none focus:border-[#4C2BCF]"
                      >
                        {departments.map((department) => (
                          <option key={department}>{department}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-medium text-gray-500">
                        Status
                      </label>

                      <select
                        value={statusFilter}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="h-8 rounded-md border border-gray-200 bg-white px-3 text-xs outline-none focus:border-[#4C2BCF]"
                      >
                        {statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        setDepartmentFilter("All");
                        setStatusFilter("All");
                        setSearchTerm("");
                        setPage(1);
                      }}
                      className="self-end text-xs font-medium text-[#4C2BCF] hover:underline"
                    >
                      Reset filters
                    </button>
                  </div>
                )}

                {/* =========================================
                    TABLE
                ========================================== */}

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500">
                          #
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500">
                          Employee
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500">
                          Department
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500">
                          Supervisor
                        </th>

                        <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500">
                          KPI Score
                        </th>

                        <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500">
                          Competency Score
                        </th>

                        <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500">
                          Final Score
                        </th>

                        <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500">
                          Rating
                        </th>

                        <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500">
                          Status
                        </th>

                        <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedEmployees.map((employee, index) => {
                        const statusConfig = getStatusConfig(employee.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                          <tr
                            key={employee.id}
                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                          >
                            <td className="px-4 py-3 text-[10px] text-gray-600">
                              {(page - 1) * employeesPerPage + index + 1}
                            </td>

                            {/* Employee */}

                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={employee.avatar}
                                  alt={employee.name}
                                  className="h-8 w-8 rounded-full object-cover"
                                />

                                <div>
                                  <p className="text-[11px] font-semibold text-gray-800">
                                    {employee.name}
                                  </p>

                                  <p className="text-[9px] text-gray-400">
                                    {employee.id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Department */}

                            <td className="px-4 py-3 text-[10px] text-gray-600">
                              {employee.department}
                            </td>

                            {/* Supervisor */}

                            <td className="px-4 py-3 text-[10px] text-gray-600">
                              {employee.supervisor}
                            </td>

                            {/* KPI */}

                            <td className="px-4 py-3 text-center text-[10px] font-medium text-gray-700">
                              {employee.kpiScore !== null
                                ? `${employee.kpiScore}%`
                                : "-"}
                            </td>

                            {/* Competency */}

                            <td className="px-4 py-3 text-center text-[10px] font-medium text-gray-700">
                              {employee.competencyScore !== null
                                ? `${employee.competencyScore}%`
                                : "-"}
                            </td>

                            {/* Final Score */}

                            <td className="px-4 py-3 text-center">
                              <span className="text-[11px] font-bold text-[#4C2BCF]">
                                {employee.finalScore !== null
                                  ? `${employee.finalScore}%`
                                  : "-"}
                              </span>
                            </td>

                            {/* Rating */}

                            <td className="px-4 py-3 text-center">
                              {employee.rating ? (
                                <span
                                  className={`inline-flex rounded-md px-2 py-1 text-[9px] font-medium ${getRatingClass(
                                    employee.rating
                                  )}`}
                                >
                                  {employee.rating}
                                </span>
                              ) : (
                                <span className="text-[10px] text-gray-400">
                                  -
                                </span>
                              )}
                            </td>

                            {/* Status */}

                            <td className="px-4 py-3">
                              <div
                                className={`mx-auto flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-medium ${statusConfig.className}`}
                              >
                                <StatusIcon
                                  size={11}
                                  className={statusConfig.iconClass}
                                />

                                <span className="whitespace-nowrap">
                                  {employee.status}
                                </span>
                              </div>
                            </td>

                            {/* Action */}

                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() =>
                                  handleViewEmployee(employee)
                                }
                                className="rounded-md border border-[#CFC7FF] px-3 py-1.5 text-[9px] font-medium text-[#4C2BCF] transition hover:bg-[#F5F2FF]"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {paginatedEmployees.length === 0 && (
                        <tr>
                          <td
                            colSpan="10"
                            className="px-4 py-12 text-center text-xs text-gray-400"
                          >
                            No employees found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* =========================================
                    PAGINATION
                ========================================== */}

                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                  <p className="text-[10px] text-gray-500">
                    Showing{" "}
                    {filteredEmployees.length === 0
                      ? 0
                      : (page - 1) * employeesPerPage + 1}{" "}
                    to{" "}
                    {Math.min(
                      page * employeesPerPage,
                      filteredEmployees.length
                    )}{" "}
                    of {filteredEmployees.length} employees
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50"
                    >
                      <ChevronLeft size={13} />
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-medium ${
                          page === pageNumber
                            ? "bg-[#4C2BCF] text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    <button
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-gray-50"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* ==========================================
                  ANALYTICS
              =========================================== */}

              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Performance Distribution */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-[#11152D]">
                    Performance Distribution
                  </h3>

                  <p className="mt-1 text-[11px] text-gray-500">
                    Distribution of employees by performance rating.
                  </p>

                  <div className="mt-6">
                    <PerformanceDonut />
                  </div>
                </div>

                {/* Department Performance */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-[#11152D]">
                    Department Performance
                  </h3>

                  <p className="mt-1 text-[11px] text-gray-500">
                    Average performance score by department.
                  </p>

                  <div className="mt-6">
                    <DepartmentPerformance />
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================
                RIGHT COLUMN
            ============================================ */}

            <aside className="space-y-5">
              <OutstandingAppraisals
                onViewAll={() => {
                  setActiveTab("Outstanding Appraisals");
                }}
              />

              <QuickActions />

              {/* Export button */}
            </aside>
          </div>
        )}

        {/* =================================================
            EMPLOYEE PERFORMANCE TAB
        ================================================= */}

        {activeTab === "Employee Performance" && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F2EFFF]">
                <Users size={20} className="text-[#4C2BCF]" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#11152D]">
                  Employee Performance
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Detailed employee performance analysis will be displayed
                  here.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            OUTSTANDING TAB
        ================================================= */}

        {activeTab === "Outstanding Appraisals" && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#11152D]">
                  Outstanding Appraisals
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Employees who have not completed their appraisal process.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("Overview")}
                className="text-xs font-medium text-[#4C2BCF] hover:underline"
              >
                Back to Overview
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-5">
                <Hourglass className="text-amber-500" size={20} />

                <p className="mt-3 text-xs text-gray-500">
                  Awaiting Self-Appraisal
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-800">12</p>
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-5">
                <UserCheck className="text-blue-500" size={20} />

                <p className="mt-3 text-xs text-gray-500">
                  Awaiting Supervisor
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-800">15</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                <Clock3 className="text-gray-500" size={20} />

                <p className="mt-3 text-xs text-gray-500">Not Started</p>

                <p className="mt-1 text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}