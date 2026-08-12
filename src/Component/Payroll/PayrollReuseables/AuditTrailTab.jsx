import React from "react";

const AuditTrailTab = ({ auditData }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {auditData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700">
                    {row.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.description}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{row.user}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.role}</td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{row.timestamp}</td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{row.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTrailTab;
