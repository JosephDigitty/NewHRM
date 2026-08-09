import React, { useEffect, useState } from "react";
import { FileText, Send, Building2, Calendar, User, IdCard } from "lucide-react";
import Footer from "../Component/reuseables/Footer";
import { api } from "../api/request";
import { useParams } from "react-router-dom";

const EmployeeSelfAppraisal = () => {
const {appraisalId} = useParams()
const [formData, setFormData] = useState({
  kpis: [],
  overallFeedback: ""
});
  const {id} = useParams()
  useEffect(() => {
    const getKpiGoal = async () => {
    try {
      const res = await api.get(`/appraisal/employeeKpis/${id}`)
      if(res.data.success){
        console.log(res.data.appraisals.kpis)
        setFormData(res.data.appraisals)
      } else {
        console.log(res.data)
      }
    } catch (error) {
      alert(error)
    }
  }
  getKpiGoal()
  }, [id])
  

  const handleKpiChange = (kpiId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      kpis: prev.kpis.map((kpi) =>
        kpi._id === kpiId ? { ...kpi, [field]: value } : kpi,
      ),
    }));
  };

  const handleOverallFeedbackChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      overallFeedback: e.target.value,
    }));
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
    // Add API call here to save draft
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
    const scores = formData.kpis.map((kpi) => ({
    kpiId: kpi._id, 
    selfScore: Number(kpi.selfScore),
    selfComment: kpi.selfComment
    }))
    const payload = {
      scores,
      overallFeedback: formData.overallFeedback,
      appraisalId:formData._id
    }
    console.log(JSON.stringify(payload, null, 2));
    const res = await api.post(`/appraisal/selfappraisal/${id}`, payload)
    if(res.status.success) {
      alert("Operation succesfull")
      console.log(res.data)
    } else {
      alert(res.data.message || "Submission failed");
    }
    } catch (error) {
      alert(error)
    }

    console.log("Submitting self appraisal:", formData);
    // Add API call here to submit
  };

  // Calculate completion progress
  const calculateProgress = () => {
    const filledKpis = formData.kpis.filter(
      (kpi) => kpi.selfScore && kpi.selfComment,
    ).length;
    const totalKpis = formData.kpis.length;
    const feedbackProgress = formData.overallFeedback ? 1 : 0;
    const totalProgress = Math.round(
      ((filledKpis / totalKpis) * 0.8 + feedbackProgress * 0.2) * 100,
    );
    return totalProgress;
  };

  return (
    <form onSubmit={handleSubmit}
     className="bg-background-light font-display text-slate-900  min-h-screen">
      <main>
        <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-8 p-6 md:p-10">
          <section className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Annual Self Appraisal
                </h1>
                <p className="text-slate-500 mt-1">
                  Review your performance for the current cycle and submit your
                  feedback.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 w-full md:w-64">
                <div className="flex justify-between w-full">
                  <span className="text-sm font-medium text-slate-700">
                    Completion Progress
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {calculateProgress()}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#5048e5] h-full transition-all duration-500"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div
                className="size-24 rounded-full bg-slate-100 bg-cover bg-center border-4 border-primary/10"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBYa7V2ClCKW6UFCuC4JKsChcY0mTJ7CJila45nYNTsmdYmfYxr0cDnjmrPPj0H1UbATcaBMEl5SYHoe0A-1yKrtU-jKK6Da29U5iHG92wdHEhlf8WnSOTTdLgibXIZKoJLwRgZCp7Xkh9LBux3pKZWfIN46Vfpv9fp00XYPinLM43E1j8fuSqy2BOjWpQI6_M9N8K0ksQsQaTJrWGhEz6FbK68YQCooprP3tl3sw44WbC-04tVIDC7NkSNOHaOu09WRA84BsF4mY8")',
                }}
              ></div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-900">
                  Alex Johnson
                </h3>
                <p className="text-primary font-medium">
                  Senior Product Engineer
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Building2 className="w-4 h-4" />
                    Product Engineering
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    Cycle: FY 2023-2024
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <User className="w-4 h-4" />
                    Manager: Sarah Chen
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-[#5048e5]/10 text-primary rounded-lg text-sm font-bold">
                Status: In Progress
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <FileText className="text-primary" />
              <h2 className="text-xl font-bold text-slate-900">
                Key Performance Indicators
              </h2>
            </div>
            <div className="space-y-6">
              {formData?.kpis?.map((kpi) => (
                <div
                  key={kpi._id}
                  className="bg-white  border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="text-lg font-bold text-slate-900">
                        {kpi.title}
                      </h4>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        Weight: {kpi.weight}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {kpi.description}
                    </p>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50/50">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Self Score (1-5)
                      </label>
                      <select
                        value={kpi.selfScore || ""}
                        onChange={(e) =>
                          handleKpiChange(kpi._id, "selfScore", e.target.value)
                        }
                        className="w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select Score</option>
                        <option value="1">1 - Unsatisfactory</option>
                        <option value="2">2 - Developing</option>
                        <option value="3">3 - Solid Performer</option>
                        <option value="4">4 - High Performer</option>
                        <option value="5">5 - Exceptional</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Self Comments & Evidence
                      </label>
                      <textarea
                        value={kpi.selfComment || ""}
                        onChange={(e) =>
                          handleKpiChange(kpi._id, "selfComment", e.target.value)
                        }
                        placeholder="Describe your achievements for this KPI..."
                        rows="3"
                        className="w-full rounded-lg border-slate-300  bg-white  text-slate-900 focus:ring-primary focus:border-primary placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Overall Feedback
            </h3>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              General Comments for your Manager
            </label>
            <textarea
              value={formData.overallFeedback}
              onChange={handleOverallFeedbackChange}
              placeholder="Summarize your performance this cycle..."
              rows="4"
              className="w-full rounded-lg border-slate-300  bg-white  text-slate-900  focus:ring-primary focus:border-primary placeholder:text-slate-400 "
            />
          </section>

          <div className="flex flex-col md:flex-row items-center justify-end gap-4 pb-12">
            <button 
              type="button"
              onClick={handleSaveDraft}
              className="w-full md:w-auto px-8 py-3 rounded-xl border border-slate-300  text-slate-700  font-bold hover:bg-slate-50  transition-colors"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 rounded-xl bg-[#5048e5] text-white font-bold shadow-lg shadow-primary/25 hover:bg-[#5048e5]/90 transition-all flex items-center justify-center gap-2"
            >
              <span>Submit Self Review</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <Footer variant="hrSystems" />
    </form>
  );
};

export default EmployeeSelfAppraisal;
