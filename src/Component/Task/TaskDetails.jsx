import React from "react";
import Stepper from "./Stepper";
import TaskDetail from "./TaskForm/TaskDetail";
import { ChevronRight } from "lucide-react";

const TaskDetails = ({ onNext }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <a
          href="#"
          className="text-slate-500 hover:text-[#70c6ff] transition-colors"
        >
          Tasks
        </a>
        <ChevronRight className="text-slate-400 text-base" />
        <span className="text-slate-900 font-medium">Create New Task</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Create New Task
          </h1>
          <p className="text-slate-500 mt-1">
            Fill in the details below to assign a new task.
          </p>
        </div>

        <Stepper step={1} />
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <TaskDetail onNext={onNext} />
      </div>
    </div>
  );
};

export default TaskDetails;
