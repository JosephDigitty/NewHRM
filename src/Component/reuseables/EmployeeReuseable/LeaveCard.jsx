import React from "react";



const LeaveCard = ({ title, used, total, icon, iconBg, iconColor }) => {
  const remaining = total - used;

  return (
    <div className="bg-white p-4 rounded-2xl shadow flex flex-col w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-sm">{title}</p>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>

      <p className="text-gray-500 text-sm">Used</p>
      <div className="flex justify-between text-sm mb-1">
        <span>{used}</span>
        <span>
          {used}/{total} days
        </span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className="bg-blue-400 h-2 rounded-full"
          style={{ width: `${(used / total) * 100}%` }}
        ></div>
      </div>

      <div className="flex justify-between mt-2 text-sm">
        <span>{remaining}</span>
        <span>Remaining</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>0</span>
        <span>Pending</span>
      </div>
    </div>
  );
};

export default LeaveCard;
