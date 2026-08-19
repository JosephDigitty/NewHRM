const StatCard = ({ title, value, change, changeType, subtext, link }) => {
  const changeColor =
    changeType === "positive"
      ? "bg-purple-100 text-purple-600"
      : "bg-red-100 text-red-600";

  return (
    <div className="bg-white rounded-lg shadow-sm border  border-gray-200 p-4 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-xs text-gray-500">{title}</span>
        <span
          className={`text-[10px] px-2 py-[2px] rounded-full font-medium ${changeColor} `}
        >
          {change}
        </span>
      </div>

      <p className="text-2xl font-bold mt-1">{value}</p>

      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}

      {link && (
        <a href={link} className="text-xs text-blue-500 mt-1 hover:underline">
          View details
        </a>
      )}
    </div>
  );
};

export default StatCard;
