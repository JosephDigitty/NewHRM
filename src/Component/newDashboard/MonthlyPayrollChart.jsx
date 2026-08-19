import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SubTitle from "../reuseables/SubTitle";
import { getMonthlyPayrollData } from "../../utils/DyamicDashboard";

const formatCompact = (value) => {
  if (value == null || isNaN(value)) return "0";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}m`;
  if (abs >= 100_000) return `${(value / 1_000).toFixed(0)}k`;
  if (abs >= 10_000) return `${(value / 1_000).toFixed(0)}k`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return `${value}`;
};

const MonthlyPayrollChart = ({ payrolls }) => {
  const [chartData, setChartData] = useState([])
  useEffect(() => {
  const fetchData = async () => {
    const data = payrolls || []
    setChartData(getMonthlyPayrollData(data))
  }
  fetchData()
}, [payrolls])

const lastMonthTotal = chartData.length > 0 ? chartData[chartData.length - 1]?.value : 0
const currentYear = new Date().getFullYear()

  if (chartData.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center h-80">
        <SubTitle text="Monthly Payroll Spend"/>
        <p className="text-gray-500 text-sm mb-4">No payroll data available for {currentYear}</p>
        <div className="text-gray-400 text-sm">Start by generating payroll to see insights.</div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      
      <SubTitle text="Monthly Payroll Spend"/>
      <p className="text-gray-500 text-sm mb-4">₦{lastMonthTotal.toLocaleString()} paid last month</p>
      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={formatCompact}
              domain={[0, "auto"]}
              ticks={chartData.length > 0 ? undefined : [0]}
             
            />
            <Tooltip  formatter={(value) => [`₦${value.toLocaleString()}`, "Payroll"]}/>
            <Bar dataKey="value" fill="#60a5fa"  />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyPayrollChart;
