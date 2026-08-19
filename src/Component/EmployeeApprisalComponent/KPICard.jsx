import React from "react";

const KPICard = ({ kpi }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">
          Weight {kpi.weight}%
        </span>

        <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
          {kpi.status}
        </span>
      </div>

      <h4 className="font-bold text-sm mb-1">{kpi.title}</h4>
      <p className="text-xs text-slate-500 mb-4">{kpi.description}</p>

      <div className="grid grid-cols-2 gap-y-3 border-t border-slate-50 pt-3">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">
            Target
          </p>
          <p className="text-sm font-bold">{5}</p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Self</p>
          <p className="text-sm font-bold">{kpi.selfScore}</p>
        </div>

        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Supv</p>
          <p className="text-sm font-bold">{kpi.supervisorScore}</p>
        </div>

        <div>
          <p className="text-[10px] text-primary font-black uppercase">Final</p>
          <p className="text-sm font-black text-primary">
            {(kpi.selfScore + kpi.supervisorScore) / 10}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
