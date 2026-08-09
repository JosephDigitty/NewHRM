import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import SubTitle from "../reuseables/SubTitle";
import { useEffect, useState } from "react";
import { getAllDepartment, getAllEmployee } from "../../utils/DyamicDashboard";


// Define a color pool — adds more if needed
const COLORS = [
  "#4ade80", "#f87171", "#facc15", "#60a5fa", "#e879f9",
  "#fb923c", "#34d399", "#818cf8", "#f472b6", "#38bdf8"
];

const HeadCountC = () => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const getAllDashboardData = async () => {
      try {
        const [departments, employees] = await Promise.all([
          getAllDepartment(),
          getAllEmployee()
        ])
        
        // Map real departments to the shape recharts expects
        const formatted = departments.map((dept, index) => ({
          name: dept.department_Name,
          value: employees.filter(emp => emp.job.department?._id === dept._id).length,       // adjust key to match your dept object
          color: COLORS[index % COLORS.length],  // cycles through colors if > 10 depts
        }))
        setChartData(formatted)
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
      }
    }
    getAllDashboardData()
  }, [])

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col sm:flex-row">
      <div className="flex-1 mb-6 sm:mb-0 flex flex-col gap-5">
        <div>
          <SubTitle text="Headcount by Dept" />
          <p className="text-gray-500 text-sm mb-4">
            There are more males than females
          </p>
        </div>
        <ul className="space-y-2 text-sm">
          {chartData.map((entry, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-sm inline-block"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span>{entry.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ value, cx, cy, midAngle, outerRadius, fill }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius + 20;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    fill={fill}
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight="bold"
                  >
                    {value}
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HeadCountC;