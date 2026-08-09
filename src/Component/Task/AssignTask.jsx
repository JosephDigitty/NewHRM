import React, { useState } from "react";
import MembersList from "./TaskForm/MembersList";
import { ArrowRight, Filter, SortAsc } from "lucide-react";
import Stepper from "./Stepper";

const MOCK_MEMBERS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Senior UX Designer",
    status: "available",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVDBEUu1zrObafd-1Y0t34wZt7JAnIxqf4LgsSeZl5ZFfyqbi-AkkuiG1Odolj1V185MzGJi8YhRCZcTrz7U3TSXcy7qpAnbyYMrGMIAigiRzxHRP4scVZ_ID8zgpDZh45vCBvQHVjfaGVt_dsUy7L-T7FbCCIj742NG-bWv5xOlntqp0SvPBZhzJPzOSD8llHnYHsXVBZarPAL3Tbl4QZz176YGy5juNfGNc3iwKP5kHQjrA2L_bSFqJeB1MnkSTEh0ZeieT4uN8",
  },
  {
    id: 2,
    name: "Michael Ross",
    role: "Frontend Developer",
    status: "medium",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHx6SNzU9gFywF5DX1by52OBR0qrgV6bbJdEliN9uI_06MXPLQEVtCrJSiXacv6z2Msp_IbwwAWRLoIgyGIC3RnEty9AhFMo5-NtHjzsUyIKDIY7EqKVoTD24ygTT6R-_hLwc35W7vfWB-Ga0iJ4nlbuf7OYXu9BmpApqqId05xfyvCjEW-MWoZURBfcwDaxAdsjjiEITial4R7puOCD3zH4yRRMfEftUZfaaw24mt1-248OksY5xFSTNxzuPN9sXFrxh-bQWD858",
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Product Manager",
    status: "overloaded",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEvcl4cD5xtZ_OjX9SGbySEF_jmpjWPPpao5Dqn9GlKli-x1UR7W4JgFbizuaRu0XTQH8JdXjL0yvcyS5B2tfJ7Va3VK5khvcEvosmOY1-fFjhqH4sZ-xdRzTsWz1OI04m9kSitTCEMT-ILWDv-w_U49D3vE9mPt_wIzSY_Lb8LQKhxIokJ4E4yuj7NDAfvOvaZh5_a7Zobx3Myzq8RiehHkgnES0ZvkEcxAdDIubw95L-nO8FvY-Mqevhrp4aja9SXc30A0bYp7U",
  },
  {
    id: 4,
    name: "David Kim",
    role: "QA Engineer",
    status: "available",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDbUk7CyPL8C10AZb7UH6du2BI9_6QmXYT7KQiMLhqnp6eq2cZuZxJYVg-ntmO0csrtM5cmLRp7ZA79bLX7suC-zdd6jGWqfNsMERhQj9FhoQxBTvSMWST_LHMXT9PmJZpmntJTPzKp9-xA62KdQB9zhxScV53y6gWb4Ld_J8-VapwBUnJsQ31WhF4kvQa3aCS-Dlvdp8YA_y7ZWVz_amgiVX6we9HsrPV5D4F8J2b62c62jfY6klUtb81EqwqA3yzKYT6bNy1imE4",
  },
];

const AssignTask = ({ onNext, onBack }) => {
  const [selectedIds, setSelectedIds] = useState([1]);

  const toggleMember = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm font-medium text-slate-500">
        <a href="#" className="hover:text-[#70c6ff] transition-colors">
          Tasks
        </a>
        <span className="mx-2 text-slate-300">/</span>
        <a href="#" className="hover:text-[#70c6ff] transition-colors">
          Create New
        </a>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-[#101518]">Assign Members</span>
      </nav>

      {/* Header + Stepper */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#101518]">
            Assign Team Members
          </h2>
          <p className="mt-2 text-slate-500">
            Select who is responsible for this task.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#e5e7eb] shadow-sm">
          <Stepper step={2} />
        </div>
      </div>

      {/* Members Card */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[#e5e7eb] flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400  text-[20px]" />
            <input
              type="text"
              placeholder="Filter by name or role..."
              className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#70c6ff] focus:border-[#70c6ff]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-gray-50 transition-colors">
              <SortAsc className="text-[18px]" />
              Sort
            </button>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedIds.length === MOCK_MEMBERS.length}
                onChange={(e) =>
                  setSelectedIds(
                    e.target.checked ? MOCK_MEMBERS.map((m) => m.id) : [],
                  )
                }
                className="form-checkbox size-5 rounded border-gray-300 text-[#70c6ff] focus:ring-[#70c6ff]"
              />
              <span className="text-sm font-medium text-[#101518]">
                Select All
              </span>
            </label>
          </div>
        </div>

        {/* Member List */}
        <MembersList
          members={MOCK_MEMBERS}
          selectedIds={selectedIds}
          toggleMember={toggleMember}
        />

        {/* Pagination */}
        <div className="p-4 border-t border-[#e5e7eb] bg-gray-50 flex justify-center">
          <button className="text-sm font-medium text-slate-500 hover:text-[#70c6ff] transition-colors">
            Show more members
          </button>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="bg-white border-t border-[#e5e7eb] p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center size-6 rounded-full bg-[#70c6ff]/20 text-xs font-bold text-[#70c6ff]">
              {selectedIds.length}
            </span>
            <span className="text-sm font-medium text-[#101518]">
              member selected
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={onNext}
              className="px-6 py-2.5 rounded-lg bg-[#70c6ff] text-[#0f1b23] font-bold hover:bg-blue-400 transition-colors shadow-lg shadow-[#70c6ff]/20 flex items-center gap-2"
            >
              <span>Next: Review</span>
              <ArrowRight className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AssignTask;
