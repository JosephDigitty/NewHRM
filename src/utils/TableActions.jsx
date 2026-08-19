import {
  Pencil,
  Trash2,
  Eye,
  PlusCircle,
  HeartPulse,
  MoreVertical,
  Loader2,
} from "lucide-react";

export const ActionCell = ({ children }) => (
  <div className="flex gap-1">{children}</div>
);

const colorMap = {
  view: "text-gray-600 hover:text-blue-700 hover:bg-blue-50",
  edit: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
  delete: "text-red-600 hover:text-red-700 hover:bg-red-50",
  add: "text-purple-600 hover:text-purple-700 hover:bg-purple-50",
  info: "text-purple-600 hover:text-purple-700 hover:bg-purple-50",
  hmo: "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50",
};

export const ActionButton = ({
  onClick,
  icon,
  title,
  disabled,
  loading = false,
  variant = "edit",
}) => {
  const classes = colorMap[variant] || colorMap.edit;
  const IconComponent = icon;

  return (
    <button
      className={`p-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${classes}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <IconComponent size={16} />
      )}
    </button>
  );
};
