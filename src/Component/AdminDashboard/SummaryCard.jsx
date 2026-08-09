// components/appraisal/SummaryCards.jsx

import { BadgePercent, Clock, CheckCircle2, Star } from "lucide-react";

const SummaryCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: <BadgePercent />,
    },
    {
      title: "Ongoing",
      value: stats.ongoing,
      icon: <Clock />,
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: <CheckCircle2 />,
    },
    {
      title: "Average Score",
      value: stats.averageScore,
      icon: <Star />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col gap-4"
        >
          <div>{card.icon}</div>

          <div>
            <p className="text-slate-500 text-sm">{card.title}</p>
            <p className="text-3xl font-black">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;