import { Link } from "react-router-dom";

const ActionCard = ({ icon, label, href }) => (
  <Link
    to={href}
    className="flex flex-col items-center justify-center p-4 rounded-lg border hover:scale-103 hover:shadow-xl transition-all duration-300 ease-in-out"
  >
    <span className="text-[#70c6ff] text-3xl">{icon}</span>
    <span className="mt-2 text-sm font-semibold text-gray-800 text-center">
      {label}
    </span>
  </Link>
);

export default ActionCard;
