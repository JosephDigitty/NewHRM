import DonutChart from "../Charts/DonutChart";


const colors = ["#3B82F6", "#FACC15", "#94A3B8"];

const ProjectSummary = ({ chartData }) => {
  return (
    <div className="bg-white p-4  rounded-xl shadow">
      <p className="font-semibold mb-2">All projects</p>

      <DonutChart data={chartData} colors={colors} />

      <div className="text-sm mt-4 space-y-2">
        <Legend color="bg-blue-500" text="Completed" />
        <Legend color="bg-yellow-400" text="Pending" />
        <Legend color="bg-gray-400" text="Not started" />
      </div>
    </div>
  );
};

const Legend = ({ color, text }) => (
  <p>
    <span className={`inline-block h-3 w-3 rounded-full mr-2 ${color}`} />
    {text}
  </p>
);

export default ProjectSummary;
