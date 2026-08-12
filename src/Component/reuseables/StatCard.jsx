import React from "react";

const StatCard = ({ icon, title, value, subtitle, iconBg }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg || ""}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{subtitle || title}</p>
    </div>
  </div>
);

export default StatCard;
