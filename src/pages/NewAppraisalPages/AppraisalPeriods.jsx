import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Archive,
  Pencil,
  MoreVertical,
  X,
  ChevronDown,
  ChevronUp,
  Trash2,
  Eye,
} from "lucide-react";
import { getAllCycles, getAllEmployee } from "../../utils/DyamicDashboard";
import { api } from "../../api/request";
import useToast from "../../utils/useToast";




/*
|--------------------------------------------------------------------------
| STATUS CONFIG
|--------------------------------------------------------------------------
*/

const statusConfig = {
  open: {
    label: "Open",
    className: "bg-green-50 text-green-600 border-green-100",
    dot: "bg-green-500",
  },

  closed: {
    label: "Closed",
    className: "bg-gray-100 text-gray-500 border-gray-200",
    dot: "bg-gray-400",
  },
};

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
*/

export default function AppraisalPeriods() {

  const [periods, setPeriods] = useState([]);
  const [employee, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [editingPeriod, setEditingPeriod] = useState(null);

  const [loading, setLoading] = useState(null);

  const [openMenu, setOpenMenu] = useState(null);
  
  const {showError, showSuccess} = useToast()
   useEffect(() => {
      const getDashboardData = async () => {
        try {
        setLoading(true)
          const [empData, cycleData] = await Promise.all([
            getAllEmployee(),
            getAllCycles(),
          ]);
          setEmployees(empData || []);
  
          const res = await api.get("/appraisal/appraisals");
          if (res.data.success) {
            setPeriods(res.data.appraisalCycle);
            console.log(res.data.appraisalCycle);
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
    }, [showError])

  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const emptyForm = {
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    periodType: "Annual Appraisal",
    eligibleEmployees: "All Employees",
    selfAppraisalStart: "",
    selfAppraisalLock: "",
    status: "Active",
  };

  const [form, setForm] = useState(emptyForm);

  const [advancedOpen, setAdvancedOpen] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  const totalPeriods = periods.length;

  const activePeriods = periods.filter(
  (period) => period.status === "open"
).length;

const completedPeriods = periods.filter(
  (period) => period.status === "closed"
).length;

  /*
  |--------------------------------------------------------------------------
  | FILTERED PERIODS
  |--------------------------------------------------------------------------
  */

  const filteredPeriods = useMemo(() => {
    return periods.filter((period) => {
      const matchesSearch = period.cycleName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || period.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [periods, search, statusFilter]);

  /*
  |--------------------------------------------------------------------------
  | OPEN CREATE DRAWER
  |--------------------------------------------------------------------------
  */

  const handleCreate = () => {
    setEditingPeriod(null);
    setForm(emptyForm);
    setAdvancedOpen(false);
    setDrawerOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN EDIT DRAWER
  |--------------------------------------------------------------------------
  */

const handleEdit = (period) => {
  setEditingPeriod(period);

  setForm({
    name: period.cycleName || "",
    startDate: period.startDate
      ? period.startDate.substring(0, 10)
      : "",
    endDate: period.endDate
      ? period.endDate.substring(0, 10)
      : "",
    description: period.description || "",
    periodType: period.periodType || "Annual Appraisal",
    eligibleEmployees: period.eligibleEmployees || "All Employees",
    selfAppraisalStart: period.selfAppraisalStart
      ? period.selfAppraisalStart.substring(0, 10)
      : "",
    selfAppraisalLock: period.selfAppraisalLock
      ? period.selfAppraisalLock.substring(0, 10)
      : "",
    status: period.status || "open",
  });

  setAdvancedOpen(false);
  setDrawerOpen(true);
  setOpenMenu(null);
};

  /*
  |--------------------------------------------------------------------------
  | FORM CHANGE
  |--------------------------------------------------------------------------
  */

  const today = new Date();

const upcomingPeriods = periods.filter(
  (period) =>
    new Date(period.startDate) > today &&
    period.status === "open"
).length;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE PERIOD
  |--------------------------------------------------------------------------
  */

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.name || !form.startDate || !form.endDate) {
      alert("Please complete all required fields.");
      return;
    }

    if (editingPeriod) {
      // Update existing period
      setPeriods((previous) =>
        previous.map((period) =>
          period._id === editingperiod._id
            ? {
                ...period,
                ...form,
              }
            : period
        )
      );
    } else {
      // Create new period
      const newPeriod = {
        id: `AP-${String(periods.length + 1).padStart(3, "0")}`,
        ...form,
        year: `Year ${new Date(form.startDate).getFullYear()}`,
        employees: 125,
        createdBy: {
          name: "Mary Manager",
          role: "HR Manager",
          avatar: "https://i.pravatar.cc/100?img=47",
        },
        createdAt: new Date().toISOString(),
      };

      setPeriods((previous) => [newPeriod, ...previous]);
    }

    setDrawerOpen(false);
    setEditingPeriod(null);
    setForm(emptyForm);
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appraisal period?"
    );

    if (!confirmed) return;

    setPeriods((previous) =>
      previous.filter((period) => period._id !== id)
    );

    setOpenMenu(null);
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE DRAWER
  |--------------------------------------------------------------------------
  */

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingPeriod(null);
    setForm(emptyForm);
  };

  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#111827]">
      {/* ================================================================
          MAIN CONTENT
      ================================================================ */}

      <div
        className={`transition-all duration-300 ${
          drawerOpen ? "mr-[440px]" : ""
        }`}
      >
        <div className="px-7 py-7">
          {/* ============================================================
              HEADER
          ============================================================ */}

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[27px] font-semibold tracking-[-0.5px]">
                Appraisal Periods
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage appraisal periods for your organization.
              </p>
            </div>

            <button
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-md bg-[#4b2bbd] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#4024a4]"
            >
              <Plus size={17} />
              Create New Period
            </button>
          </div>

          {/* ============================================================
              SUMMARY CARDS
          ============================================================ */}

          <div className="mt-7 grid grid-cols-4 gap-4">
            <SummaryCard
              icon={<CalendarDays size={23} />}
              iconClass="bg-purple-50 text-[#5430c8]"
              title="Total Periods"
              value={totalPeriods}
              subtitle="All time"
            />

            <SummaryCard
              icon={<CheckCircle2 size={23} />}
              iconClass="bg-green-50 text-green-500"
              title="Active Periods"
              value={activePeriods}
              subtitle="Currently active"
            />

            <SummaryCard
              icon={<Clock3 size={23} />}
              iconClass="bg-orange-50 text-orange-500"
              title="Upcoming Periods"
              value={upcomingPeriods}
              subtitle="Not started"
            />

            <SummaryCard
              icon={<Archive size={23} />}
              iconClass="bg-gray-100 text-gray-500"
              title="Completed Periods"
              value={completedPeriods}
              subtitle="Already closed"
            />
          </div>

          {/* ============================================================
              TABLE CONTAINER
          ============================================================ */}

          <div className="mt-7 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* ==========================================================
                SEARCH / FILTER
            ========================================================== */}

            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5">
              <div className="relative w-[240px]">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search period name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setStatusFilter(
                      statusFilter === "All"
                        ? "Active"
                        : statusFilter === "Active"
                        ? "Upcoming"
                        : statusFilter === "Upcoming"
                        ? "Completed"
                        : "All"
                    )
                  }
                  className="flex h-9 items-center gap-2 rounded-md border border-gray-200 px-3 text-sm font-medium text-[#4b2bbd] hover:bg-purple-50"
                >
                  <SlidersHorizontal size={16} />

                  Filters

                  {statusFilter !== "All" && (
                    <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px]">
                      {statusFilter}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* ==========================================================
                TABLE
            ========================================================== */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#fcfcfd] text-left">
                    <TableHeader>#</TableHeader>
                    <TableHeader>Period Name</TableHeader>
                    <TableHeader>Start Date</TableHeader>
                    <TableHeader>End Date</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Employees</TableHeader>
                    <TableHeader>Created By</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {filteredPeriods.map((period, index) => (
                    <tr
                      key={period._id}
                      className="border-b border-gray-100 transition hover:bg-gray-50/60"
                    >
                      <TableCell>
                        <span className="font-medium">
                          {index + 1}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {period.cycleName}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                             {formatDate(period.startDate)} - {formatDate(period.endDate)}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <DateCell date={formatDate(period.startDate)} />
                      </TableCell>

                      <TableCell>
                        <DateCell date={formatDate(period.endDate)} />
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={period.status} />
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {employee.length}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2.5">
                         {/* Image tag will go here */}

                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Hr Admin
                            </p>

                            <p className="text-xs text-gray-400">
                              "HR Manager"
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="relative flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(period)}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-[#5130c4] transition hover:border-purple-200 hover:bg-purple-50"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === period._id
                                  ? null
                                  : period._id
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-50"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {openMenu === period._id && (
                            <div className="absolute right-0 top-10 z-30 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                              <button
                                onClick={() => {
                                  setOpenMenu(null);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                              >
                                <Eye size={15} />
                                View
                              </button>

                              <button
                                onClick={() => handleEdit(period)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                              >
                                <Pencil size={15} />
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(period._id)
                                }
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                              >
                                <Trash2 size={15} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </tr>
                  ))}

                  {filteredPeriods.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-14 text-center"
                      >
                        <div className="flex flex-col items-center">
                          <CalendarDays
                            size={32}
                            className="text-gray-300"
                          />

                          <p className="mt-3 text-sm font-medium text-gray-600">
                            No appraisal periods found
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Try changing your search or filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ==========================================================
                TABLE FOOTER
            ========================================================== */}

            <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
              Showing {filteredPeriods.length} of {periods.length} periods
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          RIGHT DRAWER
      ================================================================ */}

      {drawerOpen && (
        <>
          {/* Overlay */}

          <div
            onClick={closeDrawer}
            className="fixed left-0 right-0 bottom-0 top-[78px] z-40 bg-black/10"
          />

          <aside className="fixed right-0 bottom-0 top-[80px] z-50 flex w-[440px] flex-col border-l border-gray-200 bg-white shadow-2xl">

  {/* ==========================================================
      DRAWER HEADER
  ========================================================== */}
  <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
    <div>
      <h2 className="text-[17px] font-semibold tracking-tight text-gray-900">
        {editingPeriod ? "Edit Appraisal Period" : "Create New Period"}
      </h2>

      <p className="mt-1 text-[11px] text-gray-400">
        Configure the appraisal period and its settings.
      </p>
    </div>

    <button
      type="button"
      onClick={closeDrawer}
      className="
        rounded-lg p-2
        text-gray-400
        transition
        hover:bg-gray-100
        hover:text-gray-700
      "
    >
      <X size={18} />
    </button>
  </div>


  {/* ==========================================================
      FORM
  ========================================================== */}
  <form
    onSubmit={handleSave}
    className="flex min-h-0 flex-1 flex-col"
  >

    {/* ========================================================
        FORM CONTENT
    ======================================================== */}
    <div className="flex-1 overflow-y-auto px-6 py-6">

      {/* ======================================================
          PERIOD NAME
      ====================================================== */}
      <div className="mb-6">
        <label className="mb-2 block text-[12px] font-semibold text-gray-700">
          Period Name
          <span className="ml-1 text-red-500">*</span>
        </label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Annual Appraisal 2026"
          className="
            h-11 w-full
            rounded-lg
            border border-gray-200
            bg-white
            px-3.5
            text-sm text-gray-800
            placeholder:text-gray-400
            shadow-sm
            outline-none
            transition-all duration-150
            hover:border-gray-300
            focus:border-[#4b2bbd]
            focus:ring-4 focus:ring-[#4b2bbd]/10
          "
        />

        <p className="mt-1.5 text-[11px] leading-4 text-gray-400">
          Give this appraisal period a unique name.
        </p>
      </div>


      {/* ======================================================
          DATES
      ====================================================== */}
      <div className="mb-6 grid grid-cols-2 gap-4">

        {/* START DATE */}
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-gray-700">
            Start Date
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="
              h-11 w-full
              rounded-lg
              border border-gray-200
              bg-white
              px-3
              text-sm text-gray-800
              shadow-sm
              outline-none
              transition-all duration-150
              hover:border-gray-300
              focus:border-[#4b2bbd]
              focus:ring-4 focus:ring-[#4b2bbd]/10
              cursor-pointer
            "
          />
        </div>


        {/* END DATE */}
        <div>
          <label className="mb-2 block text-[12px] font-semibold text-gray-700">
            End Date
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="
              h-11 w-full
              rounded-lg
              border border-gray-200
              bg-white
              px-3
              text-sm text-gray-800
              shadow-sm
              outline-none
              transition-all duration-150
              hover:border-gray-300
              focus:border-[#4b2bbd]
              focus:ring-4 focus:ring-[#4b2bbd]/10
              cursor-pointer
            "
          />
        </div>
      </div>

      <p className="-mt-3 mb-6 text-[11px] text-gray-400">
        The period during which appraisals will take place.
      </p>


      {/* ======================================================
          DESCRIPTION
      ====================================================== */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-[12px] font-semibold text-gray-700">
            Description
          </label>

          <span className="text-[10px] text-gray-400">
            {form.description.length}/255
          </span>
        </div>

        <div className="relative">
          <textarea
            name="description"
            value={form.description}
            maxLength={255}
            onChange={handleChange}
            rows={4}
            placeholder="Enter a description..."
            className="
              min-h-[110px] w-full
              resize-none
              rounded-lg
              border border-gray-200
              bg-white
              px-3.5 py-3
              pb-8
              text-sm text-gray-800
              leading-5
              placeholder:text-gray-400
              shadow-sm
              outline-none
              transition-all duration-150
              hover:border-gray-300
              focus:border-[#4b2bbd]
              focus:ring-4 focus:ring-[#4b2bbd]/10
            "
          />

          <span className="
            absolute bottom-2.5 right-3
            text-[10px] text-gray-400
          ">
            {form.description.length}/255
          </span>
        </div>
      </div>


      {/* ======================================================
          PERIOD TYPE
      ====================================================== */}
      <div className="mb-6">
        <label className="mb-2 block text-[12px] font-semibold text-gray-700">
          Period Type
          <span className="ml-1 text-red-500">*</span>
        </label>

        <div className="relative">
          <select
            name="periodType"
            value={form.periodType}
            onChange={handleChange}
            className="
              h-11 w-full
              appearance-none
              rounded-lg
              border border-gray-200
              bg-white
              px-3.5 pr-10
              text-sm text-gray-800
              shadow-sm
              outline-none
              transition-all duration-150
              hover:border-gray-300
              focus:border-[#4b2bbd]
              focus:ring-4 focus:ring-[#4b2bbd]/10
              cursor-pointer
            "
          >
            <option value="">Select period type</option>
            <option value="Annual Appraisal">Annual Appraisal</option>
            <option value="Mid Year Review">Mid Year Review</option>
            <option value="Probation Review">Probation Review</option>
            <option value="Quarterly Review">Quarterly Review</option>
            <option value="Performance Review">Performance Review</option>
          </select>

          <ChevronDown
            size={16}
            className="
              pointer-events-none
              absolute right-3 top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />
        </div>

        <p className="mt-1.5 text-[11px] text-gray-400">
          Select the type of appraisal.
        </p>
      </div>


      {/* ======================================================
          ELIGIBLE EMPLOYEES
      ====================================================== */}
      <div className="mb-6">
        <label className="mb-2 block text-[12px] font-semibold text-gray-700">
          Who Can Be Appraised
          <span className="ml-1 text-red-500">*</span>
        </label>

        <div className="relative">
          <select
            name="eligibleEmployees"
            value={form.eligibleEmployees}
            onChange={handleChange}
            className="
              h-11 w-full
              appearance-none
              rounded-lg
              border border-gray-200
              bg-white
              px-3.5 pr-10
              text-sm text-gray-800
              shadow-sm
              outline-none
              transition-all duration-150
              hover:border-gray-300
              focus:border-[#4b2bbd]
              focus:ring-4 focus:ring-[#4b2bbd]/10
              cursor-pointer
            "
          >
            <option value="">Select employees</option>
            <option value="All Employees">All Employees</option>
            <option value="Employees on Probation">
              Employees on Probation
            </option>
            <option value="Permanent Employees">
              Permanent Employees
            </option>
            <option value="Selected Employees">
              Selected Employees
            </option>
            <option value="Selected Departments">
              Selected Departments
            </option>
          </select>

          <ChevronDown
            size={16}
            className="
              pointer-events-none
              absolute right-3 top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />
        </div>

        <p className="mt-1.5 text-[11px] leading-4 text-gray-400">
          Select which employees are eligible for this appraisal.
        </p>
      </div>


      {/* ======================================================
          SELF APPRAISAL START
      ====================================================== */}
      <div className="mb-6">
        <label className="mb-2 block text-[12px] font-semibold text-gray-700">
          Allow Self-Appraisal From
          <span className="ml-1 text-red-500">*</span>
        </label>

        <input
          type="date"
          name="selfAppraisalStart"
          value={form.selfAppraisalStart}
          onChange={handleChange}
          className="
            h-11 w-full
            rounded-lg
            border border-gray-200
            bg-white
            px-3
            text-sm text-gray-800
            shadow-sm
            outline-none
            transition-all duration-150
            hover:border-gray-300
            focus:border-[#4b2bbd]
            focus:ring-4 focus:ring-[#4b2bbd]/10
            cursor-pointer
          "
        />

        <p className="mt-1.5 text-[11px] leading-4 text-gray-400">
          Date from which employees can start self-appraisal.
        </p>
      </div>


      {/* ======================================================
          LOCK DATE
      ====================================================== */}
      <div className="mb-6">
        <label className="mb-2 block text-[12px] font-semibold text-gray-700">
          Lock Self-Appraisal After
        </label>

        <input
          type="date"
          name="selfAppraisalLock"
          value={form.selfAppraisalLock}
          onChange={handleChange}
          className="
            h-11 w-full
            rounded-lg
            border border-gray-200
            bg-white
            px-3
            text-sm text-gray-800
            shadow-sm
            outline-none
            transition-all duration-150
            hover:border-gray-300
            focus:border-[#4b2bbd]
            focus:ring-4 focus:ring-[#4b2bbd]/10
            cursor-pointer
          "
        />

        <p className="mt-1.5 text-[11px] leading-4 text-gray-400">
          After this date, employees cannot edit self-appraisal.
        </p>
      </div>


      {/* ======================================================
          STATUS
      ====================================================== */}
      <div className="mb-6">

        <label className="mb-3 block text-[12px] font-semibold text-gray-700">
          Status
        </label>

        <button
          type="button"
          onClick={() =>
            setForm((previous) => ({
              ...previous,
              status:
                previous.status === "Active"
                  ? "Inactive"
                  : "Active",
            }))
          }
          className="
            flex w-full
            items-center justify-between
            rounded-lg
            border border-gray-200
            bg-white
            px-4 py-3
            text-left
            transition
            hover:border-gray-300
          "
        >
          <div>
            <p className="text-sm font-medium text-gray-800">
              {form.status === "Active" ? "Active" : "Inactive"}
            </p>

            <p className="mt-0.5 text-[10px] text-gray-400">
              {form.status === "Active"
                ? "This appraisal period is visible to users."
                : "This appraisal period is hidden from users."}
            </p>
          </div>

          {/* SWITCH */}
          <span
            className={`
              relative flex h-6 w-11 shrink-0
              items-center rounded-full p-1
              transition-colors duration-200
              ${
                form.status === "Active"
                  ? "bg-[#4b2bbd]"
                  : "bg-gray-300"
              }
            `}
          >
            <span
              className={`
                h-4 w-4 rounded-full
                bg-white shadow-sm
                transition-transform duration-200
                ${
                  form.status === "Active"
                    ? "translate-x-5"
                    : "translate-x-0"
                }
              `}
            />
          </span>
        </button>
      </div>


      {/* ======================================================
          ADVANCED SETTINGS
      ====================================================== */}
      <div className="overflow-hidden rounded-xl border border-gray-200">

        {/* HEADER */}
        <button
          type="button"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="
            flex w-full
            items-center justify-between
            px-4 py-4
            text-left
            transition
            hover:bg-gray-50
          "
        >
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Advanced Settings
            </p>

            <p className="mt-1 text-[11px] text-gray-400">
              Configure more options for this appraisal period.
            </p>
          </div>

          <span className="
            flex h-7 w-7 items-center justify-center
            rounded-md bg-gray-50
            text-gray-500
          ">
            {advancedOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </span>
        </button>


        {/* CONTENT */}
        {advancedOpen && (
          <div className="border-t border-gray-100 px-4 py-4">

            <div className="space-y-1">

              {/* REQUIRE SUPERVISOR REVIEW */}
              <label className="
                flex cursor-pointer
                items-center justify-between
                rounded-lg
                px-2 py-3
                transition
                hover:bg-gray-50
              ">
                <div className="pr-4">
                  <p className="text-xs font-medium text-gray-700">
                    Require supervisor review
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-gray-400">
                    Supervisor must review self-appraisal.
                  </p>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="
                    h-4 w-4
                    cursor-pointer
                    rounded
                    border-gray-300
                    text-[#4b2bbd]
                    accent-[#4b2bbd]
                    focus:ring-[#4b2bbd]
                  "
                />
              </label>


              {/* EMPLOYEE COMMENTS */}
              <label className="
                flex cursor-pointer
                items-center justify-between
                rounded-lg
                px-2 py-3
                transition
                hover:bg-gray-50
              ">
                <div className="pr-4">
                  <p className="text-xs font-medium text-gray-700">
                    Allow employee comments
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-gray-400">
                    Employees can add comments to their appraisal.
                  </p>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="
                    h-4 w-4
                    cursor-pointer
                    rounded
                    border-gray-300
                    text-[#4b2bbd]
                    accent-[#4b2bbd]
                    focus:ring-[#4b2bbd]
                  "
                />
              </label>


              {/* GOAL UPDATES */}
              <label className="
                flex cursor-pointer
                items-center justify-between
                rounded-lg
                px-2 py-3
                transition
                hover:bg-gray-50
              ">
                <div className="pr-4">
                  <p className="text-xs font-medium text-gray-700">
                    Allow goal updates
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-gray-400">
                    Employees can update goals during the cycle.
                  </p>
                </div>

                <input
                  type="checkbox"
                  className="
                    h-4 w-4
                    cursor-pointer
                    rounded
                    border-gray-300
                    text-[#4b2bbd]
                    accent-[#4b2bbd]
                    focus:ring-[#4b2bbd]
                  "
                />
              </label>

            </div>
          </div>
        )}
      </div>

    </div>


    {/* ========================================================
        DRAWER FOOTER
    ======================================================== */}
    <div className="
      flex shrink-0 items-center justify-end gap-3
      border-t border-gray-100
      bg-white
      px-6 py-4
    ">

      <button
        type="button"
        onClick={closeDrawer}
        className="
          h-10
          rounded-lg
          border border-gray-200
          bg-white
          px-5
          text-sm font-medium
          text-gray-600
          transition
          hover:bg-gray-50
          hover:text-gray-800
        "
      >
        Cancel
      </button>

      <button
        type="submit"
        className="
          h-10
          rounded-lg
          bg-[#4b2bbd]
          px-6
          text-sm font-medium
          text-white
          shadow-sm
          transition
          hover:bg-[#4024a4]
          focus:outline-none
          focus:ring-4 focus:ring-[#4b2bbd]/20
          active:scale-[0.98]
        "
      >
        {editingPeriod ? "Update Period" : "Save Period"}
      </button>

    </div>

  </form>
</aside>
        </>
      )}
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
  iconClass,
  title,
  value,
  subtitle,
}) {
  return (
    <div className="flex h-[118px] items-center gap-4 rounded-lg border border-gray-200 bg-white px-5 shadow-sm">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-500">{title}</p>

        <p className="mt-1 text-[25px] font-semibold leading-none">
          {value}
        </p>

        <p className="mt-1.5 text-[11px] text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| TABLE COMPONENTS
|--------------------------------------------------------------------------
*/

function TableHeader({ children }) {
  return (
    <th className="px-4 py-3 text-[11px] font-semibold text-gray-700">
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return (
    <td className="px-4 py-4 text-sm">
      {children}
    </td>
  );
}

/*
|--------------------------------------------------------------------------
| DATE CELL
|--------------------------------------------------------------------------
*/

function DateCell({ date }) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap text-xs text-gray-600">
      <CalendarDays size={14} className="text-gray-400" />
      {date}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }) {
  const config = statusConfig[status];

  if (!config) {
    return (
      <span className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
        {status || "Unknown"}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-[11px] font-medium ${config.className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
      />

      {config.label}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| FORM FIELD
|--------------------------------------------------------------------------
*/

function FormField({
  label,
  required,
  hint,
  children,
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-xs font-semibold text-gray-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 text-[11px] text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| DATE INPUT
|--------------------------------------------------------------------------
*/

function DateInput({ name, value, onChange }) {
  return (
    <div className="relative">
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="form-input pr-9"
      />

      <CalendarDays
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      />
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SELECT INPUT
|--------------------------------------------------------------------------
*/

function SelectInput({
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="form-input appearance-none pr-9"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      />
    </div>
  );
}