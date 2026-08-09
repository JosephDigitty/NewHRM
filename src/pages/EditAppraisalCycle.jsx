import React, { useState, useEffect } from "react";
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
import { useParams } from "react-router-dom";
import Footer from "../Component/reuseables/Footer";
import useToast from "../utils/useToast";

const EditAppraisalCycle = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const { showSuccess, showError } = useToast();

  const { id } = useParams(); // cycle id from route

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    cycleName: "",
    startDate: "",
    endDate: "",
    status: "open",
  });

  // Fetch cycle from backend
  useEffect(() => {
    const fetchCycle = async () => {
      try {
        const res = await api.get(`/appraisal/appraisals/${id}`);
        if (res.data.success) {
          const cycle = res.data.appraisalCycle;
          setFormData({
            cycleName: cycle?.cycleName,
            startDate: cycle?.startDate?.substring(0, 10),
            endDate: cycle?.endDate?.substring(0, 10),
            status: cycle?.status,
          });
        } else {
          console.log(res.data);
        }

        setLoading(false);
      } catch (err) {
        showError(err.response?.data?.message || "Failed to load cycle");
        setLoading(false);
        console.log(err);
      }
    };

    fetchCycle();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update cycle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { cycleName, startDate, endDate, status } = formData;

      const res = await api.put(`/appraisal/update-cycle/${id}`, {
        cycleName,
        startDate,
        endDate,
        status,
        userId,
      });

      if (res && res.data.success) {
        showSuccess("Appraisal Cycle Updated Successfully");
      } else {
        console.log(res.data);
      }
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading cycle data...
      </div>
    );
  }

  return (
    <div className="bg-background-light text-slate-900 font-display min-h-screen">
      <main>
        <div className="max-w-5xl mx-auto w-full px-6 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-6">
            <a className="hover:text-primary transition-colors" href="#">
              Dashboard
            </a>
            <ChevronRight className="w-4 h-4" />
            <a className="hover:text-primary transition-colors" href="#">
              Performance
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900">Edit Appraisal Cycle</span>
          </nav>

          <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Edit Appraisal Cycle
              </h1>
              <p className="text-slate-600">
                Modify the performance review period for your organization.
              </p>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-[#5048e5]/10 rounded-lg text-primary">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Cycle Configuration
                    </h3>
                    <p className="text-sm text-slate-500">
                      Update the timeline configuration.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Cycle Name */}
                  <div className="grid grid-cols-1 gap-1">
                    <label className="text-sm font-semibold text-slate-700 mb-1">
                      Cycle Name
                    </label>

                    <input
                      name="cycleName"
                      type="text"
                      value={formData.cycleName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-slate-700 mb-1">
                        Start Date
                      </label>

                      <input
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-slate-700 mb-1">
                        End Date
                      </label>

                      <input
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="grid grid-cols-1 gap-1">
                    <label className="text-sm font-semibold text-slate-700 mb-1">
                      Status
                    </label>

                    <div className="relative">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none"
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

                  {/* Actions */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-3 justify-end">
                    <button
                      type="button"
                      className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 rounded-lg bg-[#5048e5] text-black cursor-pointer font-semibold hover:bg-[#5048e5]/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Update Cycle
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Info cards remain same */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-[#5048e5]/5 rounded-xl border border-primary/10">
                <Info className="text-primary mb-3" />
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Pro Tip
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ensure the cycle dates match the performance review period.
                </p>
              </div>

              <div className="p-5 bg-slate-100 rounded-xl border border-slate-200">
                <Users className="text-slate-500 mb-3" />
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Participants
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Employees assigned to this cycle will automatically receive
                  evaluation forms.
                </p>
              </div>

              <div className="p-5 bg-slate-100 rounded-xl border border-slate-200">
                <History className="text-slate-500 mb-3" />
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  History
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Changes to this cycle are logged for auditing purposes.
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

export default EditAppraisalCycle;
