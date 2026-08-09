import { ArrowRight } from "lucide-react";
import React from "react";

const MemberRow = ({ member, selected, onToggle }) => {
  const statusColor = {
    available: "green",
    medium: "yellow",
    overloaded: "red",
  }[member.status];

  return (
    <div
      onClick={onToggle}
      className={`group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 transition-colors cursor-pointer border-l-4 ${
        selected
          ? "bg-[#70c6ff]/5 hover:bg-[#70c6ff]/10 border-[#70c6ff]"
          : "hover:bg-gray-50 border-transparent"
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="form-checkbox size-5 rounded border-gray-300 text-[#70c6ff] focus:ring-[#70c6ff]"
        />

        <div
          className="size-12 rounded-full bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url(${member.avatar})` }}
        />

        <div className="flex flex-col">
          <h4 className="text-base font-medium text-[#101518]">
            {member.name}
          </h4>
          <p className="text-sm text-slate-500">{member.role}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 sm:justify-end w-full sm:w-auto pl-9 sm:pl-0">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full bg-${statusColor}-100 text-${statusColor}-700 border border-${statusColor}-200`}
        >
          <div className={`size-2 rounded-full bg-${statusColor}-500`} />
          <span className="text-xs font-semibold capitalize">
            {member.status === "medium" ? "Medium Load" : member.status}
          </span>
        </div>

        <button className="flex items-center gap-1 text-sm font-medium text-[#70c6ff] hover:text-blue-400 transition-colors group/link">
          <span>View Performance</span>
          <ArrowRight className="text-[16px] group-hover/link:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default MemberRow;
