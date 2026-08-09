import React from "react";
import Stepper from "./Stepper";
import ReviewCard from "./TaskForm/ReviewCard";
import { Calendar, CheckCircle, Edit, Flag } from "lucide-react";
import { MdDescription } from "react-icons/md";

const ReviewTask = ({ onBack, onSubmit }) => {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Stepper */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <Stepper step={3} />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-[#70c6ff] mb-2">
          Review Task Details
        </h1>
        <p className="text-text-secondary">
          Please review the information below before creating the task.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* General Info */}
        <div className="md:col-span-2">
          <ReviewCard
            title="General Information"
            Icon={MdDescription}
            action={
              <button className="text-[#70c6ff] hover:text-[#70c6ff]-dark text-sm font-medium flex items-center gap-1">
                <Edit className="text-[16px]" />
                Edit
              </button>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <Info
                label="Task Title"
                value="Quarterly Performance Review - Q3"
              />
              <Info label="Project" value="Internal HR Operations" />
            </div>

            <div className="mb-6">
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Description
              </p>
              <p className="text-sm text-text-[#70c6ff] leading-relaxed">
                Conduct 1:1 sessions with junior designers to discuss their
                progress over the last quarter...
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                Attachments
              </p>
              <div className="flex items-center gap-3">
                <FileBadge icon="picture_as_pdf" label="Q3_Guidelines.pdf" />
                <FileBadge icon="description" label="Template_V2.docx" />
              </div>
            </div>
          </ReviewCard>
        </div>

        {/* Logistics */}
        <div className="md:col-span-1">
          <ReviewCard
            title="Logistics"
            Icon={Calendar}
            action={
              <button className="text-[#70c6ff] hover:text-[#70c6ff]-dark">
                <Edit className="text-[18px]" />
              </button>
            }
          >
            <div className="mb-5">
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                Assignee
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="size-10 rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBVCYPfWXL0hfhhjjD_OEJnkn85cNFYwsOnZHSII5tC-bIHkwykue6ZJ2snu8d3A8kRODq9LWkOJ6-jD5TfUumn700g-yrTCTtMGVUlsQFXyq25LRikapUk1G8mpFqUAAX5l3fG0wKHTGdmvwGFlyy5FeLJWKe4gJmL8ZiL-aM4fUtQxaOtWo2qyTvfg38juWGltePz4he4c6pJgzTe4CxT-roI9MKMchB9ytJ4RVdPEkBp8-KXjXeQtVpD6k-_yo-W29XzlN_4aew')",
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-text-[#70c6ff]">
                    Sarah Miller
                  </p>
                  <p className="text-xs text-text-secondary">Senior Designer</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Info label="Due Date" value="Oct 15, 2023" />
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                  Priority
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  High
                </span>
              </div>
            </div>
          </ReviewCard>
        </div>
      </div>

      {/* Appraisal Connection */}
      <ReviewCard
        title="Appraisal Connection"
        icon="verified"
        action={
          <button className="text-[#70c6ff] hover:text-[#70c6ff]-dark text-sm font-medium flex items-center gap-1">
            <Edit className="text-[16px]" />
            Edit
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
              Linked Organizational Goal
            </p>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
             <Flag className=" text-blue-600 mt-0.5"/>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Improve Team Efficiency
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Goal ID: #ORG-2023-Q4
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
              Competencies Evaluated
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge label="Leadership" />
              <Badge label="Communication" />
              <Badge label="Performance Management" />
            </div>
          </div>
        </div>
      </ReviewCard>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="px-8 py-2.5 rounded-lg bg-[#70c6ff] text-[#0f1b23] font-bold hover:bg-blue-400 transition-colors shadow-lg shadow-[#70c6ff]/20 flex items-center gap-2"
        >
          <span>Create Task</span>
          <CheckCircle className="text-lg" />
        </button>
      </div>
    </div>
  );
};

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-text-[#70c6ff]">{value}</p>
    </div>
  );
}

function FileBadge({ Icon, label }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded border border-slate-200">
      {Icon && <Icon className="text-[20px] text-slate-500" />}
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}

function Badge({ label }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
      {label}
    </span>
  );
}
export default ReviewTask;
