import { useEffect, useState } from "react";
import { fetchDepartments, getHmo } from "../../utils/EmployeeHelper";

import { useNavigate, useParams } from "react-router-dom";
import Loader from "../reuseables/Loader";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";

const EditEmployee = () => {
  const { showError } = useToastContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const [departments, setDepartments] = useState([]);
  const [HMO, setHMO] = useState([]);
  const [employee, setEmployee] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  /*
   * Update these values if your backend uses
   * different employee levels.
   */
  const employeeLevels = [
    "Intern",
    "Junior",
    "Intermediate",
    "Senior",
    "Manager",
    "Senior Manager",
    "Director",
    "Executive",
  ];

  const authorizationLevels = [
    "Employee",
    "Supervisor",
    "Manager",
    "HR",
    "Admin",
    "Director",
  ];

  // --------------------------------------------------
  // FETCH DEPARTMENTS
  // --------------------------------------------------

  useEffect(() => {
    const getDepartments = async () => {
      const deps = await fetchDepartments(showError);
      setDepartments(deps);
    };

    getDepartments();
  }, []);

  // --------------------------------------------------
  // FETCH HMO
  // --------------------------------------------------

  useEffect(() => {
    const getHMO = async () => {
      const hmo = await getHmo(showError);
      setHMO(hmo);
    };

    getHMO();
  }, []);

  // --------------------------------------------------
  // FETCH EMPLOYEE
  // --------------------------------------------------

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);

      try {
        const response = await api.get(`/employee/${id}`);

        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  // --------------------------------------------------
  // HANDLE NESTED FIELD CHANGES
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setEmployee((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEmployee((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // --------------------------------------------------
  // UPDATE EMPLOYEE
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const response = await api.put(`/employee/${id}`, employee);

      if (response.data.success) {
        navigate("/admin-dashboard/Employees");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        showError(error.response.data.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // RESET PASSWORD
  // --------------------------------------------------

  const handleResetPassword = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to reset the password for ${employee?.userId?.fullname}?`
    );

    if (!confirmed) return;

    setResettingPassword(true);

    try {
      /*
       * Change this endpoint to your actual reset-password endpoint.
       *
       * Example:
       * /employee/${id}/reset-password
       */

      const response = await api.post(
        `/employee/reset/${id}`
      );

      if (response.data.success) {
        alert(
          response.data.message ||
            "Employee password has been reset successfully."
        );
      }
    } catch (error) {
      if (error.response?.data?.error) {
        showError(error.response.data.error);
      } else {
        showError("Unable to reset employee password.");
      }
    } finally {
      setResettingPassword(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading || !employee) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard/Employees")}
              className="mb-3 text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              ← Back to Employees
            </button>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Edit Employee
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update employee information and account settings.
            </p>
          </div>

          {/* EMPLOYEE SUMMARY */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

            <div
              className="h-11 w-11 rounded-full border border-slate-200 bg-cover bg-center"
              style={{
                backgroundImage: `url(http://localhost:3001/uploads/${employee.userId?.profileImage})`,
              }}
            />

            <div>
              <p className="text-sm font-semibold text-slate-900">
                {employee.userId?.fullname}
              </p>

              <p className="text-xs text-slate-500">
                Employee ID: {employee.employeeId}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            RESET PASSWORD
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-sm font-semibold text-red-900">
              Account Security
            </h2>

            <p className="mt-1 text-sm text-red-700">
              Reset this employee's login password.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetPassword}
            disabled={resettingPassword}
            className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resettingPassword && <Loader size="sm" />}

            {resettingPassword
              ? "Resetting..."
              : "Reset Password"}
          </button>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit}>

          {/* =====================================================
              PERSONAL INFORMATION
          ====================================================== */}

          <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-base font-semibold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Basic personal details of the employee.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

              {/* FULL NAME */}
              <InputField
                label="Full Name"
                name="userId.fullname"
                value={employee.userId?.fullname || ""}
                onChange={handleChange}
                required
              />

              {/* EMAIL */}
              <InputField
                label="Email Address"
                type="email"
                name="userId.email"
                value={employee.userId?.email || ""}
                onChange={handleChange}
                required
              />

              {/* DOB */}
              <InputField
                label="Date of Birth"
                type="date"
                name="personal.dob"
                value={employee.personal?.dob?.split("T")[0] || ""}
                onChange={handleChange}
                required
              />

              {/* PHONE */}
              <InputField
                label="Phone Number"
                name="personal.phone"
                value={employee.personal?.phone || ""}
                onChange={handleChange}
                required
              />

              {/* GENDER */}
              <SelectField
                label="Gender"
                name="personal.gender"
                value={employee.personal?.gender || ""}
                onChange={handleChange}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
                required
              />

              {/* MARITAL STATUS */}
              <SelectField
                label="Marital Status"
                name="personal.maritalStatus"
                value={employee.personal?.maritalStatus || ""}
                onChange={handleChange}
                options={[
                  { value: "single", label: "Single" },
                  { value: "married", label: "Married" },
                  { value: "divorced", label: "Divorced" },
                ]}
                required
              />

              {/* ADDRESS */}
              <div className="md:col-span-2">
                <InputField
                  label="Address"
                  name="personal.address"
                  value={employee.personal?.address || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              EMPLOYMENT INFORMATION
          ====================================================== */}

          <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-base font-semibold text-slate-900">
                Employment Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Employee's role, department and authorization level.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

              {/* EMPLOYEE ID */}
              <InputField
                label="Employee ID"
                name="employeeId"
                value={employee.employeeId || ""}
                onChange={handleChange}
                disabled
              />

              {/* POSITION */}
              <InputField
                label="Job Position"
                name="job.position"
                value={employee.job?.position || ""}
                onChange={handleChange}
                required
              />

              {/* DEPARTMENT */}
              <SelectField
                label="Department"
                name="job.department"
                value={employee.job?.department?._id || employee.job?.department || ""}
                onChange={handleChange}
                options={departments.map((dep) => ({
                  value: dep._id,
                  label: dep.department_Name,
                }))}
                placeholder="Select Department"
              />

              {/* EMPLOYEE LEVEL */}
              <SelectField
                label="Employee Level"
                name="job.employeeLevel"
                value={employee.job?.employeeLevel || ""}
                onChange={handleChange}
                options={employeeLevels.map((level) => ({
                  value: level,
                  label: level,
                }))}
                placeholder="Select Employee Level"
              />

              {/* AUTHORIZATION */}
              <SelectField
                label="Authorization"
                name="personal.authorisation"
                value={employee.personal?.authorisation || ""}
                onChange={handleChange}
                options={authorizationLevels.map((level) => ({
                  value: level,
                  label: level,
                }))}
                placeholder="Select Authorization"
              />

              {/* HMO */}
              <SelectField
                label="HMO"
                name="hmo"
                value={employee.hmo?._id || employee.hmo || ""}
                onChange={handleChange}
                options={HMO.map((hmo) => ({
                  value: hmo._id,
                  label: hmo.name,
                }))}
                placeholder="Select HMO"
              />
            </div>
          </section>

          {/* =====================================================
              DOCUMENTS
          ====================================================== */}

          <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-base font-semibold text-slate-900">
                Employee Documents
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Documents currently associated with this employee.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">

              <DocumentCard
                title="Offer Letter"
                url={employee.documents?.offerLetter}
              />

              <DocumentCard
                title="Resume"
                url={employee.documents?.resume}
              />

              <DocumentCard
                title="National ID"
                url={employee.documents?.nationalId}
              />

              <DocumentCard
                title="Passport"
                url={employee.documents?.passport}
              />
            </div>
          </section>

          {/* =====================================================
              ACTIONS
          ====================================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate("/admin-dashboard/Employees")
              }
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader size="sm" />}

              {submitting
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   INPUT FIELD
========================================================= */

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />
    </div>
  );
};

/* =========================================================
   SELECT FIELD
========================================================= */

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/* =========================================================
   DOCUMENT CARD
========================================================= */

const DocumentCard = ({ title, url }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
        📄
      </div>

      <p className="text-sm font-semibold text-slate-800">
        {title}
      </p>

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
        >
          View Document →
        </a>
      ) : (
        <p className="mt-2 text-xs text-slate-400">
          No document
        </p>
      )}
    </div>
  );
};

export default EditEmployee;