import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useToast from "./useToast";
import { api } from "../api/request";
import { ActionCell, ActionButton } from "./TableActions";
import { Pencil, Trash2 } from "lucide-react";

export const fetchGrades = async (showError) => {
  let grade;
  try {
    const response = await api.get("/grade",);
    if (response.data.success) {
      return response.data.grades;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showError(error.response.data.error);
    } else {
      showError(error.message);
    }
  }
  return grade;
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "₦0.00";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const columns = [
  {
    name: "S/No",
    selector: (row) => row.sno,
    width: "80px",
  },
  {
    name: "Grade Name",
    selector: (row) => row.Grade_Name,
    cell: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <span className="font-medium text-gray-900">{row.Grade_Name}</span>
      </div>
    ),
  },
  {
    name: "Basic Salary (N)",
    selector: (row) => formatCurrency(row.Basic_Salary),
    sortable: true,
  },
  {
    name: "Housing Allowance (N)",
    selector: (row) => formatCurrency(row.Housing_Allownace),
  },
  {
    name: "Wardrobe Allowance (N)",
    selector: (row) => formatCurrency(row.Wardrobe_Allowance),
  },
  {
    name: "Transport Allowance (N)",
    selector: (row) => formatCurrency(row.Transport_Allowance),
  },
  {
    name: "Medical Allowance (N)",
    selector: (row) => formatCurrency(row.Medical_Allownace),
  },
  {
    name: "Actions",
    cell: (row) => <GradeActions id={row._id} />,
    width: "100px",
  },
];

const GradeActions = ({ id }) => {
  const Navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      setDeleting(true);
      try {
        await api.delete(`/grade/${id}`);
        showSuccess("Grade deleted successfully");
        window.location.reload();
      } catch (error) {
        showError("Error deleting grade: " + error.message);
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <ActionCell>
      <ActionButton
        icon={Pencil}
        title="Edit"
        onClick={() => Navigate(`/admin-dashboard/grade/edit/${id}`)}
      />
      <ActionButton
        icon={Trash2}
        title="Delete"
        variant="delete"
        onClick={handleDelete}
        disabled={deleting}
        loading={deleting}
      />
    </ActionCell>
  );
};
