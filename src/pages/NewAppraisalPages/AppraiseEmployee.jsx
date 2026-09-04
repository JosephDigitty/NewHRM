import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  MessageSquare,
  Star,
} from "lucide-react";

/* =========================================================
   MOCK DATA
   Later this entire object can come from your API:
   GET /api/appraisals/:id
========================================================= */

const mockEmployee = {
  id: "EMP-001",
  name: "John Doe",
  position: "Senior Associate – Corporate & Commercial",
  department: "Legal",
  appraisalPeriod: {
    id: "PERIOD-2026",
    name: "2026 Annual Appraisal",
    startDate: "1 Jan 2026",
    endDate: "31 Dec 2026",
  },
  avatar:
    "https://randomuser.me/api/portraits/men/32.jpg",
};

const mockKpis = [
  {
    id: "KPI-001",
    title: "Client Retention Rate",
    description: "Maintain and grow existing client relationships",
    weight: 25,
    target: "≥ 85%",
    achievement: "91%",
    status: "Achieved",
    selfRating: 4,
    appraiserRating: 4,
    comments: "",
  },
  {
    id: "KPI-002",
    title: "Revenue Generated",
    description: "Contribute to the firm's revenue growth",
    weight: 30,
    target: "≥ ₦50M",
    achievement: "₦57M",
    status: "Achieved",
    selfRating: 5,
    appraiserRating: 5,
    comments: "",
  },
  {
    id: "KPI-003",
    title: "Billable Hours Achieved",
    description: "Achieve target billable hours within the period",
    weight: 20,
    target: "1,800 hrs",
    achievement: "1,720 hrs",
    status: "Slightly Below",
    selfRating: 4,
    appraiserRating: 4,
    comments: "",
  },
  {
    id: "KPI-004",
    title: "Matters Successfully Concluded",
    description: "Ensure timely conclusion of assigned matters",
    weight: 25,
    target: "≥ 25",
    achievement: "27",
    status: "Achieved",
    selfRating: 5,
    appraiserRating: 4,
    comments: "",
  },
];

const mockCompetencies = [
  {
    id: "COMP-001",
    name: "Communication",
    description: "Shares information clearly and listens effectively",
    rating: 4,
    comments: "",
  },
  {
    id: "COMP-002",
    name: "Teamwork",
    description: "Works collaboratively and supports team success",
    rating: 5,
    comments: "",
  },
  {
    id: "COMP-003",
    name: "Attention to Detail",
    description: "Accurate, thorough and observes quality",
    rating: 4,
    comments: "",
  },
  {
    id: "COMP-004",
    name: "Professionalism",
    description: "Displays integrity, reliability and professionalism",
    rating: 5,
    comments: "",
  },
  {
    id: "COMP-005",
    name: "Client Relationship",
    description: "Builds and maintains strong client relationships",
    rating: 4,
    comments: "",
  },
  {
    id: "COMP-006",
    name: "Working Spirit",
    description: "Positive attitude and dedication to work",
    rating: 5,
    comments: "",
  },
  {
    id: "COMP-007",
    name: "Desire to Learn",
    description: "Seeks growth and embraces new knowledge",
    rating: 4,
    comments: "",
  },
];

/* =========================================================
   SMALL REUSABLE COMPONENTS
========================================================= */

function StarRating({
  value,
  onChange,
  readonly = false,
  size = 16,
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition ${
            readonly
              ? "cursor-default"
              : "cursor-pointer hover:scale-110"
          }`}
        >
          <Star
            size={size}
            strokeWidth={1.5}
            fill={star <= value ? "#FBBF24" : "transparent"}
            className={
              star <= value
                ? "text-amber-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

function SectionHeader({ number, title, description, badge }) {
  return (
    <div className="border-b border-gray-200 px-4 py-3.5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[14px] font-bold text-slate-900">
            {number}. {title}
          </h2>

          <p className="mt-1 text-[11px] text-slate-600">
            {description}
          </p>
        </div>

        {badge && (
          <span className="shrink-0 rounded-md bg-violet-50 px-3 py-1.5 text-[11px] font-semibold text-violet-700">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-slate-200 bg-white ${className}`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AppraiseEmployee() {
  const [kpis, setKpis] = useState(mockKpis);
  const [competencies, setCompetencies] =
    useState(mockCompetencies);

  const [overallRating, setOverallRating] =
    useState("Very Good");

  const [strengths, setStrengths] = useState(
    "Strong analytical skills, excellent client management, and consistently delivers quality work within deadlines."
  );

  const [areasForImprovement, setAreasForImprovement] =
    useState(
      "Improve time management to meet billable hour targets. Continue to take on more complex matters."
    );

  const [trainingNeeds, setTrainingNeeds] = useState(
    "Advanced contract drafting, Leadership development program."
  );

  const [recommendation, setRecommendation] =
    useState("Meets Expectations");

  const [bonusRecommendation, setBonusRecommendation] =
    useState("20% of Annual Salary");

  const [additionalComments, setAdditionalComments] =
    useState("");

  const [saving, setSaving] = useState(false);

  /* =========================================================
     SCORE CALCULATIONS
  ========================================================= */

  const kpiScore = useMemo(() => {
    return kpis.reduce((total, kpi) => {
      return total + (kpi.appraiserRating / 5) * kpi.weight;
    }, 0);
  }, [kpis]);

  const competencyScore = useMemo(() => {
    const totalWeight = competencies.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    return (
      (totalWeight / (competencies.length * 5)) * 100
    );
  }, [competencies]);

  const finalScore = useMemo(() => {
    return (
      kpiScore * 0.7 +
      competencyScore * 0.3
    );
  }, [kpiScore, competencyScore]);

  /* =========================================================
     KPI HANDLERS
  ========================================================= */

  const updateKpiRating = (id, rating) => {
    setKpis((current) =>
      current.map((kpi) =>
        kpi.id === id
          ? {
              ...kpi,
              appraiserRating: rating,
            }
          : kpi
      )
    );
  };

  const updateKpiComment = (id, comments) => {
    setKpis((current) =>
      current.map((kpi) =>
        kpi.id === id
          ? {
              ...kpi,
              comments,
            }
          : kpi
      )
    );
  };

  /* =========================================================
     COMPETENCY HANDLERS
  ========================================================= */

  const updateCompetencyRating = (id, rating) => {
    setCompetencies((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              rating,
            }
          : item
      )
    );
  };

  const updateCompetencyComment = (id, comments) => {
    setCompetencies((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              comments,
            }
          : item
      )
    );
  };

  /* =========================================================
     BACKEND READY FUNCTIONS
  ========================================================= */

  const buildPayload = () => {
    return {
      employeeId: mockEmployee.id,
      appraisalPeriodId: mockEmployee.appraisalPeriod.id,

      kpis: kpis.map((kpi) => ({
        kpiId: kpi.id,
        appraiserRating: kpi.appraiserRating,
        comments: kpi.comments,
      })),

      competencies: competencies.map((item) => ({
        competencyId: item.id,
        rating: item.rating,
        comments: item.comments,
      })),

      overallAssessment: {
        overallRating,
        finalScore: Number(finalScore.toFixed(1)),
        strengths,
        areasForImprovement,
        trainingNeeds,
        recommendation,
        bonusRecommendation,
        additionalComments,
      },
    };
  };

  const handleSaveDraft = async () => {
    setSaving(true);

    const payload = buildPayload();

    console.log("SAVE DRAFT PAYLOAD:", payload);

    // Later:
    //
    // await axios.put(
    //   `/api/appraisals/${mockEmployee.id}`,
    //   payload
    // );

    setTimeout(() => {
      setSaving(false);
      alert("Appraisal saved as draft.");
    }, 700);
  };

  const handleFinalize = async () => {
    const payload = buildPayload();

    console.log("FINALIZE APPRAISAL PAYLOAD:", payload);

    // Later:
    //
    // await axios.post(
    //   `/api/appraisals/${mockEmployee.id}/finalize`,
    //   payload
    // );

    alert(
      `Appraisal finalized with a score of ${finalScore.toFixed(
        1
      )}/100`
    );
  };

  return (
    <div className="min-h-screen bg-[#fafbfe] text-slate-900">
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="sticky top-0 z-30 h-[68px] border-b border-slate-200 bg-white">
        <div className="flex h-full items-center justify-between px-6">
          <div>
            <div className="flex items-center gap-2 text-[12px] text-slate-600">
              <span>Appraisals</span>

              <span className="text-slate-400">
                ›
              </span>

              <span className="text-slate-800">
                Appraise Employee
              </span>
            </div>

            <h1 className="mt-1 text-[23px] font-bold tracking-tight">
              Appraise Employee
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-slate-700">
              <Bell size={20} />

              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-2">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Manager"
                className="h-9 w-9 rounded-full object-cover"
              />

              <div className="hidden sm:block">
                <p className="text-[12px] font-bold">
                  Mary Manager
                </p>

                <p className="text-[10px] text-slate-500">
                  Finance Manager
                </p>
              </div>

              <ChevronDown size={15} />
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-[1280px] px-5 py-4">
        {/* BACK */}

        <button className="mb-4 flex items-center gap-2 text-[12px] font-medium text-slate-700 hover:text-violet-700">
          <ArrowLeft size={15} />
          Back to Appraisals
        </button>

        {/* =================================================
            EMPLOYEE SUMMARY + SCORE
        ================================================= */}

        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_.85fr]">
          {/* Employee */}

          <Card className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={mockEmployee.avatar}
                alt={mockEmployee.name}
                className="h-[82px] w-[82px] rounded-full border border-slate-200 object-cover"
              />

              <div>
                <h2 className="text-[18px] font-bold">
                  {mockEmployee.name}
                </h2>

                <p className="mt-1 text-[12px]">
                  {mockEmployee.position}
                </p>

                <p className="mt-1 text-[12px]">
                  Department:{" "}
                  <span className="font-medium">
                    {mockEmployee.department}
                  </span>
                </p>

                <p className="mt-2 text-[12px] font-semibold">
                  Appraisal Period:{" "}
                  <span className="font-normal text-violet-700">
                    {mockEmployee.appraisalPeriod.startDate}{" "}
                    –{" "}
                    {mockEmployee.appraisalPeriod.endDate}
                  </span>
                </p>
              </div>
            </div>
          </Card>

          {/* Overall Score */}

          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold">
                  Overall Score
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <span className="text-[30px] font-bold">
                    {finalScore.toFixed(1)}%
                  </span>

                  <span className="text-[12px] font-semibold text-violet-700">
                    {finalScore >= 85
                      ? "Excellent"
                      : finalScore >= 70
                      ? "Good"
                      : "Needs Improvement"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-violet-700 transition-all duration-300"
                style={{
                  width: `${Math.min(finalScore, 100)}%`,
                }}
              />
            </div>

            <p className="mt-2 text-[10px] text-slate-600">
              Based on KPI (70%) + Competencies (30%)
            </p>
          </Card>
        </div>

        {/* =================================================
            KPI EVALUATION
        ================================================= */}

        <Card className="mb-4">
          <SectionHeader
            number="1"
            title="KPI Evaluation"
            description="Review the employee’s performance against their approved KPIs."
            badge="KPI Weight: 70%"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="w-[40px] px-3 py-3 text-center text-[10px] font-bold">
                    #
                  </th>

                  <th className="px-3 py-3 text-left text-[10px] font-bold">
                    KPI / Goal
                  </th>

                  <th className="w-[80px] px-3 py-3 text-center text-[10px] font-bold">
                    Weight (%)
                  </th>

                  <th className="w-[120px] px-3 py-3 text-left text-[10px] font-bold">
                    Employee Target
                  </th>

                  <th className="w-[125px] px-3 py-3 text-left text-[10px] font-bold">
                    Achievement
                  </th>

                  <th className="w-[135px] px-3 py-3 text-center text-[10px] font-bold">
                    Employee Self
                    <br />
                    Assessment
                  </th>

                  <th className="w-[130px] px-3 py-3 text-center text-[10px] font-bold">
                    Appraiser
                    <br />
                    Rating
                  </th>

                  <th className="w-[100px] px-3 py-3 text-center text-[10px] font-bold">
                    Score
                    <br />
                    (Weighted)
                  </th>

                  <th className="w-[80px] px-3 py-3 text-center text-[10px] font-bold">
                    Comments
                  </th>
                </tr>
              </thead>

              <tbody>
                {kpis.map((kpi, index) => (
                  <tr
                    key={kpi.id}
                    className="border-b border-slate-200 last:border-0"
                  >
                    <td className="px-3 py-4 text-center text-[10px]">
                      {index + 1}
                    </td>

                    <td className="px-3 py-4">
                      <p className="text-[11px] font-bold">
                        {kpi.title}
                      </p>

                      <p className="mt-1 max-w-[150px] text-[10px] leading-4 text-slate-600">
                        {kpi.description}
                      </p>
                    </td>

                    <td className="px-3 py-4 text-center text-[11px]">
                      {kpi.weight}%
                    </td>

                    <td className="px-3 py-4 text-[10px]">
                      {kpi.target}
                    </td>

                    <td className="px-3 py-4">
                      <p className="text-[11px] font-semibold">
                        {kpi.achievement}
                      </p>

                      <p
                        className={`mt-1 text-[10px] ${
                          kpi.status === "Achieved"
                            ? "text-green-600"
                            : "text-orange-500"
                        }`}
                      >
                        {kpi.status}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <StarRating
                          value={kpi.selfRating}
                          readonly
                          size={15}
                        />

                        <span className="text-[10px] font-medium">
                          {kpi.selfRating}/5
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <select
                          value={kpi.appraiserRating}
                          onChange={(e) =>
                            updateKpiRating(
                              kpi.id,
                              Number(e.target.value)
                            )
                          }
                          className="h-8 w-[64px] rounded-md border border-slate-300 bg-white px-2 text-[11px] outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                        >
                          {[1, 2, 3, 4, 5].map(
                            (rating) => (
                              <option
                                key={rating}
                                value={rating}
                              >
                                {rating}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-center text-[10px] font-medium">
                      {(
                        (kpi.appraiserRating / 5) *
                        kpi.weight
                      ).toFixed(0)}
                      /{kpi.weight}
                    </td>

                    <td className="px-3 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const comment =
                            window.prompt(
                              "Enter KPI comment:",
                              kpi.comments
                            );

                          if (comment !== null) {
                            updateKpiComment(
                              kpi.id,
                              comment
                            );
                          }
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-violet-700 hover:bg-violet-50"
                      >
                        <MessageSquare size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="bg-slate-50">
                  <td
                    colSpan="2"
                    className="px-3 py-3 text-right text-[11px] font-bold"
                  >
                    Total
                  </td>

                  <td className="px-3 py-3 text-center text-[11px] font-bold">
                    100%
                  </td>

                  <td colSpan="4"></td>

                  <td className="px-3 py-3 text-center text-[11px] font-bold">
                    KPI Score
                  </td>

                  <td className="px-3 py-3 text-center text-[11px] font-bold text-violet-700">
                    {kpiScore.toFixed(0)}/100
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* =================================================
            CORE COMPETENCIES
        ================================================= */}

        <Card className="mb-4">
          <SectionHeader
            number="2"
            title="Core Competencies"
            description="Evaluate the employee’s behavioural and professional competencies."
            badge="Competency Weight: 30%"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="w-[40px] px-3 py-3 text-center text-[10px] font-bold">
                    #
                  </th>

                  <th className="w-[150px] px-3 py-3 text-left text-[10px] font-bold">
                    Competency
                  </th>

                  <th className="px-3 py-3 text-left text-[10px] font-bold">
                    Description
                  </th>

                  <th className="w-[180px] px-3 py-3 text-center text-[10px] font-bold">
                    Appraiser Rating
                  </th>

                  <th className="w-[250px] px-3 py-3 text-left text-[10px] font-bold">
                    Comments (Optional)
                  </th>
                </tr>
              </thead>

              <tbody>
                {competencies.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-200 last:border-0"
                  >
                    <td className="px-3 py-2.5 text-center text-[10px]">
                      {index + 1}
                    </td>

                    <td className="px-3 py-2.5">
                      <p className="text-[10px] font-bold">
                        {item.name}
                      </p>
                    </td>

                    <td className="px-3 py-2.5">
                      <p className="max-w-[250px] text-[10px] leading-4 text-slate-600">
                        {item.description}
                      </p>
                    </td>

                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-center gap-2">
                        <StarRating
                          value={item.rating}
                          onChange={(rating) =>
                            updateCompetencyRating(
                              item.id,
                              rating
                            )
                          }
                          size={16}
                        />

                        <span className="text-[10px] font-medium">
                          {item.rating}/5
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-2.5">
                      <input
                        type="text"
                        value={item.comments}
                        onChange={(e) =>
                          updateCompetencyComment(
                            item.id,
                            e.target.value
                          )
                        }
                        placeholder="Add comment..."
                        className="h-8 w-full rounded-md border border-slate-300 px-3 text-[10px] outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="bg-slate-50">
                  <td
                    colSpan="3"
                    className="px-3 py-3 text-right text-[11px] font-bold"
                  >
                    Competency Score
                  </td>

                  <td
                    colSpan="2"
                    className="px-3 py-3 text-right text-[11px] font-bold text-violet-700"
                  >
                    {competencyScore.toFixed(0)}/100
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* =================================================
            OVERALL ASSESSMENT
        ================================================= */}

        <Card className="mb-6">
          <SectionHeader
            number="3"
            title="Overall Assessment"
            description="Review overall performance and provide final feedback and recommendation."
          />

          <div className="p-3.5">
            {/* TOP FIELDS */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_.5fr_1fr]">
              <div>
                <label className="mb-1 block text-[10px] font-bold">
                  Overall Rating
                </label>

                <select
                  value={overallRating}
                  onChange={(e) =>
                    setOverallRating(e.target.value)
                  }
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-[11px] outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option>Outstanding</option>
                  <option>Excellent</option>
                  <option>Very Good</option>
                  <option>Good</option>
                  <option>Needs Improvement</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold">
                  Final Score
                </label>

                <div className="flex h-9 items-center rounded-md border border-slate-200 bg-violet-50 px-3 text-[12px] font-bold text-violet-800">
                  {finalScore.toFixed(1)} / 100
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-[10px] font-bold">
                  Performance Summary
                </p>

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between">
                    <span>KPI Score (70%)</span>
                    <span className="font-semibold">
                      {kpiScore.toFixed(0)}/100
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Competency Score (30%)</span>
                    <span className="font-semibold">
                      {competencyScore.toFixed(0)}/100
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-slate-200 pt-1.5">
                    <span className="font-bold">
                      Final Score
                    </span>

                    <span className="font-bold text-violet-700">
                      {finalScore.toFixed(1)}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TEXT AREAS */}

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-bold">
                  Strengths
                </label>

                <div className="relative">
                  <textarea
                    value={strengths}
                    onChange={(e) =>
                      setStrengths(e.target.value)
                    }
                    maxLength={500}
                    rows={3}
                    className="w-full resize-none rounded-md border border-slate-300 p-2.5 pb-6 text-[10px] leading-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />

                  <span className="absolute bottom-1.5 right-2 text-[9px] text-slate-500">
                    {strengths.length}/500
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold">
                  Areas for Improvement
                </label>

                <div className="relative">
                  <textarea
                    value={areasForImprovement}
                    onChange={(e) =>
                      setAreasForImprovement(
                        e.target.value
                      )
                    }
                    maxLength={500}
                    rows={3}
                    className="w-full resize-none rounded-md border border-slate-300 p-2.5 pb-6 text-[10px] leading-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />

                  <span className="absolute bottom-1.5 right-2 text-[9px] text-slate-500">
                    {areasForImprovement.length}/500
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold">
                  Training & Development Needs
                </label>

                <div className="relative">
                  <textarea
                    value={trainingNeeds}
                    onChange={(e) =>
                      setTrainingNeeds(e.target.value)
                    }
                    maxLength={500}
                    rows={2}
                    className="w-full resize-none rounded-md border border-slate-300 p-2.5 pb-6 text-[10px] leading-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />

                  <span className="absolute bottom-1.5 right-2 text-[9px] text-slate-500">
                    {trainingNeeds.length}/500
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold">
                  Bonus Recommendation
                </label>

                <select
                  value={bonusRecommendation}
                  onChange={(e) =>
                    setBonusRecommendation(e.target.value)
                  }
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-[10px] outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option>None</option>
                  <option>5% of Annual Salary</option>
                  <option>10% of Annual Salary</option>
                  <option>15% of Annual Salary</option>
                  <option>20% of Annual Salary</option>
                  <option>25% of Annual Salary</option>
                </select>

                <label className="mb-1 mt-3 block text-[10px] font-bold">
                  Additional Comments (Optional)
                </label>

                <textarea
                  value={additionalComments}
                  onChange={(e) =>
                    setAdditionalComments(
                      e.target.value
                    )
                  }
                  maxLength={500}
                  rows={2}
                  placeholder="Add any additional comments..."
                  className="w-full resize-none rounded-md border border-slate-300 p-2.5 text-[10px] outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold">
                  Overall Recommendation
                </label>

                <select
                  value={recommendation}
                  onChange={(e) =>
                    setRecommendation(e.target.value)
                  }
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-[10px] outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option>Exceeds Expectations</option>
                  <option>Meets Expectations</option>
                  <option>Partially Meets Expectations</option>
                  <option>Does Not Meet Expectations</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="flex justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="rounded-md border border-slate-300 bg-white px-6 py-2.5 text-[11px] font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save as Draft"}
          </button>

          <button
            type="button"
            onClick={handleFinalize}
            className="rounded-md bg-violet-700 px-7 py-2.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-violet-800"
          >
            Finalize Appraisal
          </button>
        </div>
      </main>
    </div>
  );
}