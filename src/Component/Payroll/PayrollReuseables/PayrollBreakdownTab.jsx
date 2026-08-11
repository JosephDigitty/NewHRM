import React from "react";

const PayrollBreakdownTab = ({ breakdowns, formatCurrency, totals }) => {
  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Deductions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% Deductions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {breakdowns.map((row, index) => {
                const deductionPercent = ((row.deductions / row.grossPay) * 100).toFixed(1);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.grade}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">{formatCurrency(row.grossPay)}</td>
                    <td className="px-6 py-4 text-sm text-red-600 text-right">{formatCurrency(row.deductions)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{formatCurrency(row.netPay)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: `${deductionPercent}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 w-12 text-right">{deductionPercent}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Gross Payroll</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.gross)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Deductions</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totals.deductions)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total Net Pay</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.net)}</p>
        </div>
      </div>
    </div>
  );
};

export default PayrollBreakdownTab;
