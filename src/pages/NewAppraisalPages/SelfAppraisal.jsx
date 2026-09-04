import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../api/request";
import { useParams } from "react-router-dom";


const mockAppraisalPeriod = {
  id: "2026-annual",
  name: "2026 Annual Appraisal",
  startDate: "1 Jan 2026",
  endDate: "31 Dec 2026",
};


const ratingLabels = {
  5: "Exceeds Expectations",
  4: "Meets Expectations",
  3: "Needs Improvement",
  2: "Below Expectations",
  1: "Far Below Expectations",
};

function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-lg transition-transform hover:scale-110 ${
            star <= value
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
          aria-label={`Rate ${star} out of 5`}
        >
          <i
            className={
              star <= value
                ? "fa-solid fa-star"
                : "fa-regular fa-star"
            }
          />
        </button>
      ))}
    </div>
  );
}

function RatingSelect({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none transition focus:border-[#4f35a3] focus:ring-2 focus:ring-[#4f35a3]/10"
      >
        <option value="">Select rating</option>
        {[5, 4, 3, 2, 1].map((rating) => (
          <option key={rating} value={rating}>
            {rating}/5 — {ratingLabels[rating]}
          </option>
        ))}
      </select>

      <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500" />
    </div>
  );
}

export default function SelfAppraisal() {

  const [period, setPeriod] = useState("");
  const [kpis, setKpis] = useState([]);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appraisal, setAppraisal] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {id} = useParams()
 useEffect(() => {
  const getKpi = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/appraisal/employeeKpis/${id}`);

      console.log("APPRAISAL:", res.data);

      if (res.data?.success) {
        const data = res.data.appraisals;

        if (!data) {
          setError("Appraisal not found.");
          return;
        }

        setAppraisal(data);
        setPeriod(data?.cycle?.cycleName)

        // Backend KPI definitions + local form fields
        const normalizedKpis = (data.kpis || []).map((kpi) => ({
          ...kpi,
          id: kpi._id,

          // Employee input fields
          achievement: "",
          rating: "",
          comments: "",
        }));

        setKpis(normalizedKpis);
      }
    } catch (error) {
      console.error("Failed to fetch appraisal:", error);
      setError("Unable to load appraisal.");
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    getKpi();
  }
}, [id]);

const employee = {
  name:
    appraisal?.supervisor?.personal?.fullname ||
    "Employee",

  position:
    appraisal?.employee?.job?.position ||
    appraisal?.employee?.job?.jobTitle ||
    "",
  
  avatar:
    appraisal?.employee?.personal?.profilePicture ||
    appraisal?.employee?.personal?.avatar ||
    null,
};

  const completedKPIs = useMemo(() => {
  return kpis.filter(
    (kpi) =>
      kpi.actualAchievement?.trim() !== "" &&
      kpi.selfScore !== "" &&
      kpi.selfScore !== null &&
      kpi.selfScore !== undefined
  ).length;
  }, [kpis]);

  const progress =
  kpis.length > 0
    ? Math.round((completedKPIs / kpis.length) * 100)
    : 0;

  const totalWeight = kpis.reduce(
    (total, kpi) => total + kpi.weight,
    0
  );

  const updateKPI = (id, field, value) => {
  setKpis((current) =>
    current.map((kpi) =>
      kpi.id === id
        ? { ...kpi, [field]: value }
        : kpi
    )
  );
};

  const handleSubmit = async () => {
  const incomplete = kpis.filter(
    (kpi) =>
      !kpi.actualAchievement?.trim() ||
      !kpi.selfScore
  );

  if (incomplete.length > 0) {
    alert(
      "Please complete all KPI achievements and ratings before submitting."
    );
    return;
  }

  try {
    setIsSubmitting(true);

    const payload = {
      appraisalId: appraisal._id,

      scores: kpis.map((kpi) => ({
        kpiId: kpi._id,
        actualAchievement: kpi.actualAchievement,
        selfScore: Number(kpi.selfScore),
        selfComment: kpi.selfComment || "",
      })),

      actualAchievement: kpis.map((kpi) => ({
        kpiId: kpi._id,
        actualAchievement: kpi.actualAchievement,
      })),
    };

    console.log("SUBMIT SELF APPRAISAL:", payload);

    const res = await api.post(
      `/appraisal/selfappraisal/${id}`,
      payload
    );

    console.log("SUBMIT RESPONSE:", res.data);

    if (res.data?.success) {
      alert("Self appraisal submitted successfully.");

      setAppraisal(res.data.appraisal);

      // Optional: redirect after successful submission
      // navigate("/appraisal-dashboard/my-appraisals");
    }
  } catch (error) {
    console.error("Failed to submit self appraisal:", error);

    alert(
      error.response?.data?.message ||
      "Failed to submit self appraisal."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1c1b1f] font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#c9c5d0] bg-white px-5 md:px-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">
            Appraisals
          </span>

          <i className="fa-solid fa-chevron-right text-[10px] text-gray-400" />

          <span className="font-medium">
            Self Appraisal
          </span>
        </div>

        <div className="flex items-center gap-5">
          {/* Notification */}
          <button
            type="button"
            className="relative text-gray-500 transition hover:text-[#4f35a3]"
          >
            <i className="fa-regular fa-bell text-xl" />

            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-red-500 text-[9px] font-bold text-white">
              3
            </span>
          </button>

          {/* Employee */}
          <div className="hidden items-center gap-3 sm:flex">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="h-10 w-10 rounded-full border border-gray-200 object-cover"
            />

            <div>
              <p className="text-sm font-semibold">
                {employee.name}
              </p>

              <p className="text-xs text-gray-500">
                {employee.position}
              </p>
            </div>

            <i className="fa-solid fa-chevron-down text-xs text-gray-400" />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-[1500px]">
          {/* PAGE HEADER */}
          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div>
              <h1 className="mb-2 text-3xl font-bold">
                Self Appraisal
              </h1>

              <p className="text-sm text-gray-500 md:text-base">
                Evaluate your performance against your
                approved KPIs for the appraisal period.
              </p>
            </div>

            {/* PROGRESS */}
            <div className="w-full rounded-2xl border border-[#c9c5d0] bg-white p-5 shadow-sm lg:w-80">
              <h3 className="mb-3 text-sm font-semibold">
                Self Appraisal Progress
              </h3>

              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-4xl font-bold">
                  {progress}%
                </span>
              </div>

              <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-[#f3f4f5]">
                <div
                  className="h-full rounded-full bg-[#4f35a3] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm text-gray-500">
                {completedKPIs} of {kpis.length} KPIs
                completed
              </p>
            </div>
          </div>

          {/* MAIN LAYOUT */}
          <div className="flex flex-col gap-6 xl:flex-row">
            {/* LEFT */}
            <div className="min-w-0 flex-1 space-y-6">
              {/* APPRAISAL PERIOD */}
              <div className="flex items-center gap-4 rounded-2xl border border-[#c9c5d0] bg-white p-5 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f4f2fb] text-xl text-[#4f35a3]">
                  <i className="fa-regular fa-calendar-check" />
                </div>

                <div>
                  <h4 className="text-base font-semibold">
                    Appraisal Period
                  </h4>

                  <p className="text-sm text-gray-500">
                    {appraisal?.cycle?.cycleName}
                  </p>
                </div>
              </div>

              {/* KPI CARD */}
              <div className="overflow-hidden rounded-2xl border border-[#c9c5d0] bg-white shadow-sm">
                {/* TITLE */}
                <div className="flex flex-col justify-between gap-4 border-b border-[#c9c5d0] p-5 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-lg font-bold">
                      KPI Self Assessment
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Review your approved KPIs and assess
                      your achievement. Provide accurate
                      ratings and comments.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowGuidelines(!showGuidelines)
                    }
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d0c3eb] bg-[#f4f2fb] px-4 py-2 text-sm font-medium text-[#4f35a3] transition hover:bg-[#e7e2f5]"
                  >
                    <i className="fa-regular fa-circle-info" />
                    Guidelines
                  </button>
                </div>

                {/* GUIDELINES */}
                {showGuidelines && (
                  <div className="border-b border-[#d0c3eb] bg-[#f4f2fb] px-5 py-4">
                    <div className="flex gap-3">
                      <i className="fa-regular fa-circle-info mt-0.5 text-[#4f35a3]" />

                      <div>
                        <p className="text-sm font-semibold text-[#392170]">
                          Self-appraisal guidelines
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Enter measurable achievements
                          against each KPI and select a
                          rating that accurately reflects
                          your performance.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1150px] text-left text-sm">
                    <thead className="border-b border-[#c9c5d0] bg-[#f3f4f5]">
                      <tr>
                        <th className="w-12 px-5 py-4">
                          #
                        </th>

                        <th className="min-w-[220px] px-5 py-4">
                          KPI / Goal
                        </th>

                        <th className="w-24 px-5 py-4">
                          Weight
                        </th>

                        <th className="w-32 px-5 py-4">
                          Target
                        </th>

                        <th className="min-w-[200px] px-5 py-4">
                          Your Achievement
                        </th>

                        <th className="min-w-[210px] px-5 py-4">
                          Self Rating
                        </th>

                        <th className="min-w-[260px] px-5 py-4">
                          Comments
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#c9c5d0]">
                      {kpis.map((kpi, index) => (
                        <tr
                          key={kpi.id}
                          className="transition hover:bg-gray-50"
                        >
                          {/* NUMBER */}
                          <td className="px-5 py-6 align-top font-medium text-gray-500">
                            {index + 1}
                          </td>

                          {/* KPI */}
                          <td className="px-5 py-6 align-top">
                            <p className="mb-1 font-bold">
                              {kpi.title}
                            </p>

                            <p className="text-xs leading-relaxed text-gray-500">
                              {kpi.description}
                            </p>
                          </td>

                          {/* WEIGHT */}
                          <td className="px-5 py-6 align-top font-medium">
                            {kpi.weight}%
                          </td>

                          {/* TARGET */}
                          <td className="px-5 py-6 align-top text-gray-500">
                            {kpi.target}
                          </td>

                          {/* ACHIEVEMENT */}
                          <td className="px-5 py-6 align-top">
                            <label className="mb-1 block text-xs font-semibold">
                              Actual Achievement{" "}
                              <span className="text-red-500">
                                *
                              </span>
                            </label>

                            <input
                              type="text"
                               value={kpi.actualAchievement}
                              onChange={(e) =>
                                updateKPI(
                                  kpi.id,
                                  "actualAchievement",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#4f35a3] focus:ring-2 focus:ring-[#4f35a3]/10"
                            />

                            <p className="mt-1.5 text-[11px] text-gray-500">
                              {kpi.achievementHint}
                            </p>
                          </td>

                          {/* RATING */}
                          <td className="px-5 py-6 align-top">
                            <label className="mb-1 block text-xs font-semibold">
                              Your Rating{" "}
                              <span className="text-red-500">
                                *
                              </span>
                            </label>

                            <div className="rounded-xl border border-gray-300 bg-white p-2.5">
                              <div className="mb-2 flex items-center justify-between">
                                <StarRating
                                  value={kpi.rating}
                                  onChange={(value) =>
                                    updateKPI(
                                      kpi.id,
                                      "rating",
                                      value
                                    )
                                  }
                                />

                                <span className="ml-2 text-sm font-medium">
                                  {kpi.rating
                                    ? `${kpi.rating}/5`
                                    : "—"}
                                </span>
                              </div>

                              <RatingSelect
                                value={kpi.selfScore}
                                onChange={(value) =>
                                  updateKPI(
                                    kpi.id,
                                    "selfScore",
                                    value
                                  )
                                }
                              />
                            </div>
                          </td>

                          {/* COMMENTS */}
                          <td className="px-5 py-6 align-top">
                            <label className="mb-1 block text-xs font-semibold">
                              Your Comments{" "}
                              <span className="font-normal text-gray-400">
                                (Optional)
                              </span>
                            </label>

                            <textarea
                              rows={3}
                              maxLength={500}
                              value={kpi.selfComment}
                              onChange={(e) =>
                                updateKPI(
                                  kpi.id,
                                  "selfComment",
                                  e.target.value
                                )
                              }
                              className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#4f35a3] focus:ring-2 focus:ring-[#4f35a3]/10"
                            />

                            <div className="mt-1 text-right text-[11px] text-gray-500">
                              {kpi.selfComment}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col gap-4 border-t border-[#c9c5d0] bg-[#f3f4f5] p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-8 text-sm">
                    <span className="font-bold">
                      Total Weight
                    </span>

                    <span className="font-bold">
                      {totalWeight}%
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                    <div className="flex items-start text-xs text-gray-500">
                      <i className="fa-regular fa-circle-info mr-2 mt-0.5 text-[#4f35a3]" />

                      <span>
                        Once submitted, your appraisal
                        will be sent to your manager for
                        review.
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4f35a3] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#462788] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-paper-plane" />
                          Submit Self Appraisal
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="w-full shrink-0 space-y-6 xl:w-80">
              {/* ABOUT */}
              <div className="rounded-2xl border border-[#c9c5d0] bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-base font-bold">
                  About Self Appraisal
                </h3>

                <p className="mb-4 text-sm leading-relaxed text-gray-500">
                  This is your opportunity to reflect
                  on your performance and achievements
                  during the appraisal period.
                </p>

                <p className="mb-3 text-sm font-semibold">
                  Please ensure that:
                </p>

                <ul className="space-y-3 text-sm text-gray-500">
                  {[
                    "Your achievements are accurate and measurable.",
                    "Your ratings are based on your actual performance.",
                    "Your comments provide context and examples.",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3"
                    >
                      <i className="fa-regular fa-circle-check mt-1 shrink-0 text-[#4f35a3]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* RATING GUIDE */}
              <div className="rounded-2xl border border-[#c9c5d0] bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-base font-bold">
                  Rating Guide
                </h3>

                <ul className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <li
                      key={rating}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="w-4 text-center font-bold">
                        {rating}
                      </span>

                      <div className="flex w-20 justify-center gap-0.5 text-xs">
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <i
                              key={star}
                              className={
                                star <= rating
                                  ? "fa-solid fa-star text-yellow-400"
                                  : "fa-regular fa-star text-gray-300"
                              }
                            />
                          )
                        )}
                      </div>

                      <span className="w-32 text-right text-xs text-gray-500">
                        {ratingLabels[rating]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* HELP */}
              <div className="rounded-2xl border border-[#c9c5d0] bg-white p-5 shadow-sm">
                <h3 className="mb-2 text-base font-bold">
                  Need Help?
                </h3>

                <p className="mb-4 text-sm leading-relaxed text-gray-500">
                  If you have any questions, please
                  contact HR or your manager.
                </p>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#4f35a3] transition hover:bg-gray-50"
                >
                  <i className="fa-regular fa-envelope" />
                  Contact HR
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}