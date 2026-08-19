const PerformanceScoreCard = ({ performance }) => {
  if (!performance) return null;
  const { totalScore, rating, status, overallFinalComment } = performance;

  return (
    <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
      <div className="relative size-40 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-slate-100"
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            className="text-primary"
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray="440"
            strokeDashoffset="79"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black">{totalScore}</span>
          <span className="text-sm font-medium text-slate-500">out of 5</span>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-bold">Overall Performance Score</h3>

          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
            {rating}
          </span>

          <span className="px-3 py-1 bg-[#5048e5]/10 text-primary text-xs font-bold rounded-full">
            {status}
          </span>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed max-w-lg">
          {overallFinalComment}
        </p>

        <div className="pt-2">
          <div className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2">
            <span>Goal Completion Progress</span>
            <span>{(totalScore / 5) * 100}%</span>
          </div>

          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5048e5] rounded-full"
              style={{ width: `${(totalScore / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceScoreCard;
