import MiniBar from "../Charts/MiniBar";


const StatCard = ({ title, value, chartData }) => {
  return (
    <div className="bg-white w-full h-full p-4 rounded-xl shadow flex flex-col gap-3">
      <p className="text-sm text-gray-500">{title}</p>
      <h1 className="text-2xl font-bold">{value}</h1>
      <div className="h-12">
        <MiniBar data={chartData} />
      </div>
    </div>
  );
};

export default StatCard;
