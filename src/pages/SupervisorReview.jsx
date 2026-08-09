import React, { useEffect, useState } from "react";
import {
  FileText,
  Save,
  CheckCircle2,
  Briefcase,
  Calendar,
  History,
  User,
  MessageSquare,
} from "lucide-react";
import Footer from "../Component/reuseables/Footer";
import { api } from "../api/request";
import { useParams } from "react-router-dom";

const SupervisorReview = () => {
  const {id} = useParams()
  const [formData, setFormData] = useState({
    kpis: [],
    overallFeedback: ""
  });
  useEffect(() => {
    const getKpiGoal = async () => {
      try {
        const res = await api.get(`/appraisal/employeeKpis/${id}`);
        if (res.data.success) {
          setFormData({
          kpis: res.data.appraisals.kpis.map(kpi => ({
            ...kpi,
            supervisorScore: kpi.supervisorScore || "",
            supervisorComment: kpi.supervisorComment || ""
          })),
          overallFeedback: res.data.appraisals.overallFinalComment,
          _id: res.data.appraisals._id
        });
          console.log(res.data)
        } else {
          console.log(res.data);
        }
      } catch (error) {
        alert(error);
      }
    };
    getKpiGoal();
  }, [id]);


 
  const [overallImprovements, setOverallImprovements] = useState(
    "Could improve cross-departmental communication during large scale project planning phases.",
  );

  const handleKpiScoreChange = (kpiId, score) => {
    setFormData(prev => ({
      ...prev,
      kpis: prev.kpis.map((kpi) =>
        kpi._id === kpiId ? { ...kpi, supervisorScore: score } : kpi
      )
    }));
  };

  const handleKpiCommentChange = (kpiId, comment) => {
    setFormData(prev => ({
      ...prev,
      kpis: prev.kpis.map((kpi) =>
        kpi._id === kpiId ? { ...kpi, supervisorComment: comment } : kpi
      )
    }));
  };

      const handleSubmit = async (e) => {
      e.preventDefault();

      // Guard: all KPIs must be scored
      const unscored = formData.kpis.filter(kpi => !kpi.supervisorScore);
      if (unscored.length > 0) {
        alert(`Please score all ${unscored.length} remaining KPI(s) before submitting.`);
        return;
      }

      const scores = formData.kpis.map((kpi) => ({
        kpiId: kpi._id,
        supervisorScore: Number(kpi.supervisorScore),
        supervisorComment: kpi.supervisorComment || ""  // 👈 fallback
      }));

      const payload = {
        scores,
        overallFeedback: formData.overallFeedback,
        supervisorImprovements: overallImprovements,
        appraisalId: formData._id,
      };

      try {
        const res = await api.post(`/appraisal/supervisorappraisal/${id}`, payload);
        if (res.data.success) {
          alert("Operation successful");
        } else {
          alert(res.data.message || "Submission failed");
        }
      } catch (error) {
        alert(error);
      }
    };

  const calculateAverageScore = () => {
    if (!formData.kpis.length) return 0; 
    const total = formData.kpis.reduce((sum, kpi) => sum + (kpi.supervisorScore || 0), 0);
    return (total / formData.kpis.length).toFixed(1);
  };
  const calculateEmployeeAvgScore = () => {
  if (!formData.kpis.length) return 0;
  const total = formData.kpis.reduce((sum, kpi) => sum + (kpi.selfScore || 0), 0);
  return (total / formData.kpis.length).toFixed(1);
  }

  const calculateFinalAvgScore = () => {
  const empAvg = parseFloat(calculateEmployeeAvgScore());
  const supAvg = parseFloat(calculateSupervisorAvgScore());
  return ((empAvg + supAvg) / 2).toFixed(1);
  }
 
  const calculateSupervisorAvgScore = () => {
  if (!formData.kpis.length) return 0;
  const total = formData.kpis.reduce((sum, kpi) => sum + (kpi.supervisorScore || 0), 0);
  return (total / formData.kpis.length).toFixed(1);
}

  const getRating = (score) => {
    if (score >= 4.5) return "Outstanding";
    if (score >= 4.0) return "Very Good";
    if (score >= 3.0) return "Good";
    if (score >= 2.0) return "Average";
    return "Poor";
  };

  const averageScore = parseFloat(calculateAverageScore());
  const employeeAvgScore = parseFloat(calculateEmployeeAvgScore());
  const supervisorAvgScore = parseFloat(calculateSupervisorAvgScore());
  const finalAvgScore = parseFloat(calculateFinalAvgScore());
  const rating = getRating(averageScore);

  return (
    <form onSubmit={handleSubmit} className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light  font-display text-slate-900 antialiased">
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 p-4 md:p-8">
        {/* Employee Summary Info */}
        <div className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-sm border border-primary/5">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              <div
                className="h-24 w-24 rounded-full bg-cover bg-center border-2 border-primary/20"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDAVaqdv5IXEL6-rv_dNjo2TwJDrKJPSis7_fciHhH4lWVwH0zpUpp779gfNcQglru_AHSI7r-QjrqnsDiBPLGpaDSYtxvJEY5bTZKOXUlEFsPBRRZZw2lCx2NhyfHuAiFzvOOSAy4KyFK0JC920E4N3PpPzL-pJGC-EKwfQBQ2I_bIjjibabgrP1AqUSeMboaG37p3oBdTSAL_txk3C4GDN76dwhKww-4XY-h8CRjmly5ZCfEdD5nZzYTrWzNpg9rBBDhva-bcYwE")',
                }}
              ></div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Alex Johnson
                  </h1>
                  <span className="rounded-full bg-[#5048e5]/10 px-3 py-0.5 text-xs font-medium text-primary uppercase tracking-wider">
                    Active Review
                  </span>
                </div>
                <p className="text-slate-500 font-medium">
                  Senior Software Engineer
                </p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-5 h-5" />
                    Engineering
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-5 h-5" />
                    Q3 2023 Review
                  </span>
                  <span className="flex items-center gap-1.5">
                    <History className="w-5 h-5" />
                    Last Review: 4.2 (Good)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto">
              <button className="flex items-center gap-2 rounded-lg border border-primary/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-[#5048e5]/5 transition-colors">
                <FileText className="w-5 h-5" />
                Job Description
              </button>
            </div>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-primary/10 bg-[#5048e5]/5 p-4">
              <p className="text-sm font-medium text-slate-500">
                Employee Self-Score
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {employeeAvgScore}
                <span className="text-sm font-normal text-slate-400">
                  / 5.0
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-primary/10 bg-[#5048e5]/5 p-4">
              <p className="text-sm font-medium text-slate-500">
                Manager Calc. Score
              </p>
              <p className="mt-1 text-2xl font-bold text-primary">
                {supervisorAvgScore}{" "}
                <span className="text-sm font-normal text-slate-400">
                  / 5.0
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-primary/10 bg-[#5048e5]/5 p-4">
              <p className="text-sm font-medium text-slate-500">
                Auto-Final Score
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900 ">
                {finalAvgScore}
                <span className="text-sm font-normal text-slate-400">
                  / 5.0
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-[#5048e5] text-white p-4 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
                Current Rating
              </p>
              <p className="text-xl font-bold">{rating}</p>
            </div>
          </div>
        </div>

        {/* KPI Comparison Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold">Key Performance Indicators</h3>
            <span className="text-xs text-slate-500">
              Weightage based evaluation
            </span>
          </div>

          {formData.kpis.map((kpi, index) => (
            <div
              key={kpi._id}
              className="flex flex-col gap-4 rounded-xl bg-white  p-6 shadow-sm border border-primary/5"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5048e5]/10 text-[12px] font-bold text-primary">
                      {index + 1}
                    </span>
                    <h4 className="font-bold text-slate-800 ">
                      {kpi.title}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-500">{kpi.description}</p>
                  <div className="mt-4 rounded-lg bg-slate-50  p-4 border-l-4 border-slate-300">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-2">
                      Self-Assessment
                    </p>
                    <p className="text-sm font-semibold text-slate-700 mb-1">
                      Score: {kpi.selfScore}/5
                    </p>
                    <p className="text-sm italic text-slate-600 ">
                      "{kpi.selfComment}"
                    </p>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-primary mb-2">
                        Supervisor Score (1-5)
                      </label>
                      <select
                        className="w-full rounded-lg border-primary/20 bg-white text-sm focus:border-primary focus:ring-primary"
                        value={kpi.supervisorScore}
                        onChange={(e) => {   
                        const val = e.target.value;
                        handleKpiScoreChange(kpi._id, val === "" ? "" : parseInt(val));
                        }}
                      >
                        <option value="">Select Score</option>
                        <option value={1}>1 - Poor</option>
                        <option value={2}>2 - Average</option>
                        <option value={3}>3 - Good</option>
                        <option value={4}>4 - Very Good</option>
                        <option value={5}>5 - Outstanding</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-primary mb-2">
                        Supervisor Comments
                      </label>
                      <textarea
                        className="w-full rounded-lg border-primary/20 bg-white  text-sm focus:border-primary focus:ring-primary"
                        placeholder="Provide specific feedback on this KPI..."
                        rows="3"
                        value={kpi.supervisorComment}
                        onChange={(e) =>
                          handleKpiCommentChange(kpi._id, e.target.value)
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Overall Review Summary */}
         <div className="rounded-xl bg-white p-6 shadow-sm border border-primary/5">
          <h3 className="mb-4 text-lg font-bold">
            Overall Performance Summary
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Surbordinate Comments 
                </label>
                <p
                  className="w-full rounded-lg border-primary/20 bg-white  text-sm focus:border-primary focus:ring-primary"
                >
                  {formData.overallFeedback}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Areas for Improvement
                </label>
                <textarea
                  className="w-full rounded-lg border-primary/20 bg-white text-sm focus:border-primary focus:ring-primary"
                  placeholder="Where can the employee grow?"
                  rows="4"
                  value={overallImprovements}
                  onChange={(e) => setOverallImprovements(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Final Action Bar */}
        <div className="flex flex-col gap-4 rounded-xl bg-slate-900 p-6 text-white shadow-lg md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium opacity-70">Review Summary</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{rating} Performance</span>
              <span className="h-2 w-2 rounded-full bg-green-400"></span>
              <span className="text-lg font-semibold text-primary-200">
                Score: {averageScore}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button"
             className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-sm font-bold transition-all hover:bg-white/20 md:flex-none">
              <Save className="w-5 h-5" />
              Save Draft
            </button>
            <button  type="submit"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#5048e5] px-8 py-3 text-sm font-bold shadow-lg transition-all hover:brightness-110 md:flex-none">
              <CheckCircle2 className="w-5 h-5" />
              Complete Appraisal
            </button>
          </div>
        </div>
      </main>

      <Footer variant="talentPulse" />
    </form>
  );
};

export default SupervisorReview;
