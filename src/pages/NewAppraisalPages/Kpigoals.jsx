import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Calendar,
  ChevronRight,
  ChevronDown,
  Bell,
  Plus,
  BookOpen,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  MousePointerClick,
  GraduationCap,
  FileText,
  Settings,
  LogOut,
  Pencil,
  Trash2,
  Lightbulb,
  CheckCircle2,
  X,
  Edit3,
  FileCheck2,
  Info,
} from "lucide-react";
import useToast from "../../utils/useToast";
import { api } from "../../api/request";
import { useAuth } from "../../Context/authContext";



const mockEmployee = {
  id: "EMP-001",
  name: "John Doe",
  position: "Senior Associate",
  avatar:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
};
 

const initialKPIs = [];



const emptyForm = {
  name: "",
  metric: "",
  description: "",
  target: "",
  weight: 20,
  dueDate: "2026-12-31",
  frequency: "Quarterly",
  evidenceSource: "",
};

/*
|--------------------------------------------------------------------------
| ICON HELPER
|--------------------------------------------------------------------------
*/

function Icon({ children, size = 20, strokeWidth = 2 }) {
  return React.cloneElement(children, {
    size,
    strokeWidth,
  });
}

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }) {
  const styles = {
    "On Track": "bg-green-100 text-green-700",
    "At Risk": "bg-yellow-100 text-yellow-700",
    Completed: "bg-blue-100 text-blue-700",
    "Not Started": "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-bold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| SIDEBAR ITEM
|--------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
| CREATE / EDIT KPI MODAL
|--------------------------------------------------------------------------
*/

function KPIFormModal({
  isOpen,
  onClose,
  onSave,
  existingKPIs,
  editingKPI,
}) {
  const isEditing = Boolean(editingKPI);

  const [kpiType, setKpiType] = useState("custom");
  const [formData, setFormData] = useState(emptyForm);
  const [selectedRoleKPI, setSelectedRoleKPI] = useState("");
  const [errors, setErrors] = useState({});

  /*
  |--------------------------------------------------------------------------
  | Populate form when editing
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen) return;

    if (editingKPI) {
      setKpiType(editingKPI.type || "custom");

      setFormData({
        name: editingKPI.title || "",
        metric: editingKPI.metric || "",
        description: editingKPI.description || "",
        target: editingKPI.target || "",
        weight: editingKPI.weight ?? 20,
        dueDate: editingKPI.dueDate || "2026-12-31",
        frequency: editingKPI.frequency || "Quarterly",
        evidenceSource: editingKPI.evidenceSource || "",
      });

      setSelectedRoleKPI("");
    } else {
      setKpiType("custom");
      setFormData(emptyForm);
      setSelectedRoleKPI("");
    }

    setErrors({});
  }, [isOpen, editingKPI]);

  if (!isOpen) return null;

  /*
  |--------------------------------------------------------------------------
  | EXISTING WEIGHT
  |--------------------------------------------------------------------------
  | When editing, exclude the current KPI's weight.
  |
  | Example:
  |
  | Existing total = 100%
  | Current KPI = 20%
  | New weight = 15%
  |
  | Effective total = 100 - 20 + 15 = 95%
  |--------------------------------------------------------------------------
  */

  const existingWeightExcludingCurrent = existingKPIs.reduce(
    (total, kpi) => {
      if (isEditing && kpi.id === editingKPI.id) {
        return total;
      }

      return total + Number(kpi.weight || 0);
    },
    0
  );

  const newWeight = Number(formData.weight || 0);

  const projectedWeight =
    existingWeightExcludingCurrent + newWeight;

  /*
  |--------------------------------------------------------------------------
  | FORM CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
      general: "",
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | KPI TYPE
  |--------------------------------------------------------------------------
  */

  const handleTypeChange = (type) => {
    setKpiType(type);

    setErrors({});

    if (type === "custom") {
      setSelectedRoleKPI("");

      /*
      | If editing and switching to custom, keep the current
      | KPI information instead of wiping it.
      */

      if (!isEditing) {
        setFormData(emptyForm);
      }
    }
  };

  /*
  |--------------------------------------------------------------------------
  | ROLE KPI SELECTION
  |--------------------------------------------------------------------------
  */

  const handleRoleKPISelect = (e) => {
    const id = e.target.value;

    setSelectedRoleKPI(id);

    const selected = roleKPIs.find(
      (kpi) => kpi.id === id
    );

    if (!selected) return;

    setFormData({
      name: selected.title,
      metric: selected.metric,
      description: selected.description,
      target: selected.target,
      weight: selected.suggestedWeight,
      dueDate: "2026-12-31",
      frequency: selected.frequency,
      evidenceSource: selected.evidenceSource,
    });

    setErrors({});
  };

  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "KPI name is required.";
    }

    if (!formData.metric.trim()) {
      newErrors.metric = "Measure / Metric is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Description is required.";
    }

    if (!formData.target.trim()) {
      newErrors.target = "Target is required.";
    }

    if (
      formData.weight === "" ||
      formData.weight === null ||
      formData.weight === undefined
    ) {
      newErrors.weight = "Weight is required.";
    }

    if (Number(formData.weight) <= 0) {
      newErrors.weight =
        "Weight must be greater than 0%.";
    }

    if (Number(formData.weight) > 100) {
      newErrors.weight =
        "Weight cannot exceed 100%.";
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT WEIGHT VALIDATION
    |--------------------------------------------------------------------------
    */

    if (projectedWeight > 100) {
      newErrors.weight = `This KPI would make the total weight ${projectedWeight}%. Maximum allowed is 100%.`;
    }

    if (!formData.dueDate) {
      newErrors.dueDate =
        "Due date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const kpiData = {
      title: formData.name.trim(),
      description: formData.description.trim(),
      metric: formData.metric.trim(),
      target: formData.target.trim(),
      weight: Number(formData.weight),
      dueDate: formData.dueDate,
      frequency: formData.frequency,
      evidenceSource:
        formData.evidenceSource.trim(),
      type: kpiType,
    };

    /*
    | Parent decides whether this is CREATE or UPDATE.
    */

    onSave(kpiData);
  };

  /*
  |--------------------------------------------------------------------------
  | DATE DISPLAY
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | MODAL
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2e3132]/40 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-[#cac4d4]/30 bg-white shadow-2xl">
        {/* ==============================================================
            HEADER
        ============================================================== */}

        <div className="flex shrink-0 items-start justify-between border-b border-[#e7e8e9] bg-white px-8 py-6">
          <div>
            <h2 className="mb-1 text-2xl font-bold text-[#191c1d]">
              {isEditing
                ? "Edit KPI"
                : "Create New KPI"}
            </h2>

            <p className="text-[13px] text-[#484552]">
              {isEditing
                ? "Update the KPI details and save your changes."
                : "Define a measurable target that aligns with your role and the firm's objectives."}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-2 text-[#484552] transition hover:bg-[#e7e8e9] hover:text-[#191c1d]"
          >
            <X size={21} />
          </button>
        </div>

        {/* ==============================================================
            BODY
        ============================================================== */}

        <div className="flex-grow overflow-y-auto p-8">
          <form
            id="kpi-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* ==========================================================
                KPI TYPE
            ========================================================== */}

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#191c1d]">
                KPI Type
              </label>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* CUSTOM */}
                <button
                  type="button"
                  onClick={() =>
                    handleTypeChange("custom")
                  }
                  className={`relative flex items-start rounded-lg p-4 text-left transition-all ${
                    kpiType === "custom"
                      ? "border-2 border-[#38188c] bg-[#e7deff]/20"
                      : "border border-[#cac4d4] bg-white hover:border-[#797584]"
                  }`}
                >
                  <div className="mr-3 mt-0.5">
                    <input
                      type="radio"
                      checked={kpiType === "custom"}
                      onChange={() =>
                        handleTypeChange(
                          "custom"
                        )
                      }
                      className="h-4 w-4 accent-[#38188c]"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#38188c] shadow-sm">
                      <Edit3 size={20} />
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-[#191c1d]">
                        Create Custom KPI
                      </span>

                      <span className="mt-0.5 block text-[13px] text-[#484552]">
                        Create a KPI from scratch
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* ==========================================================
                ROLE KPI SELECT
            ========================================================== */}

            {kpiType === "role" && (
              <div className="rounded-lg border border-[#cac4d4] bg-[#f8f9fa] p-4">
                <label className="mb-2 block text-xs font-semibold text-[#191c1d]">
                  Select Recommended KPI
                </label>

                <div className="relative">
                  <select
                    value={selectedRoleKPI}
                    onChange={
                      handleRoleKPISelect
                    }
                    className="block w-full appearance-none rounded-md border border-[#cac4d4] bg-white px-3 py-2.5 pr-10 text-sm text-[#191c1d] outline-none focus:border-[#38188c] focus:ring-1 focus:ring-[#38188c]"
                  >
                    <option value="">
                      Select a role KPI...
                    </option>

                    {roleKPIs.map((kpi) => (
                      <option
                        key={kpi.id}
                        value={kpi.id}
                      >
                        {kpi.title}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#484552]"
                  />
                </div>
              </div>
            )}

            {/* ==========================================================
                KPI NAME + METRIC
            ========================================================== */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* NAME */}
              <div className="space-y-1">
                <label
                  htmlFor="kpi_name"
                  className="block text-xs font-semibold text-[#191c1d]"
                >
                  KPI Name{" "}
                  <span className="text-[#ba1a1a]">
                    *
                  </span>
                </label>

                <input
                  id="kpi_name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    handleChange(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Client Retention Rate"
                  className={`block w-full rounded-md border bg-white px-3 py-2.5 text-sm text-[#191c1d] outline-none placeholder:text-[#484552]/50 focus:border-[#38188c] focus:ring-1 focus:ring-[#38188c] ${
                    errors.name
                      ? "border-[#ba1a1a]"
                      : "border-[#cac4d4]"
                  }`}
                />

                {errors.name && (
                  <p className="text-xs text-[#ba1a1a]">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* METRIC */}
              <div className="space-y-1">
                <label
                  htmlFor="kpi_metric"
                  className="block text-xs font-semibold text-[#191c1d]"
                >
                  Measure / Metric{" "}
                  <span className="text-[#ba1a1a]">
                    *
                  </span>
                </label>

                <input
                  id="kpi_metric"
                  type="text"
                  value={formData.metric}
                  onChange={(e) =>
                    handleChange(
                      "metric",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Percentage of retained clients"
                  className={`block w-full rounded-md border bg-white px-3 py-2.5 text-sm text-[#191c1d] outline-none placeholder:text-[#484552]/50 focus:border-[#38188c] focus:ring-1 focus:ring-[#38188c] ${
                    errors.metric
                      ? "border-[#ba1a1a]"
                      : "border-[#cac4d4]"
                  }`}
                />

                {errors.metric ? (
                  <p className="text-xs text-[#ba1a1a]">
                    {errors.metric}
                  </p>
                ) : (
                  <p className="text-[13px] text-[#484552]/70">
                    What will be measured and how?
                  </p>
                )}
              </div>
            </div>

            {/* ==========================================================
                DESCRIPTION + TARGET
            ========================================================== */}

            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
              {/* DESCRIPTION */}
              <div className="space-y-1">
                <label
                  htmlFor="kpi_desc"
                  className="block text-xs font-semibold text-[#191c1d]"
                >
                  Description{" "}
                  <span className="text-[#ba1a1a]">
                    *
                  </span>
                </label>

                <div className="relative">
                  <textarea
                    id="kpi_desc"
                    rows={4}
                    maxLength={250}
                    value={formData.description}
                    onChange={(e) =>
                      handleChange(
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Briefly describe what is expected and how this KPI contributes to the firm's objectives."
                    className={`block w-full resize-none rounded-md border bg-white px-3 py-2.5 pb-7 text-sm text-[#191c1d] outline-none placeholder:text-[#484552]/50 focus:border-[#38188c] focus:ring-1 focus:ring-[#38188c] ${
                      errors.description
                        ? "border-[#ba1a1a]"
                        : "border-[#cac4d4]"
                    }`}
                  />

                  <div className="absolute bottom-2 right-3 text-[11px] text-[#484552]/50">
                    {formData.description.length}/250
                  </div>
                </div>

                {errors.description && (
                  <p className="text-xs text-[#ba1a1a]">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* TARGET */}
              <div className="space-y-1">
                <label
                  htmlFor="kpi_target"
                  className="block text-xs font-semibold text-[#191c1d]"
                >
                  Target{" "}
                  <span className="text-[#ba1a1a]">
                    *
                  </span>
                </label>

                <input
                  id="kpi_target"
                  type="text"
                  value={formData.target}
                  onChange={(e) =>
                    handleChange(
                      "target",
                      e.target.value
                    )
                  }
                  placeholder="e.g. ≥ 85% or 100 cases"
                  className={`block w-full rounded-md border bg-white px-3 py-2.5 text-sm text-[#191c1d] outline-none placeholder:text-[#484552]/50 focus:border-[#38188c] focus:ring-1 focus:ring-[#38188c] ${
                    errors.target
                      ? "border-[#ba1a1a]"
                      : "border-[#cac4d4]"
                  }`}
                />

                {errors.target ? (
                  <p className="text-xs text-[#ba1a1a]">
                    {errors.target}
                  </p>
                ) : (
                  <p className="text-[13px] text-[#484552]/70">
                    Set a clear and achievable target.
                  </p>
                )}
              </div>
            </div>

            {/* ==========================================================
                WEIGHT / DUE DATE / FREQUENCY
            ========================================================== */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* WEIGHT */}
              <div className="space-y-1">
                <label
                  htmlFor="kpi_weight"
                  className="block text-xs font-semibold text-[#191c1d]"
                >
                  Weight (%){" "}
                  <span className="text-[#ba1a1a]">
                    *
                  </span>
                </label>

                <div className="relative flex">
                  <input
                    id="kpi_weight"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.weight}
                    onChange={(e) =>
                      handleChange(
                        "weight",
                        e.target.value
                      )
                    }
                    className={`block w-full rounded-md border bg-white px-3 py-2.5 pr-10 text-sm text-[#191c1d] outline-none focus:border-[#38188c] focus:ring-1 focus:ring-[#38188c] ${
                      errors.weight
                        ? "border-[#ba1a1a]"
                        : "border-[#cac4d4]"
                    }`}
                  />

                  <div className="absolute inset-y-0 right-0 flex items-center border-l border-[#cac4d4] bg-white px-2">
                    <span className="text-sm text-[#484552]">
                      %
                    </span>
                  </div>
                </div>

                <p
                  className={`text-[12px] ${
                    errors.weight
                      ? "text-[#ba1a1a]"
                      : "text-[#484552]/70"
                  }`}
                >
                  {errors.weight ||
                    `Current other KPIs: ${existingWeightExcludingCurrent}%. New total: ${projectedWeight}%.`}
                </p>
              </div>

              {/* DUE DATE */}
              <div className="space-y-1">
                <label
                  htmlFor="kpi_due"
                  className="block text-xs font-semibold text-[#191c1d]"
                >
                  Due Date{" "}
                  <span className="text-[#ba1a1a]">
                    *
                  </span>
                </label>

                <div className="relative">
                  <Calendar
                    size={19}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#484552]"
                  />

                  <input
                    id="kpi_due"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      handleChange(
                        "dueDate",
                        e.target.value
                      )
                    }
                    className={`block w-full rounded-md border bg-white py-2.5 pl-10 pr-3 text-sm text-[#191c1d] outline-none focus:border-[#38188c] focus:ring-1 focus:ring-[#38188c] ${
                      errors.dueDate
                        ? "border-[#ba1a1a]"
                        : "border-[#cac4d4]"
                    }`}
                  />
                </div>

                {errors.dueDate ? (
                  <p className="text-xs text-[#ba1a1a]">
                    {errors.dueDate}
                  </p>
                ) : (
                  <p className="text-[13px] text-[#484552]/70">
                    {formatDate(
                      formData.dueDate
                    )}
                  </p>
                )}
              </div>

              {/* FREQUENCY */}
              <div className="space-y-1">
                <label
                  htmlFor="kpi_freq"
                  className="block text-xs font-semibold text-[#191c1d]"
                >
                  Frequency
                </label>

                <div className="relative">
                  <select
                    id="kpi_freq"
                    value={formData.frequency}
                    onChange={(e) =>
                      handleChange(
                        "frequency",
                        e.target.value
                      )
                    }
                    className="block w-full appearance-none rounded-md border border-[#cac4d4] bg-white px-3 py-2.5 pr-10 text-sm text-[#191c1d] outline-none focus:border-[#38188c] focus:ring-1 focus:ring-[#38188c]"
                  >
                    <option>
                      Quarterly
                    </option>

                    <option>
                      Monthly
                    </option>

                    <option>
                      Annually
                    </option>
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#484552]"
                  />
                </div>

                <p className="text-[13px] text-[#484552]/70">
                  How often will this be reviewed?
                </p>
              </div>
            </div>

            {/* ==========================================================
                EVIDENCE SOURCE
            ========================================================== */}

            <div className="space-y-1">
              <label
                htmlFor="kpi_evidence"
                className="flex items-center gap-1 text-xs font-semibold text-[#191c1d]"
              >
                Evidence / Measurement Source

                <span className="font-normal text-[#484552]">
                  (Optional)
                </span>
              </label>

              <input
                id="kpi_evidence"
                type="text"
                value={formData.evidenceSource}
                onChange={(e) =>
                  handleChange(
                    "evidenceSource",
                    e.target.value
                  )
                }
                placeholder="e.g. CRM reports, time tracking system, billing records, case management system"
                className="block w-full rounded-md border border-[#cac4d4] bg-white px-3 py-2.5 text-sm text-[#191c1d] outline-none placeholder:text-[#484552]/50 focus:border-[#38188c] focus:ring-1 focus:ring-[#38188c]"
              />

              <p className="text-[13px] text-[#484552]/70">
                Where will the result be measured from?
              </p>
            </div>

            {/* ==========================================================
                INFO
            ========================================================== */}

            <div className="flex items-start gap-3 rounded-lg border border-[#38188c]/20 bg-[#e7deff]/20 p-4">
              <Info
                size={20}
                className="mt-0.5 shrink-0 text-[#38188c]"
              />

              <div>
                <h4 className="mb-0.5 text-xs font-semibold text-[#191c1d]">
                  Please note
                </h4>

                <p className="text-[13px] text-[#484552]">
                  Your manager will review and approve
                  these KPIs. You can edit them until
                  approval.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* ==============================================================
            FOOTER
        ============================================================== */}

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#e7e8e9] bg-white px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#cac4d4] bg-white px-5 py-2.5 text-xs font-semibold text-[#191c1d] shadow-sm transition hover:bg-[#e7e8e9]"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="kpi-form"
            className="flex items-center gap-2 rounded-md bg-[#38188c] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#4f35a3]"
          >
            {isEditing ? (
              <>
                <CheckCircle2 size={18} />
                Save Changes
              </>
            ) : (
              <>
                <Plus size={19} />
                Add KPI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| MAIN KPI GOALS PAGE
|--------------------------------------------------------------------------
*/

export default function KpiGoals() {
  const {showError, showSuccess} = useToast()
  const [activeTab, setActiveTab] = useState("my-kpis");

  const [kpis, setKpis] = useState(initialKPIs);

  const [appraisalPeriod, setAppraisalPeriod] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [appraisalCycleId, setAppraisalCycleId] = useState("");
  const [supervisorId, setSupervisorId] = useState("");

  const [loadingPeriods, setLoadingPeriods] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const { user } = useAuth();
  const employeeId = user?._id;
  /*
  |--------------------------------------------------------------------------
  | Modal State
  |--------------------------------------------------------------------------
  */

   const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);

    const [editingKPI, setEditingKPI] = useState(null);


    const [isSubmitting, setIsSubmitting] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | CALCULATED VALUES
  |--------------------------------------------------------------------------
  */
  
 useEffect(() => {
     const getEmployee = async () => {
       try {
         const res = await api.get("/employee");
         res.data.success
           ? (setEmployees(res.data.employees), console.log(res.data))
           : (showError(res.data.message), console.log(res.data));
       } catch (error) {
         showError(error.response?.data?.message || "Something went wrong");
       }
     };
     getEmployee();
   }, []);
  
 useEffect(() => {
  const getAppraisals = async () => {
    try {
      setLoadingPeriods(true);

      const res = await api.get("/appraisal/appraisals");

      if (res.data.success) {
        setAppraisalPeriod(res.data.appraisalCycle);
        console.log(res.data)
      } else {
        showError(res.data.message);
        console.log(res.data)
      }
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Unable to fetch appraisal periods"
      );
    } finally {
      setLoadingPeriods(false);
    }
  };

  getAppraisals();
}, []);

  const totalWeight = useMemo(() => {
    return kpis.reduce(
      (total, kpi) =>
        total + Number(kpi.weight || 0),
      0
    );
  }, [kpis]);

  const totalKPIs = kpis.length;

  /*
  |--------------------------------------------------------------------------
  | OPEN CREATE MODAL
  |--------------------------------------------------------------------------
  */

  const handleAddKPI = () => {
    setEditingKPI(null);
    setIsKpiModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN EDIT MODAL
  |--------------------------------------------------------------------------
  */
 const handleSubmitKPIs = async () => {
  
  if (!appraisalCycleId) {
    alert("Please select an appraisal period.");
    return;
  }

  if (!supervisorId) {
    alert("Please select a supervisor.");
    return;
  }

  if (kpis.length === 0) {
    alert("Please add at least one KPI.");
    return;
  }

  if (totalWeight !== 100) {
    alert(
      `KPI weights must total 100%. Current total is ${totalWeight}%.`
    );
    return;
  }
  

  const payload = {
    employeeId,
    appraisalCycleId,
    supervisorId,
    kpis: kpis.map((kpi) => ({
      title: kpi.title,
      description: kpi.description,
      metric: kpi.metric,
      target: kpi.target,
      weight: Number(kpi.weight),
      dueDate: kpi.dueDate,
      frequency: kpi.frequency,
      evidenceSource:
        kpi.evidenceSource,
      type: kpi.type,
    })),

    totalWeight,

    status: "Submitted",

    submittedAt:
      new Date().toISOString(),
  };

  try {
    setIsSubmitting(true);

     const res = await api.post("/appraisal/asign-kpi", payload)
     if(res.data.success) {
      showSuccess(res.data.message)
      console.log(
      "Submitting KPI payload:",
      payload
    );
     } else {
      showError(res.data.message)
      console.log(
      "Submitting KPI payload:",
      payload
    );
     }
  } catch (error) {
    console.error(
      "KPI submission failed:",
      error
    );

  } finally {
    setIsSubmitting(false);
  }
};

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  const handleEdit = (kpi) => {
    setEditingKPI(kpi);
    setIsKpiModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE MODAL
  |--------------------------------------------------------------------------
  */

  const handleCloseModal = () => {
    setIsKpiModalOpen(false);
    setEditingKPI(null);
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE OR UPDATE KPI
  |--------------------------------------------------------------------------
  */

  const handleSaveKPI = (kpiData) => {
    /*
    |--------------------------------------------------------------------------
    | EDIT EXISTING KPI
    |--------------------------------------------------------------------------
    */

    if (editingKPI) {
      setKpis((current) =>
        current.map((kpi) =>
          kpi.id === editingKPI.id
            ? {
                ...kpi,
                ...kpiData,
                id: editingKPI.id,
              }
            : kpi
        )
      );

      handleCloseModal();

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE NEW KPI
    |--------------------------------------------------------------------------
    */

    const newKPI = {
      ...kpiData,
      id: `kpi-${Date.now()}`,
      status: "On Track",
    };

    setKpis((current) => [
      ...current,
      newKPI,
    ]);

    handleCloseModal();
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE KPI
  |--------------------------------------------------------------------------
  */

  const handleDelete = (id) => {
    const kpi = kpis.find(
      (item) => item.id === id
    );

    if (!kpi) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${kpi.title}"?`
    );

    if (!confirmed) return;

    setKpis((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-['Hanken_Grotesk',sans-serif] text-[#191c1d]">
      {/* ================================================================
          MAIN AREA
      ================================================================ */}

      <div className="ml-[20px] min-h-screen">
        {/* ==============================================================
            TOP NAV
        ============================================================== */}

        <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-[#f8f9fa] px-8">
          {/* BREADCRUMB */}

          <div className="flex items-center gap-2 text-sm">
            <button className="text-[#484552] transition hover:text-[#38188c]">
              Dashboard
            </button>

            <ChevronRight
              size={16}
              className="text-[#797584]"
            />

            <span className="font-bold text-[#38188c]">
              KPI & Goals
            </span>
          </div>

          {/* PROFILE */}

          <div className="flex items-center gap-6">
            <button className="relative text-[#484552] transition hover:text-[#38188c]">
              <Bell size={21} />

              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ba1a1a] text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <button className="flex items-center gap-3">
              <img
                src={mockEmployee.avatar}
                alt={mockEmployee.name}
                className="h-9 w-9 rounded-full object-cover"
              />

              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold">
                  {mockEmployee.name}
                </span>

                <span className="text-[11px] text-[#484552]">
                  {mockEmployee.position}
                </span>
              </div>

              <ChevronDown
                size={17}
                className="text-[#484552]"
              />
            </button>
          </div>
        </header>

        {/* ==============================================================
            PAGE CONTENT
        ============================================================== */}

        <main className="p-8 pb-24">
          {/* PAGE HEADER */}

          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold">
                KPI & Goals
              </h2>

              <p className="text-sm text-[#484552]">
                Define and manage your Key Performance
                Indicators for this appraisal cycle.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* GUIDE */}

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-[#cac4d4] bg-white px-4 py-2 text-xs font-semibold text-[#38188c] transition hover:bg-[#f3f4f5]"
              >
                <BookOpen size={17} />
                KPI Setup Guide
              </button>

              {/* ADD */}

              <button
                type="button"
                onClick={handleAddKPI}
                className="flex items-center gap-2 rounded-lg bg-[#38188c] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                <Plus size={18} />
                Add KPI
              </button>
            </div>
          </div>

          {/* ==============================================================
              TABS
          ============================================================== */}

          <div className="mb-6 flex gap-8 border-b border-[#cac4d4]">
            <button
              type="button"
              onClick={() =>
                setActiveTab("my-kpis")
              }
              className={`border-b-2 pb-3 text-xs font-semibold transition ${
                activeTab === "my-kpis"
                  ? "border-[#38188c] text-[#38188c]"
                  : "border-transparent text-[#484552] hover:text-[#191c1d]"
              }`}
            >
              My KPIs
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab("history")
              }
              className={`border-b-2 pb-3 text-xs font-semibold transition ${
                activeTab === "history"
                  ? "border-[#38188c] text-[#38188c]"
                  : "border-transparent text-[#484552] hover:text-[#191c1d]"
              }`}
            >
              KPI History
            </button>
          </div>

          {/* ==============================================================
              MY KPIs TAB
          ============================================================== */}

          {activeTab === "my-kpis" && (
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
    

              <div className="flex flex-col gap-6 xl:col-span-8">
                {/* APPRAISAL PERIOD */}

                <div>
                    <label
                    htmlFor="appraisal_period"
                    className="mb-2 block text-xs font-semibold text-[#191c1d]"
                    >
                    Appraisal Period
                    <span className="ml-1 text-[#ba1a1a]">*</span>
                    </label>

                    <div className="relative">
                    <CalendarDays
                        size={19}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#38188c]"
                    />

                    <select
                        id="appraisal_period"
                        value={appraisalCycleId}
                        onChange={(e) =>
                        setAppraisalCycleId(e.target.value)
                        }
                        disabled={loadingPeriods}
                        className="block w-full appearance-none rounded-md border border-[#cac4d4] bg-white py-3 pl-10 pr-10 text-sm font-medium text-[#191c1d] outline-none transition focus:border-[#38188c] focus:ring-1 focus:ring-[#38188c]"
                    >
                        <option value="">
                        {loadingPeriods
                          ? "Loading appraisal periods..."
                          : "Select Appraisal Period"}
                        </option>

                        {appraisalPeriod.map((app) => (
                          <option key={app._id} value={app._id}>
                            {app.cycleName}
                          </option>
                        ))}
                    </select>

                    <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#484552]"
                    />
                    </div>

                    {appraisalPeriod && (
                    <p className="mt-2 text-[12px] text-[#484552]">
                        {formatDate(appraisalPeriod.find(
                            (period) =>
                            period._id === appraisalCycleId
                        )?.startDate)
                        }{" "}
                        –{" "}
                        {
                        formatDate(appraisalPeriod.find(
                            (period) =>
                            period._id === appraisalCycleId
                        )?.endDate)
                        }
                    </p>
                    )}
                </div>

                {/* ============================================================
                    SUPERVISOR
                ============================================================ */}

                <div>
                    <label
                    htmlFor="supervisor"
                    className="mb-2 block text-xs font-semibold text-[#191c1d]"
                    >
                    Supervisor
                    <span className="ml-1 text-[#ba1a1a]">*</span>
                    </label>

                    <div className="relative">
                    <Users
                        size={19}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#38188c]"
                    />

                    <select
                        id="supervisor"
                        value={supervisorId}
                        onChange={(e) =>
                        setSupervisorId(e.target.value)
                        }
                        className="block w-full appearance-none rounded-md border border-[#cac4d4] bg-white py-3 pl-10 pr-10 text-sm font-medium text-[#191c1d] outline-none transition focus:border-[#38188c] focus:ring-1 focus:ring-[#38188c]"
                    >
                        <option value="">
                        Select your supervisor
                        </option>

                        {employees.map(
                        (emp) => (
                            <option
                            key={emp._id}
                            value={emp._id}
                            >
                            {emp?.userId.fullname}
                            </option>
                        )
                        )}
                    </select>

                    <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#484552]"
                    />
                    </div>

                    {employees && (
                    <p className="mt-2 text-[12px] text-[#484552]">
                        {
                        employees.find(
                            (emp) =>
                            emp._id === supervisorId
                        )?.department
                        }
                    </p>
                    )}
                </div>


                {/* ======================================================
                    KPI TABLE
                ====================================================== */}

                <div className="overflow-hidden rounded-xl border border-[#cac4d4] bg-white">
                  <div className="border-b border-[#cac4d4] p-6">
                    <h3 className="mb-1 text-lg font-semibold">
                      Your KPIs
                    </h3>

                    <p className="text-[13px] text-[#484552]">
                      These are the KPIs you've set for
                      the current appraisal period.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-[#cac4d4] bg-[#f8f9fa]">
                          <th className="px-6 py-4 text-xs font-semibold">
                            #
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold">
                            KPI / Goal
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold">
                            Measure / Metric
                          </th>

                          <th className="px-6 py-4 text-xs font-semibold">
                            Target
                          </th>

                          <th className="px-6 py-4 text-center text-xs font-semibold">
                            Weight (%)
                          </th>

                          <th className="px-6 py-4 text-center text-xs font-semibold">
                            Status
                          </th>

                          <th className="px-6 py-4 text-center text-xs font-semibold">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#cac4d4]">
                        {kpis.map(
                          (kpi, index) => (
                            <tr
                              key={kpi.id}
                              className="group transition hover:bg-[#f8f9fa]"
                            >
                              <td className="px-6 py-4 text-sm text-[#484552]">
                                {index + 1}
                              </td>

                              <td className="px-6 py-4">
                                <div className="mb-1 font-semibold">
                                  {kpi.title}
                                </div>

                                <div className="max-w-[210px] text-xs leading-4 text-[#484552]">
                                  {kpi.description}
                                </div>
                              </td>

                              <td className="px-6 py-4 text-sm text-[#484552]">
                                {kpi.metric}
                              </td>

                              <td className="px-6 py-4 text-sm font-medium">
                                {kpi.target}
                              </td>

                              <td className="px-6 py-4 text-center text-sm">
                                {kpi.weight}%
                              </td>

                              <td className="px-6 py-4 text-center">
                                <StatusBadge
                                  status={
                                    kpi.status
                                  }
                                />
                              </td>

                              {/* ACTIONS */}

                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2 opacity-0 transition group-hover:opacity-100">
                                  {/* EDIT */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEdit(
                                        kpi
                                      )
                                    }
                                    className="rounded p-1.5 text-[#38188c] transition hover:bg-[#e7deff]"
                                    title="Edit KPI"
                                  >
                                    <Pencil
                                      size={15}
                                    />
                                  </button>

                                  {/* DELETE */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDelete(
                                        kpi.id
                                      )
                                    }
                                    className="rounded p-1.5 text-[#ba1a1a] transition hover:bg-[#ffdad6]"
                                    title="Delete KPI"
                                  >
                                    <Trash2
                                      size={15}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}

                        {/* EMPTY STATE */}

                        {kpis.length === 0 && (
                          <tr>
                            <td
                              colSpan="7"
                              className="px-6 py-12 text-center"
                            >
                              <div className="text-sm font-semibold">
                                No KPIs found
                              </div>

                              <p className="mt-1 text-xs text-[#484552]">
                                Add your first KPI
                                to get started.
                              </p>

                              <button
                                type="button"
                                onClick={
                                  handleAddKPI
                                }
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#38188c] px-4 py-2 text-xs font-semibold text-white"
                              >
                                <Plus
                                  size={16}
                                />
                                Add KPI
                              </button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* TOTAL WEIGHT */}

                  <div className="border-t border-[#cac4d4] bg-[#f8f9fa] p-4 text-right text-xs font-semibold">
                    Total Weight:{" "}
                    <span
                      className={
                        totalWeight === 100
                          ? "text-[#38188c]"
                          : "text-[#ba1a1a]"
                      }
                    >
                      {totalWeight}%
                    </span>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  RIGHT COLUMN
              ======================================================== */}

              <div className="flex flex-col gap-6 xl:col-span-4">
                {/* ======================================================
                    KPI SUMMARY
                ====================================================== */}

                <div className="rounded-xl border border-[#cac4d4] bg-white p-6">
                  <h3 className="mb-6 text-lg font-semibold">
                    KPI Summary
                  </h3>

                  <div className="mb-8 flex flex-col items-center">
                    {/* DONUT */}

                    <div
                      className="relative flex h-32 w-32 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(
                          #4f35a3 ${Math.min(
                            totalWeight,
                            100
                          )}%,
                          #e1e3e4 ${Math.min(
                            totalWeight,
                            100
                          )}% 100%
                        )`,
                      }}
                    >
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white">
                        <span className="text-2xl font-bold">
                          {totalWeight}%
                        </span>
                      </div>
                    </div>

                    <span className="mt-3 text-[13px] text-[#484552]">
                      Total Weight
                    </span>
                  </div>

                  {/* STATS */}

                  <div className="space-y-4 text-[13px]">
                    <div className="flex justify-between border-b border-[#cac4d4] pb-2">
                      <span className="text-[#484552]">
                        Total KPIs
                      </span>

                      <span className="font-semibold">
                        {totalKPIs}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-[#cac4d4] pb-2">
                      <span className="text-[#484552]">
                        Total Weight
                      </span>

                      <span className="font-semibold">
                        {totalWeight}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#484552]">
                        Last Updated
                      </span>

                      <span className="font-semibold">
                        24 May 2026
                      </span>
                    </div>
                  </div>
                </div>

                {/* ======================================================
                    TIPS
                ====================================================== */}

                <div className="relative overflow-hidden rounded-xl border border-[#cac4d4] bg-[#f8f9fa] p-6">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#e7deff] opacity-40" />

                  <div className="relative z-10 mb-4 flex items-center gap-3">
                    <Lightbulb
                      size={20}
                      className="text-[#38188c]"
                    />

                    <h3 className="text-lg font-semibold text-[#38188c]">
                      Tips for Good KPIs
                    </h3>
                  </div>

                  <ul className="relative z-10 space-y-4 text-[13px] leading-5 text-[#484552]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-[#38188c]"
                      />

                      <span>
                        Make sure your KPIs are
                        SMART: Specific,
                        Measurable, Achievable,
                        Relevant and Time-bound.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-[#38188c]"
                      />

                      <span>
                        Ensure the total weight
                        equals 100%.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-[#38188c]"
                      />

                      <span>
                        Focus on outcomes that
                        align with your role and
                        the firm's objectives.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-[#38188c]"
                      />

                      <span>
                        You can update your KPIs
                        anytime before the
                        appraisal.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              KPI HISTORY
          ============================================================== */}

          {activeTab === "history" && (
            <div className="rounded-xl border border-[#cac4d4] bg-white">
              <div className="border-b border-[#cac4d4] p-6">
                <h3 className="mb-1 text-lg font-semibold">
                  KPI History
                </h3>

                <p className="text-[13px] text-[#484552]">
                  Review your KPIs from previous
                  appraisal periods.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#cac4d4] bg-[#f8f9fa]">
                      <th className="px-6 py-4 text-xs font-semibold">
                        Appraisal Period
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold">
                        Total KPIs
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold">
                        Weight
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold">
                        Final Score
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold">
                        Last Updated
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#cac4d4]">
                    {mockKPIHistory.map(
                      (history) => (
                        <tr
                          key={history.id}
                          className="transition hover:bg-[#f8f9fa]"
                        >
                          <td className="px-6 py-4 text-sm font-semibold">
                            {history.period}
                          </td>

                          <td className="px-6 py-4 text-sm text-[#484552]">
                            {history.totalKPIs}
                          </td>

                          <td className="px-6 py-4 text-sm text-[#484552]">
                            {history.totalWeight}%
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-[#38188c]">
                            {history.score}
                          </td>

                          <td className="px-6 py-4 text-sm text-[#484552]">
                            {history.updatedAt}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================================================================
          CREATE / EDIT MODAL
      ================================================================ */}

      <KPIFormModal
        isOpen={isKpiModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveKPI}
        existingKPIs={kpis}
        editingKPI={editingKPI}
      />

        <div className="m-8 pr-12 flex items-center justify-end border-t border-[#cac4d4] pt-6">
            <button
                type="button"
                onClick={handleSubmitKPIs}
                disabled={isSubmitting}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition ${
                isSubmitting
                    ? "cursor-not-allowed bg-[#797584]"
                    : "bg-[#38188c] hover:bg-[#4f35a3]"
                }`}
            >
                {isSubmitting ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                </>
                ) : (
                <>
                    <FileCheck2 size={18} />
                    Submit KPIs
                </>
                )}
            </button>
        </div>
    </div>
  );
}