import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../Context/authContext";
import { api } from "../../api/request";
import { useNavigate } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| MOCK DATA
|--------------------------------------------------------------------------
| This should eventually come from:
|
| GET /api/appraisals/my-appraisals
|
| Keep the structure similar to what your backend will return.
*/

/*
|--------------------------------------------------------------------------
| STATUS CONFIGURATION
|--------------------------------------------------------------------------
*/

const statusConfig = {
  "Awaiting Appraisal": {
    label: "Awaiting Self-Appraisal",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border-amber-100",
    iconClass: "text-amber-500",
  },

  "Awaiting supervisor review": {
    label: "Awaiting Supervisor Review",
    icon: UserRound,
    className: "bg-blue-50 text-blue-700 border-blue-100",
    iconClass: "text-blue-500",
  },

  Appraised: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 border-green-100",
    iconClass: "text-green-600",
  },
};
/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  const value = new Date(date);

  return {
    date: value.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),

    time: value.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};



export default function MyAppraisals() {

  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [periodFilter, setPeriodFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

const { user } = useAuth();
const employeeId = user?._id;

useEffect(() => {
  const getAppraisals = async () => {
    if (!employeeId) return;

    try {
      setLoading(true);

      const res = await api.post("/appraisal/employeeKpis", {
        employeeId,
      });

      console.log("BACKEND RESPONSE:", res.data);

      if (res.data.success) {
        const normalizedAppraisals = (res.data.appraisals || []).map(
          (item) => {
            // Calculate KPI weight if your KPI objects contain weight
            const kpiWeight = (item.kpis || []).reduce(
              (total, kpi) => total + Number(kpi.weight || 0),
              0
            );

            return {
              // Keep the original backend ID
              id: item._id,

              // Convert backend "cycle" into frontend "appraisalPeriod"
              appraisalPeriod: {
                id: item.cycle?._id,
                name: item.cycle?.cycleName,
                startDate: item.cycle?.startDate,
                endDate: item.cycle?.endDate,
                status: item.cycle?.status,
              },

              // Employee
              employee: item.employee,

              // Supervisor
              supervisor: {
                name:
                  item.supervisor?.personal?.fullname ||
                  item.supervisor?.fullname ||
                  "Not Assigned",

                position:
                  item.supervisor?.job?.position ||
                  item.supervisor?.job?.jobTitle ||
                  item.supervisor?.position ||
                  "Supervisor",

                avatar:
                  item.supervisor?.personal?.profilePicture ||
                  item.supervisor?.personal?.avatar ||
                  item.supervisor?.avatar ||
                  null,
              },

              // KPI information
              kpis: item.kpis || [],
              kpiWeight,

              // Assessment
              overAllAssessment: item.overAllAssessment,

              // Status
              status: item.status,

              // Backend updatedAt -> frontend lastUpdated
              lastUpdated: item.updatedAt || item.createdAt,

              // Optional message for UI
              statusMessage: getStatusMessage(item.status),

              // Keep original backend response available
              raw: item,
            };
          }
        );

        console.log("NORMALIZED APPRAISALS:", normalizedAppraisals);

        setAppraisals(normalizedAppraisals);
      } else {
        setAppraisals([]);
      }
    } catch (error) {
      console.error("Failed to fetch appraisals:", error);
      setAppraisals([]);
    } finally {
      setLoading(false);
    }
  };

  getAppraisals();
}, [employeeId]);

  /*
  |--------------------------------------------------------------------------
  | Status Message
  |--------------------------------------------------------------------------
  */

  const getStatusMessage = (status) => {
  switch (status) {
    case "Awaiting Appraisal":
      return "Your appraisal is awaiting completion.";

    case "Awaiting Supervisor Appraisal":
      return "Waiting for your supervisor to complete the appraisal.";

    case "Completed":
      return "This appraisal has been completed.";

    default:
      return status || "Status unavailable";
  }
};

  /*
  |--------------------------------------------------------------------------
  | APPRAISAL PERIODS
  |--------------------------------------------------------------------------
  */
  const appraisalPeriods = useMemo(() => {
    const periods = appraisals.map((item) => item.appraisalPeriod);

    return Array.from(
      new Map(
        periods
          .filter((period) => period?.id)
          .map((period) => [period.id, period])
      ).values()
    );
  }, [appraisals]);

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredAppraisals = useMemo(() => {
  if (periodFilter === "ALL") {
    return appraisals;
  }

  return appraisals.filter(
    (item) => item.appraisalPeriod?.id === periodFilter
  );
}, [appraisals, periodFilter]);

  /*
  |--------------------------------------------------------------------------
  | SUMMARY COUNTS
  |--------------------------------------------------------------------------
  */

  const totalAppraisals = appraisals.length;

  const awaitingSelfAppraisal = appraisals.filter(
  (item) => item.status === "Awaiting Appraisal"
  ).length;

 const awaitingSupervisor = appraisals.filter(
  (item) => item.status === "Awaiting Supervisor Appraisal"
  ).length;

 const closedAppraisals = appraisals.filter(
  (item) => item.status === "Completed"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.ceil(
    filteredAppraisals.length / itemsPerPage
  );

  const paginatedAppraisals = filteredAppraisals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /*
  |--------------------------------------------------------------------------
  | ACTION
  |--------------------------------------------------------------------------
  */
 const navigate = useNavigate()
  const handleAction = (appraisal) => {
    if (appraisal.status === "Awaiting Appraisal") {
      // Future:
       navigate(`/appraisal-dashboard/my-appraisal/${appraisal.id}`);

      console.log("Start self appraisal:", appraisal.id);
      return;
    }

    if (appraisal.status === "AWAITING_SUPERVISOR_APPRAISAL") {
      // Future:
      // navigate(`/appraisals/${appraisal.id}`);

      console.log("View appraisal details:", appraisal.id);
      return;
    }

    if (appraisal.status === "CLOSED") {
      // Future:
      // navigate(`/appraisals/${appraisal.id}/summary`);

      console.log("View appraisal summary:", appraisal.id);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | ACTION BUTTON
  |--------------------------------------------------------------------------
  */

  const getActionLabel = (status) => {
  switch (status) {
    case "Awaiting Appraisal":
      return "Start Self-Appraisal";

    case "Awaiting Supervisor Appraisal":
      return "View Details";

    case "Completed":
      return "View Summary";

    default:
      return "View";
  }
};

  return (
    <div className="min-h-screen bg-[#fafaff] px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-[1400px]">

        {/* ==============================================================
            HEADER
        ============================================================== */}

        <div className="mb-8">
          <h1 className="text-[30px] font-bold tracking-tight text-[#101936]">
            My Appraisals
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            View all your appraisal cycles and their current status.
          </p>
        </div>

        {/* ==============================================================
            SUMMARY CARDS
        ============================================================== */}

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {/* Total */}
          <SummaryCard
            icon={<CalendarDays size={25} />}
            title="Total Appraisals"
            value={totalAppraisals}
            iconWrapper="bg-purple-50 text-purple-600"
          />

          {/* Self appraisal */}
          <SummaryCard
            icon={<Clock3 size={25} />}
            title="Awaiting Self-Appraisal"
            value={awaitingSelfAppraisal}
            iconWrapper="bg-amber-50 text-amber-500"
          />

          {/* Supervisor */}
          <SummaryCard
            icon={<UserRound size={25} />}
            title="Awaiting Supervisor Appraisal"
            value={awaitingSupervisor}
            iconWrapper="bg-blue-50 text-blue-500"
          />

          {/* Closed */}
          <SummaryCard
            icon={<CheckCircle2 size={25} />}
            title="Closed"
            value={closedAppraisals}
            iconWrapper="bg-green-50 text-green-600"
          />

          {/* Filter */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <label className="mb-2 block text-xs font-semibold text-slate-700">
              Appraisal Period
            </label>

            <div className="flex gap-2">

              <select
                value={periodFilter}
                onChange={(e) => {
                  setPeriodFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              >
                <option value="ALL">All</option>

                {appraisalPeriods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-200 text-purple-600 transition hover:bg-purple-50"
              >
                <Filter size={17} />
              </button>

            </div>
          </div>
        </div>

        {/* ==============================================================
            TABLE
        ============================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">

                  <th className="w-[60px] px-6 py-5 text-left text-xs font-bold text-slate-700">
                    #
                  </th>

                  <th className="px-4 py-5 text-left text-xs font-bold text-slate-700">
                    Appraisal Period
                  </th>

                  <th className="px-4 py-5 text-left text-xs font-bold text-slate-700">
                    Supervisor
                  </th>

                  <th className="px-4 py-5 text-left text-xs font-bold text-slate-700">
                    KPI Weight
                  </th>

                  <th className="px-4 py-5 text-left text-xs font-bold text-slate-700">
                    Status
                  </th>

                  <th className="px-4 py-5 text-left text-xs font-bold text-slate-700">
                    Last Updated
                  </th>

                  <th className="px-4 py-5 text-left text-xs font-bold text-slate-700">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <LoadingRows />
                ) : paginatedAppraisals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-sm text-slate-500"
                    >
                      No appraisal records found.
                    </td>
                  </tr>
                ) : (
                  paginatedAppraisals.map((appraisal, index) => (
                    <AppraisalRow
                      key={appraisal.id}
                      appraisal={appraisal}
                      index={
                        (currentPage - 1) * itemsPerPage + index + 1
                      }
                      onAction={handleAction}
                      actionLabel={getActionLabel(appraisal.status)}
                    />
                  ))
                )}

              </tbody>

            </table>
          </div>

          {/* ============================================================
              FOOTER / PAGINATION
          ============================================================ */}

          <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {filteredAppraisals.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-700">
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredAppraisals.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {filteredAppraisals.length}
              </span>{" "}
              appraisals
            </p>

            <div className="flex items-center gap-2">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
              </button>

              {Array.from(
                { length: Math.max(totalPages, 1) },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                    currentPage === page
                      ? "bg-[#4930b8] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={
                  currentPage === totalPages || totalPages === 0
                }
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={17} />
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SUMMARY CARD
|--------------------------------------------------------------------------
*/

function SummaryCard({
  icon,
  title,
  value,
  iconWrapper,
}) {
  return (
    <div className="flex min-h-[122px] items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${iconWrapper}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium leading-5 text-slate-600">
          {title}
        </p>

        <p className="mt-1 text-3xl font-bold text-[#101936]">
          {value}
        </p>
      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| TABLE ROW
|--------------------------------------------------------------------------
*/

function AppraisalRow({
  appraisal,
  index,
  onAction,
  actionLabel,
}) {
  const status = statusConfig[appraisal.status];

  const StatusIcon = status.icon;

  const updated = formatDateTime(appraisal.lastUpdated);

  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">

      {/* Number */}
      <td className="px-6 py-6 align-middle">
        <span className="text-sm font-medium text-[#101936]">
          {index}
        </span>
      </td>

      {/* Appraisal Period */}
      <td className="px-4 py-6 align-middle">

        <div>
          <p className="text-sm font-semibold text-[#101936]">
            {appraisal.appraisalPeriod.name}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {formatDate(appraisal.appraisalPeriod.startDate)}{" "}
            –{" "}
            {formatDate(appraisal.appraisalPeriod.endDate)}
          </p>
        </div>

      </td>

      {/* Supervisor */}
      <td className="px-4 py-6 align-middle">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-100">

            {appraisal.supervisor.avatar ? (
              <img
                src={appraisal.supervisor.avatar}
                alt={appraisal.supervisor.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <UserRound
                size={18}
                className="text-purple-600"
              />
            )}

          </div>

          <div>
            <p className="text-sm font-semibold text-[#101936]">
              {appraisal.supervisor.name}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {appraisal.supervisor.position}
            </p>
          </div>

        </div>

      </td>

      {/* KPI Weight */}
      <td className="px-4 py-6 align-middle">
        <span className="text-sm font-medium text-[#101936]">
          {appraisal.kpiWeight}%
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-6 align-middle">

        <div
          className={`inline-flex min-w-[215px] flex-col rounded-lg border px-3 py-2.5 ${status.className}`}
        >

          <div className="flex items-center gap-2">

            <StatusIcon
              size={17}
              className={status.iconClass}
            />

            <span className="text-xs font-semibold">
              {status.label}
            </span>

          </div>

          <p className="mt-1 pl-6 text-xs opacity-80">
            {appraisal.statusMessage}
          </p>

        </div>

      </td>

      {/* Last Updated */}
      <td className="px-4 py-6 align-middle">

        <div className="text-sm text-[#101936]">
          {updated.date}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          {updated.time}
        </div>

      </td>

      {/* Action */}
      <td className="px-4 py-6 align-middle">

        <div className="flex items-center gap-3">

          <button
            onClick={() => onAction(appraisal)}
            className={`whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              appraisal.status === "AWAITING_SELF_APPRAISAL"
                ? "border-transparent bg-[#4930b8] text-white hover:bg-[#39249b]"
                : "border-purple-300 text-[#4930b8] hover:bg-purple-50"
            }`}
          >
            {actionLabel}
          </button>

          <button
            onClick={() => onAction(appraisal)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <ChevronRight size={17} />
          </button>

        </div>

      </td>

    </tr>
  );
}

/*
|--------------------------------------------------------------------------
| LOADING ROWS
|--------------------------------------------------------------------------
*/

function LoadingRows() {
  return Array.from({ length: 6 }).map((_, index) => (
    <tr key={index} className="border-b border-slate-100">

      {Array.from({ length: 7 }).map((_, cell) => (
        <td key={cell} className="px-4 py-7">

          <div className="h-4 animate-pulse rounded bg-slate-100" />

        </td>
      ))}

    </tr>
  ));
}