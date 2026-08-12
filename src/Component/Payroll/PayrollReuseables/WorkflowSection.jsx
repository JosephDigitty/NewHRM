import React from "react";
import { MdPerson, MdEvent } from "react-icons/md";

const WorkflowSection = ({ preparedBy, submittedAt, nextApproval, lastUpdated }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Prepared By</h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <MdPerson className="text-gray-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{preparedBy.name}</p>
              <p className="text-xs text-gray-500">{preparedBy.role}</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Submitted</h4>
          <div className="flex items-center gap-2">
            <MdEvent className="text-gray-400" size={18} />
            <p className="text-sm text-gray-900">{submittedAt}</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Next Approval</h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <MdPerson className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{nextApproval.name}</p>
              <p className="text-xs text-gray-500">{nextApproval.role}</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h4>
          <div className="flex items-center gap-2">
            <MdEvent className="text-gray-400" size={18} />
            <p className="text-sm text-gray-900">{lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSection;
