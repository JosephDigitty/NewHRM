import React from "react";

const SummaryCards = ({ icon, title, value, subtitle, iconBg, iconColor }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
        {icon}
      </div>

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-xl font-bold">{value}</h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>

    </div>
  );
};

export default SummaryCards;
