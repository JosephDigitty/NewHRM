import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OverviewChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OverviewChart;
