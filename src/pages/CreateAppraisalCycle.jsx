import React, { useState } from "react";
import {
  Calendar,
  Info,
  Users,
  History,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../Context/authContext";
import { api } from "../api/request";
import Footer from "../Component/reuseables/Footer";
import useToast from "../utils/useToast";

const CreateAppraisalCycle = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cycleName: "",
    startDate: "",
    endDate: "",
    status: "open",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { cycleName, startDate, endDate } = formData;
      const res = await api.post("/appraisal/create-cycle", {
        cycleName,
        startDate,
        endDate,
        userId,
      });
      if (res && res.data.success) {
        showSuccess("Appraisal Cycle created Successfully");
      }
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light  text-slate-900  font-display min-h-screen">
      <main>
        <div className="max-w-5xl mx-auto w-full px-6 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500  mb-6">
            <a className="hover:text-primary transition-colors" href="#">
              Dashboard
            </a>
            <ChevronRight className="w-4 h-4" />
            <a className="hover:text-primary transition-colors" href="#">
              Performance
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 ">Appraisal Cycles</span>
          </nav>

          <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-slate-900  tracking-tight">
                Create Appraisal Cycle
              </h1>
              <p className="text-slate-600 ">
                Set up a new performance review period for your organization.
              </p>
            </div>

            {/* Main Form Card */}
            <div className="bg-white  rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-[#5048e5]/10 rounded-lg text-primary">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 ">
                      Cycle Configuration
                    </h3>
                    <p className="text-sm text-slate-500 ">
                      All fields are required to initialize the timeline.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Cycle Name */}
                  <div className="grid grid-cols-1 gap-1">
                    <label
                      className="text-sm font-semibold text-slate-700  mb-1"
                      htmlFor="cycle-name"
                    >
                      Cycle Name
                    </label>
                    <input
                      id="cycle-name"
                      name="cycleName"
                      type="text"
                      placeholder="e.g. Q1 2026 Performance Review"
                      value={formData.cycleName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                      <label
                        className="text-sm font-semibold text-slate-700  mb-1"
                        htmlFor="start-date"
                      >
                        Start Date
                      </label>
                      <input
                        id="start-date"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300  bg-white  text-slate-900  focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                        className="text-sm font-semibold text-slate-700 mb-1"
                        htmlFor="end-date"
                      >
                        End Date
                      </label>
                      <input
                        id="end-date"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white  text-slate-900  focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="grid grid-cols-1 gap-1">
                    <label
                      className="text-sm font-semibold text-slate-700 mb-1"
                      htmlFor="status"
                    >
                      Status
                    </label>
                    <div className="relative">
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none"
                        required
                      >
                        <option value="open">
                          Open - Active for participants
                        </option>
                        <option value="closed">
                          Closed - Setup phase only
                        </option>
                        <option value="draft">Draft - Private</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <ChevronRight className="w-5 h-5 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-3 justify-end">
                    {/* <button
                      type="button"
                      className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button> */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 rounded-lg bg-[#5048e5] text-black cursor-pointer font-semibold hover:bg-[#5048e5]/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Create Cycle
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Guidance Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-[#5048e5]/5 rounded-xl border border-primary/10">
                <Info className="text-primary mb-3" />
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Pro Tip
                </h4>
                <p className="text-xs text-slate-600  leading-relaxed">
                  Most annual cycles start on Jan 1st and end on Dec 31st.
                  Quarterly cycles typically last 3 months.
                </p>
              </div>
              <div className="p-5 bg-slate-100  rounded-xl border border-slate-200 ">
                <Users className="text-slate-500 mb-3" />
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Participants
                </h4>
                <p className="text-xs text-slate-600  leading-relaxed">
                  After creating the cycle, you will be able to assign employee
                  segments to this review period.
                </p>
              </div>
              <div className="p-5 bg-slate-100 rounded-xl border border-slate-200">
                <History className="text-slate-500 mb-3" />
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Auto-Archiving
                </h4>
                <p className="text-xs text-slate-600  leading-relaxed">
                  Cycles are automatically archived 30 days after the end date
                  unless manually extended.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer variant="default" />
    </div>
  );
};

export default CreateAppraisalCycle;
