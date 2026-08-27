import { useState } from "react";
import CashRequisitionSidebar from "../Component/CashRequisition/CashRequisitionSidebar";
import Input from "../Component/reuseables/Input";

const categories = [
  { value: "travel", label: "Travel" },
  { value: "office_supplies", label: "Office Supplies" },
  { value: "client_entertainment", label: "Client Entertainment" },
  { value: "training", label: "Training & Development" },
  { value: "equipment", label: "Equipment" },
  { value: "other", label: "Other" },
];

const CashRequisitionForm = () => {
  const [formData, setFormData] = useState({
    requestTitle: "",
    category: "",
    amount: "",
    requiredDate: "",
    department: "Finance Department",
    purpose: "",
    supportingDocuments: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, supportingDocuments: e.target.files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CashRequisitionSidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className="p-6 md:p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="text-gray-900 font-medium">Dashboard</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">New Cash Requisition</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              New Cash Requisition
            </h1>
            <p className="text-gray-500">
              Fill in the details below to create a new cash requisition.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Request Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-sm font-medium">
                  1
                </span>
                <h2 className="text-lg font-semibold text-gray-900">
                  Request Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Request Title"
                  name="requestTitle"
                  value={formData.requestTitle}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Travel Advance"
                />

                <Input
                  label="Request Category"
                  name="category"
                  as="select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  options={categories}
                  inputClassName="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                />

                <Input
                  label="Amount Requested"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="₦ 0.00"
                  inputClassName="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />

                <Input
                  label="Required Date"
                  name="requiredDate"
                  type="date"
                  value={formData.requiredDate}
                  onChange={handleChange}
                  required
                  inputClassName="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    disabled
                    className="mt-1 w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Automatically assigned based on your profile
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Purpose of Request */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-sm font-medium">
                  2
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Purpose of Request
                  </h2>
                  <p className="text-sm text-gray-500">
                    Tell us what the money is needed for and why.
                  </p>
                </div>
              </div>

              <div className="relative">
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Enter purpose of the request..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <div className="text-right text-xs text-gray-400 mt-1">
                  {formData.purpose.length}/1000 characters
                </div>
              </div>
            </div>

            {/* Section 3: Supporting Documents */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-sm font-medium">
                  3
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Supporting Documents{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </h2>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  id="documents"
                  name="supportingDocuments"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <label
                  htmlFor="documents"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-xl">
                    +
                  </div>
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, DOC, DOCX, PNG, JPG up to 10MB
                  </p>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CashRequisitionForm;
