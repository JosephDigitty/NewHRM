import React, { useState } from "react";
import { api } from "../api/request";
import { useAuth } from "../Context/authContext";

const initialForm = {
  requestTitle: "",
  requestCategory: "",
  amountRequested: "",
  requiredDate: "",
  department: "Finance Department",
  purpose: "",
};

const categories = [
  {
    value: "travel",
    label: "Travel Advance",
  },
  {
    value: "petty_cash",
    label: "Petty Cash",
  },
  {
    value: "supplies",
    label: "Office Supplies",
  },
];

function StepHeader({ number, title, optional = false }) {
  return (
    <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold mr-3">
        {number}
      </div>

      <h2 className="text-lg font-bold text-gray-900">
        {title}{" "}
        {optional && (
          <span className="font-normal text-gray-500 text-base">
            (Optional)
          </span>
        )}
      </h2>
    </div>
  );
}

export default function NewCashRequisition() {
  const [form, setForm] = useState(initialForm);

  const [files, setFiles] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE FILES
  // ==========================================

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    const validFiles = selectedFiles.filter((file) => {
      const maxSize = 10 * 1024 * 1024;

      return file.size <= maxSize;
    });

    setFiles(validFiles);
  };

  // ==========================================
  // REMOVE FILE
  // ==========================================

  const removeFile = (index) => {
    setFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!form.requestTitle.trim()) {
      return "Request title is required.";
    }

    if (!form.requestCategory) {
      return "Please select a request category.";
    }

    if (!form.amountRequested) {
      return "Amount requested is required.";
    }

    if (Number(form.amountRequested) <= 0) {
      return "Amount requested must be greater than zero.";
    }

    if (!form.requiredDate) {
      return "Required date is required.";
    }

    if (!form.purpose.trim()) {
      return "Please provide the purpose of the request.";
    }

    return null;
  };

  // ==========================================
  // BUILD PAYLOAD
  // ==========================================
 const { user } = useAuth();
  const userId = user?._id; 
  console.log("AUTH USER:", user);
console.log("USER ID:", user?._id);
  const buildPayload = () => {
    
    return {
      requestTitle: form.requestTitle.trim(),

      requestCategory: form.requestCategory,

      amountRequested: Number(
        form.amountRequested
      ),
      userId: userId,

      requiredDate: form.requiredDate,

      purpose: form.purpose.trim(),

      files,
    };
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const error = validateForm();

    if (error) {
      setMessage(error);
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = buildPayload();

        const formData = new FormData();

        formData.append("userId", payload.userId)

        formData.append(
          "requestTitle",
          payload.requestTitle
        );

        formData.append(
          "requestCategory",
          payload.requestCategory
        );

        formData.append(
          "amountRequested",
          payload.amountRequested
        );

        formData.append(
          "requiredDate",
          payload.requiredDate
        );

        formData.append("department", form.department);

        formData.append(
          "purpose",
          payload.purpose
        );

        files.forEach((file) => {
          formData.append("supportingDocuments", file);
        });

        await api.post(
          "/cash",
          formData,
        );
    
      console.log(
        "Cash Requisition Payload:",
        payload
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      setMessage(
        "Cash requisition submitted successfully."
      );

      setForm(initialForm);

      setFiles([]);

    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // SAVE DRAFT
  // ==========================================

  const handleSaveDraft = () => {
    const payload = buildPayload();

    console.log(
      "Draft Cash Requisition:",
      payload
    );

    setMessage(
      "Cash requisition saved as draft."
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-4 md:px-8">

        <div className="flex items-center gap-4">

          {/* Notification */}

          <button
            type="button"
            className="relative text-gray-500 hover:text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>

            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {/* User */}

          <div className="flex items-center gap-3">

            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
              JD
            </div>

            <div className="hidden md:block">

              <p className="text-sm font-semibold text-gray-900">
                Joseph Digitty
              </p>

              <p className="text-xs text-gray-500">
                Treasury Officer
              </p>

            </div>

            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>

          </div>

        </div>

      </header>


      {/* ==========================================
          CONTENT
      ========================================== */}

      <div className="p-4 md:p-8 overflow-y-auto">

        <div className="max-w-4xl mx-auto">

          {/* PAGE HEADER */}

          <div className="mb-8">

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              New Cash Requisition
            </h1>

            <div className="flex items-center gap-2 text-sm text-gray-500">

              <span className="hover:text-gray-900 cursor-pointer">
                Dashboard
              </span>

              <span>/</span>

              <span className="text-gray-900 font-medium">
                New Cash Requisition
              </span>

            </div>

            <p className="mt-2 text-gray-600">
              Fill in the details below to create a
              new cash requisition.
            </p>

          </div>


          {/* MESSAGE */}

          {message && (
            <div className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              {message}
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* ======================================
                STEP 1
            ====================================== */}

            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

              <StepHeader
                number="1"
                title="Request Information"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* REQUEST TITLE */}

                <div>

                  <label
                    htmlFor="requestTitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Request Title{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="requestTitle"
                    name="requestTitle"
                    value={form.requestTitle}
                    onChange={handleChange}
                    placeholder="e.g. Travel Advance"
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                  />

                </div>


                {/* CATEGORY */}

                <div>

                  <label
                    htmlFor="requestCategory"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Request Category{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="requestCategory"
                    name="requestCategory"
                    value={form.requestCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  >

                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.value}
                          value={category.value}
                        >
                          {category.label}
                        </option>
                      )
                    )}

                  </select>

                </div>


                {/* AMOUNT */}

                <div>

                  <label
                    htmlFor="amountRequested"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Amount Requested{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      ₦
                    </span>

                    <input
                      id="amountRequested"
                      name="amountRequested"
                      value={form.amountRequested}
                      onChange={handleChange}
                      placeholder="0.00"
                      type="number"
                      min="0"
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                    />

                  </div>

                </div>


                {/* REQUIRED DATE */}

                <div>

                  <label
                    htmlFor="requiredDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Required Date{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="requiredDate"
                    name="requiredDate"
                    value={form.requiredDate}
                    onChange={handleChange}
                    type="date"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  />

                </div>


                {/* DEPARTMENT */}

                <div className="md:col-span-2">

                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Department
                  </label>

                  <input
                    id="department"
                    name="department"
                    value={form.department}
                    readOnly
                    className="w-full md:w-1/2 px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Automatically assigned based on
                    your profile
                  </p>

                </div>

              </div>

            </section>


            {/* ======================================
                STEP 2
            ====================================== */}

            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

              <StepHeader
                number="2"
                title="Purpose of Request"
              />

              <p className="text-sm text-gray-600 mb-3">
                Tell us what the money is needed
                for and why.
              </p>

              <textarea
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                maxLength={1000}
                rows={4}
                placeholder="Enter purpose of the request..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
              />

              <div className="text-right mt-1 text-xs text-gray-500">
                {form.purpose.length}/1000
                characters
              </div>

            </section>


            {/* ======================================
                STEP 3
            ====================================== */}

            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

              <StepHeader
                number="3"
                title="Supporting Documents"
                optional
              />

              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-indigo-300 px-6 py-10 bg-indigo-50 hover:bg-indigo-100 transition">

                <div className="text-center">

                  <svg
                    className="mx-auto h-12 w-12 text-indigo-600 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>

                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-sm"
                  >

                    <span className="font-semibold text-indigo-600">
                      Drag and drop files here
                    </span>

                    <br />

                    <span className="text-gray-600">
                      or{" "}
                      <span className="underline text-indigo-600">
                        browse files
                      </span>
                    </span>

                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileChange}
                    />

                  </label>

                  <p className="text-xs text-gray-500 mt-2">
                    PDF, JPG, PNG or DOCX
                    (Max 10MB)
                  </p>

                </div>

              </div>


              {/* SELECTED FILES */}

              {files.length > 0 && (

                <div className="mt-4 space-y-2">

                  {files.map((file, index) => (

                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3"
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          📄
                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-medium text-gray-800 truncate">
                            {file.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {(
                              file.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </p>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFile(index)
                        }
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </section>


            {/* ======================================
                STEP 4 — APPROVAL ROUTE
            ====================================== */}

            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

              <StepHeader
                number="4"
                title="Approval Route"
              />

              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">

                <p className="text-sm text-gray-600">
                  Your approval route will be
                  determined automatically based on
                  your staff level after submission.
                </p>

              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">

                <RouteCard
                  title="Level A"
                  steps={[
                    "Level B",
                    "HR",
                    "Level C",
                    "Accounts",
                  ]}
                />

                <RouteCard
                  title="Level B"
                  steps={[
                    "HR",
                    "Level C",
                    "Accounts",
                  ]}
                />

                <RouteCard
                  title="Level C"
                  steps={[
                    "HR",
                    "Accounts",
                  ]}
                />

              </div>

            </section>


            {/* ======================================
                ACTIONS
            ====================================== */}

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 pb-8">

              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium transition"
              >
                Save as Draft
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed font-medium transition shadow-sm"
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit Requisition"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </main>
  );
}


// ============================================================
// APPROVAL ROUTE CARD
// ============================================================

function RouteCard({ title, steps }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">

      <h3 className="text-sm font-bold text-gray-900 mb-3">
        {title} Request
      </h3>

      <div className="space-y-2">

        {steps.map((step, index) => (

          <div
            key={step}
            className="flex items-center gap-2"
          >

            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold">
              {index + 1}
            </div>

            <span className="text-sm text-gray-700">
              {step}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}