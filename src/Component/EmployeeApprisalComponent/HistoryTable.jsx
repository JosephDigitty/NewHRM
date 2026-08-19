import React from "react";

const HistoryTable = ({ history }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-lg">Historical Reviews</h3>

        <button className="text-primary text-sm font-bold hover:underline">
          View All Performance History
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] uppercase tracking-wider font-bold text-slate-400">
              <th className="px-6 py-4">Cycle Name</th>
              <th className="px-6 py-4 text-center">Final Score</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-sm">{item.cycle}</p>
                  <p className="text-xs text-slate-400">{item.date}</p>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="font-bold text-sm">{item.score}</span>
                </td>

                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded uppercase">
                    {item.rating}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <span className="size-1.5 rounded-full bg-slate-300"></span>

                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <button className="px-3 py-1.5 bg-[#5048e5]/10 text-primary text-xs font-bold rounded hover:bg-[#5048e5]/20 transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
