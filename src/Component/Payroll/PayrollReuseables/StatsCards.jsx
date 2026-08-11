import React from "react";
import { MdPerson, MdAccountBalanceWallet, MdReceiptLong, MdAccountBalance } from "react-icons/md";

const StatCard = ({ icon, title, value, subtitle }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

const StatsCards = ({ totalEmployees, grossPayroll, totalDeductions, totalNetPay, status, statusDescription }) => {
  const formatCurrency = (value) => `₦${value.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <StatCard
        icon={<MdPerson className="text-blue-600" size={24} />}
        title="Total Employees"
        value={totalEmployees}
        subtitle="Employees in payroll"
      />
      <StatCard
        icon={<MdAccountBalanceWallet className="text-green-600" size={24} />}
        title="Gross Payroll"
        value={formatCurrency(grossPayroll)}
        subtitle="Total earnings"
      />
      <StatCard
        icon={<MdReceiptLong className="text-red-600" size={24} />}
        title="Total Deductions"
        value={formatCurrency(totalDeductions)}
        subtitle="Total deductions"
      />
      <StatCard
        icon={<MdAccountBalance className="text-purple-600" size={24} />}
        title="Total Net Pay"
        value={formatCurrency(totalNetPay)}
        subtitle="Total take home pay"
      />
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Current Status</h3>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
          <span className="text-gray-900 font-medium text-sm">{status}</span>
        </div>
        <p className="text-xs text-gray-500">{statusDescription}</p>
      </div>
    </div>
  );
};

export default StatsCards;
