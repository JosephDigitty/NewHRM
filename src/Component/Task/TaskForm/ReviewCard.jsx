import React from "react";

const ReviewCard = ({ title, Icon, action, children }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-text-[#70c6ff] flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-[#70c6ff]" />}
          {title}
        </h3>
        {action}
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
};

export default ReviewCard;
