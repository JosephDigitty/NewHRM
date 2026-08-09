import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useToast from "./useToast";
import Loader from "../Component/reuseables/Loader";
import { Pencil, Trash2 } from "lucide-react";
import { api } from "../api/request";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
  },
  {
    name: "Department Name",
    selector: (row) => row.department_Name,
    sortable: true,
  },
  {
    name: "Action",
    selector: (row) => row.Action,
  },
];

export const customStyles = {
  rows: {
    style: {
      minHeight: "60px", // increase row height
    },
  },
  headCells: {
    style: {
      paddingLeft: "20px", 
      paddingRight: "20px",
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
        // Notify parent component (DepartmentList) to remove the deleted department
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
    <div className="flex gap-1 text-white">
      <button
        className="py-1 flex gap-1 text-black/85 cursor-pointer hover:text-blue-400 rounded-sm"
        onClick={() => Navigate(`/admin-dashboard/departments/${_id}`)}
      >
        <Pencil/> | 
      </button>
      <button
        className="py-1 text-black/85 cursor-pointer hover:text-blue-400 rounded-sm flex items-center gap-1"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? <Loader size="sm" /> : null}
        {deleting ? "Deleting..." : <Trash2/> }
      </button>
    </div>
  );
};
