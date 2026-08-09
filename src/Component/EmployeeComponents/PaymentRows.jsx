import React from "react";
import { downloadPayrollPDF } from "./DownloadPayroll";

const PaymentRows = ({ period, sub, employeeName, gross, net, totalDeductions, salary, status, date, housingAllowance, transportAllowance, wardrobeAllowance, medicalAllowance, pension, paye, oneTimeAllowances, oneTimeDeductions, permAllowances, permDeductions, }) => {
    const payrollData = { period, 
      sub,
      employeeName,
      salary,
      gross, 
      net, 
      status, 
      date, 
      totalDeductions,
      housingAllowance,
      wardrobeAllowance, 
      transportAllowance, 
      medicalAllowance,
      pension,
      paye,
      oneTimeAllowances, 
      oneTimeDeductions, 
      permAllowances, 
      permDeductions,
    };
    return (
  <tr className="border-b hover:bg-blue-50">
    <td className="p-4">
      <p className="text-blue-700 font-semibold">{period}</p>
      <p className="text-gray-500 text-xs">{sub}</p>
    </td>
    <td className="p-4">{gross}</td>
    <td className="p-4">{net}</td>
    <td className="p-4 text-green-600 font-medium">{status}</td>
    <td className="p-4">{date}</td>
    <td className="p-4">
      <button 
      onClick={() => downloadPayrollPDF(payrollData)}
      className="px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-100 flex items-center gap-2">
        <span>⬇️</span> Download
      </button>
    </td>
  </tr>
    )
};

export default PaymentRows;
