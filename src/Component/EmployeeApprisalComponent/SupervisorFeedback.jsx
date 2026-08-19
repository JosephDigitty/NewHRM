import React from "react";
import { MessageSquare, CheckCircle2, TrendingUp } from "lucide-react";

const SupervisorFeedback = ({ feedback }) => {
  const { message, strengths, development } = feedback;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <MessageSquare className="text-primary" />
        Culture & Collective Success
      </h3>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-lg italic text-sm text-slate-600 border-l-4 border-primary">
          "Coming together is a beginning, staying together is progress, and
          working together is success." — Henry Ford
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
              Strengths
            </p>

            <ul className="text-xs space-y-1 text-slate-700">
              {strengths.map((item, index) => (
                <li key={index} className="flex items-center gap-1">
                  <CheckCircle2 className="text-purple-500 text-sm" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
              Development
            </p>

            <ul className="text-xs space-y-1 text-slate-700">
              {development.map((item, index) => (
                <li key={index} className="flex items-center gap-1">
                  <TrendingUp className="text-amber-500 text-sm" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorFeedback;
