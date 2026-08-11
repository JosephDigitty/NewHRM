import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useToast from "./useToast";
import Loader from "../Component/reuseables/Loader";
import { Pencil, Trash2 } from "lucide-react";
import { api } from "../api/request";

export const columns = [
  {
    name: "DEPARTMENT",
    selector: (row) => row.department_Name,
    sortable: true,
    cell: (row) => (
      <div>
        <div className="font-medium text-gray-900">{row.department_Name}</div>
        <div className="text-xs text-gray-500">{row.description}</div>
      </div>
    ),
  },
  {
    name: "DEPARTMENT HEAD",
    selector: () => "",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <img
          src={row.headImage || "https://ui-avatars.com/api/?name=NA&background=random"}
          alt={row.departmentHead}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-medium text-gray-900 text-sm">{row.departmentHead}</div>
          <div className="text-xs text-gray-500">{row.headPosition}</div>
        </div>
      </div>
    ),
  },
  {
    name: "EMPLOYEES",
    selector: () => "",
    cell: (row) => (
      <div>
        <div className="font-medium text-gray-900">{row.employeeCount}</div>
        <button
          onClick={() => row.onViewEmployees(row._id)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          View employees
        </button>
      </div>
    ),
  },
  {
    name: "STATUS",
    selector: () => "",
    cell: () => (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        Active
      </span>
    ),
  },
  {
    name: "ACTION",
    selector: () => "",
    cell: (row) => row.Action,
  },
];

export const customStyles = {
  rows: {
    style: {
      minHeight: "72px",
      borderBottom: "1px solid #f0f0f0",
    },
  },
  headCells: {
    style: {
      paddingLeft: "20px",
      paddingRight: "20px",
      backgroundColor: "#fafafa",
      color: "#6b7280",
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
  },
  cells: {
    style: {
      paddingLeft: "20px",
      paddingRight: "20px",
    },
  },
};

export const DepartmentButtons = ({ _id, handleDeleted }) => {
  const Navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await api.delete(
        `/department/${_id}`,
      );

      if (response.data.success) {
        handleDeleted(_id);
        showSuccess("Department deleted successfully");
      } else {
        showError("Error deleting department");
      }
    } catch (error) {
      showError("Error deleting department: " + error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
        onClick={() => Navigate(`/admin-dashboard/departments/${_id}`)}
        title="Edit"
      >
        <Pencil size={16} />
      </button>
      <button
        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        onClick={handleDelete}
        disabled={deleting}
        title="Delete"
      >
        {deleting ? <Loader size="sm" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
};
