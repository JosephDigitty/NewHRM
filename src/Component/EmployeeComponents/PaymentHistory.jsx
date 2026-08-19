import React from "react";

const PaymentHistory = ({ period, sub, gross, net, status, date }) => (
  <tr className="border-b hover:bg-blue-50">
    <td className="p-4">
      <p className="text-blue-700 font-semibold">{period}</p>
      <p className="text-gray-500 text-xs">{sub}</p>
    </td>
    <td className="p-4">{gross}</td>
    <td className="p-4">{net}</td>
    <td className="p-4 text-purple-600 font-medium">{status}</td>
    <td className="p-4">{date}</td>
    <td className="p-4">
      <button className="px-4 py-2 border rounded-md hover:bg-gray-100 flex items-center gap-2">
        <span>⬇️</span> Download
      </button>
    </td>
  </tr>
);

export default PaymentHistory;
