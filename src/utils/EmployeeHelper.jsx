import axios from "axios";
import { 
  Eye, 
  HeartPulse, 
  MoreVertical, 
  Pencil,  
  PlusCircle,   
  Trash2, 
  X 
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Component/reuseables/Loader";
import { useToastContext } from "../Context/ToastContext";
import HmoBeneficiary from "../Component/Hmo/HmoBeneficiary";
import UpdateTempoarySalaryModifiers from "../Component/Payroll/UpdateTemporarymodi";
import SalaryModifiers from "../Component/Payroll/AddSalaryModifiers";
import UpdatePermanentSalaryModifiers from "../Component/Payroll/UpdatePermanentModifier";
import AddPermanentSalaryModifiers from "../Component/Payroll/AddPermSalModifier";
import { api } from "../api/request";
import { ActionCell, ActionButton } from "./TableActions";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "90px",
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    width: "120px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    width: "200px",
    sortable: true,
  },
  {
    name: "Department",
    selector: (row) => row.department_Name,
    width: "200px",
    sortable: true,
  },
  {
    name: "Action",
    selector: (row) => row.Action,
  },
];

export const Hmocolumns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "90px",
  },
  {
    name: "HMO Type",
    selector: (row) => row.name,
    width: "200px",
    sortable: true,
  },
  {
    name: "Price",
    selector: (row) => formatCurrency(row.Price),
  },
  {
    name: "Action",
    cell: (row) => (
        <HMOButtons id={row._id} />
      ),
  },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};
export const getHmo = async (showError) => {
  try {
    const res = await api.get("/hmo");
    if (res.data.success) {
      return res.data.HMO;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showError(error.response.data.error);
    }
  }
};

export const fetchDepartments = async (showError) => {
  let departments;
  try {
    const response = await api.get("/department")
    if (response.data.success) {
      return response.data.departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showError(error.response.data.error);
    } else {
      showError(error.message);
    }
  }
  return departments;
};
export const getEmployees = async (id, showError) => {
  let employees;
  try {
    const response = await api.get(`/employee/department/${id}`,);

    if (response.data.success) {
      employees = await response.data.employees;
    }
    const data = await response.data;
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showError(error.response.data.error);
    } else {
      showError(error.message);
    }
  }
  return employees;
};

export const EmployeeButtons = ({ id, handleDeleted }) => {
  const Navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [isHmoModalOpen, setIsHmoModalOpen] = useState(false);
  const { showError } = useToastContext();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await api.delete(`/employee/${id}`,);

      if (response.data.success) {
        handleDeleted(id);
      } else {
        showError("Error deleting employee");
      }
    } catch (error) {
      showError("Error deleting employee: " + error.message);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <ActionCell>
      <ActionButton
        icon={Eye}
        title="View"
        variant="view"
        onClick={() => Navigate(`/admin-dashboard/employees/${id}`)}
      />
      <ActionButton
        icon={Pencil}
        title="Edit"
        variant="edit"
        onClick={() => Navigate(`/admin-dashboard/edit-employees/${id}`)}
      />
      <ActionButton
        icon={HeartPulse}
        title="HMO"
        variant="hmo"
        onClick={() => setIsHmoModalOpen(true)}
      />
      <ActionButton
        icon={Trash2}
        title="Delete"
        variant="delete"
        onClick={handleDelete}
        disabled={deleting}
        loading={deleting}
      />
      <HmoBeneficiary 
        isOpen={isHmoModalOpen} 
        onClose={() => setIsHmoModalOpen(false)} 
        id={id}
      />
    </ActionCell>
  );
};

export const HMOButtons = ({ id }) => {
  const Navigate = useNavigate();
  return (
    <ActionCell>
      <ActionButton
        icon={Eye}
        title="View"
        variant="view"
        onClick={() => Navigate(`/admin-dashboard/hmo/${id}`)}
      />
    </ActionCell>
  );
};

export const TempoaryPayrollButtons = ({ id }) => {
  const Navigate = useNavigate();
  const [isTemporaryModalOpen, setIsTemporaryModalOpen] = useState(false);
  const [isAddSalaryModalOpen, setIsAddSalaryModalOpen] = useState(false);
  
  return (
    <ActionCell>
      <ActionButton
        icon={Pencil}
        title="Edit"
        variant="edit"
        onClick={() => setIsTemporaryModalOpen(true)}
      />
      <ActionButton
        icon={PlusCircle}
        title="Add"
        variant="add"
        onClick={() => setIsAddSalaryModalOpen(true)}
      />
      
      <UpdateTempoarySalaryModifiers 
        isOpen={isTemporaryModalOpen} 
        onClose={() => setIsTemporaryModalOpen(false)} 
        id={id}
      />
      
      <SalaryModifiers 
        isOpen={isAddSalaryModalOpen} 
        onClose={() => setIsAddSalaryModalOpen(false)} 
        id={id}
      />
    </ActionCell>
  );
};

export const PayrollPermanentButtons = ({ id }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  return (
    <ActionCell>
      <ActionButton
        icon={Pencil}
        title="Edit"
        variant="edit"
        onClick={() => setIsUpdateModalOpen(true)}
      />
      <ActionButton
        icon={PlusCircle}
        title="Add"
        variant="add"
        onClick={() => setIsAddModalOpen(true)}
      />
      
      <UpdatePermanentSalaryModifiers 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
        id={id}
      />
      
      <AddPermanentSalaryModifiers 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        id={id}
      />
    </ActionCell>
  );
};
