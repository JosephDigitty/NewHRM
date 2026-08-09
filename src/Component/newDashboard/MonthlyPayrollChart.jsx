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
import { getAllPayroll, getMonthlyPayrollData } from "../../utils/DyamicDashboard";

const payrollData = [
  { name: "Jan", value: 10 },
  { name: "Feb", value: 5 },
  { name: "Mar", value: 15 },
  { name: "Apr", value: 80 },
  { name: "May", value: 105 },
  { name: "Jun", value: 100 },
  { name: "Jul", value: 90 },
  { name: "Aug", value: 50 },
  { name: "Sep", value: 80 },
  { name: "Oct", value: 78 },
];

const MonthlyPayrollChart = () => {
  const [payrolls, setPayrolls] = useState([])
  const [chartData, setChartData] = useState([])
  useEffect(() => {
  const fetchData = async () => {
    const payrolls = await getAllPayroll()
    setPayrolls(payrolls)
    setChartData(getMonthlyPayrollData(payrolls))
  }
  fetchData()
}, [])
const lastMonthTotal = chartData[chartData.length - 1]?.value || 0
  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      
      <SubTitle text="Monthly Payroll Spend"/>
      <p className="text-gray-500 text-sm mb-4">$76.8M paid last month</p>
      {/* Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => (value === 0 ? "0" : `${value}M`)}
              domain={[0, 120]}
              ticks={[0, 25, 50, 75, 100]}
             
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
