import React from "react";

const ApprovalWorkflowTab = ({ steps }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="relative">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-6 relative">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.status === "completed"
                    ? "bg-green-100 text-green-700 border-2 border-green-500"
                    : step.status === "current"
                    ? "bg-orange-100 text-orange-700 border-2 border-orange-500"
                    : "bg-gray-100 text-gray-400 border-2 border-gray-300"
                }`}
              >
                {step.status === "completed" ? "✓" : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-0.5 flex-1 min-h-[60px] ${
                    step.status === "completed" ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
            <div className="pb-8 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{step.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Actor: {step.actor}</p>
                </div>
                {step.date && (
                  <span className="text-xs text-gray-500 whitespace-nowrap">{step.date}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalWorkflowTab;
