import { useNavigate } from "react-router-dom";

export const LeaveButton = ({ id }) => {
  const Navigate = useNavigate();
  return (
    <div className="flex gap-1 text-white">
      <button
        className="py-1 text-black/85 rounded-sm cursor-pointer hover:text-blue-400"
        onClick={() => Navigate(`/admin-dashboard/leave/${id}`)}
      >
        View
      </button>
    </div>
  );
};