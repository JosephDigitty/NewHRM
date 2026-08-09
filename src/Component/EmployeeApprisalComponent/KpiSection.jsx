
import KPICard from "./KPICard";

const KPISection = ({ activeKpi = [] }) => {
  
  return (
    <div className="mb-8">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          KPI Breakdown
        </h2>

        <span className="text-sm text-slate-500">
          {activeKpi.length} Key Performance Indicators
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeKpi.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </div>
  );
};

export default KPISection;