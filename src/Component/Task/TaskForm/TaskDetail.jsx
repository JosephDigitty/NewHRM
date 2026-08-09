import {
  ArrowRight,
  Calendar,
  ChevronDown,
  Upload,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";

import React, { useState } from "react";

const TaskDetail = ({ onNext }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "normal",
  });

  return (
    <form className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Q4 Performance Review Preparation"
          className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-[#70c6ff] focus:bg-white focus:ring-2 focus:ring-[#70c6ff]/20 transition-all"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <div className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-[#70c6ff]/20 focus-within:border-[#70c6ff] transition-all">
          <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-100/50">
            <ToolbarButton Icon={Bold} />
            <ToolbarButton Icon={Italic} />
            <div className="w-px h-4 bg-slate-300 mx-1" />
            <ToolbarButton Icon={List} />
            <ToolbarButton Icon={ListOrdered} />
            <ToolbarButton Icon={LinkIcon} />
          </div>

          <textarea
            rows={6}
            placeholder="Describe the objectives, deliverables, and any specific instructions..."
            className="w-full border-none bg-transparent p-4 text-slate-900 placeholder:text-slate-400 focus:ring-0 resize-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <p className="text-xs text-slate-500 text-right">
          {form.description.length}/500 characters
        </p>
      </div>

      {/* Due Date & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Due Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-[#70c6ff] focus:bg-white focus:ring-2 focus:ring-[#70c6ff]/20 transition-all appearance-none"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Priority Level
          </label>
          <div className="relative">
            <select
              className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-[#70c6ff] focus:bg-white focus:ring-2 focus:ring-[#70c6ff]/20 transition-all appearance-none"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="normal">Normal</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical</option>
              <option value="low">Low Priority</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="space-y-2 pt-2">
        <label className="block text-sm font-medium text-slate-700">
          Attachments
        </label>
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="bg-[#70c6ff]/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Upload className="text-[#70c6ff]" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-400 mt-1">
            PDF, DOC, PNG up to 10MB
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          className="px-6 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onNext}
          className="group flex items-center gap-2 px-8 py-2.5 rounded-lg bg-[#70c6ff] text-slate-900 font-bold hover:bg-[#5bb8f5] hover:shadow-lg hover:shadow-[#70c6ff]/20 transition-all"
        >
          Next Step
          <ArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
};

function ToolbarButton({ Icon }) {
  return (
    <button
      type="button"
      className="p-1.5 hover:bg-slate-200 rounded text-slate-500 transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default TaskDetail;
