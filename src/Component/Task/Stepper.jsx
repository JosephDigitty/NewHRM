import React from "react";
import { Check } from "lucide-react";

const Stepper = ({ step }) => {
  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

      <div className="relative z-10 flex justify-between">
        <Step
          index={1}
          active={step === 1}
          completed={step > 1}
          label="Task Details"
        />
        <Step
          index={2}
          active={step === 2}
          completed={step > 2}
          label="Assignee & Metrics"
        />
        <Step index={3} active={step === 3} label="Review" />
      </div>
    </div>
  );
};

function Step({ index, active, completed, label }) {
  const base =
    "w-10 h-10 rounded-full flex items-center justify-center font-semibold";

  const styles = completed
    ? "bg-[#70c6ff] text-white"
    : active
      ? "bg-[#70c6ff] text-white ring-4 ring-[#70c6ff]/30"
      : "bg-white border-2 border-slate-200 text-slate-400";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${base} ${styles}`}>
        {completed ? <Check className="w-4 h-4" strokeWidth={3} /> : index}
      </div>

      <span
        className={`text-sm font-medium ${
          active || completed ? "text-[#70c6ff]" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default Stepper;
