import { BarChart, Bar, ResponsiveContainer } from "recharts";

const MiniBar = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <Bar dataKey="value" fill="#60A5FA" radius={4} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MiniBar;
