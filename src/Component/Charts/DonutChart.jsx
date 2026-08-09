import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const DonutChart = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={190}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={50}
          outerRadius={70}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={colors[i]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
