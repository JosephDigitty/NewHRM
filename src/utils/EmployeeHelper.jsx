import axios from "axios";
import { Eye, HeartPulse, MoreVertical, Pencil,  PlusCircle,   Trash2, X } from "lucide-react";
import { CiCircleInfo } from "react-icons/ci";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Loader from "../Component/reuseables/Loader";
import { useToastContext } from "../Context/ToastContext";
import HmoBeneficiary from "../Component/Hmo/HmoBeneficiary";
import UpdateTempoarySalaryModifiers from "../Component/Payroll/UpdateTemporarymodi";
import SalaryModifiers from "../Component/Payroll/AddSalaryModifiers";
import UpdatePermanentSalaryModifiers from "../Component/Payroll/UpdatePermanentModifier";
import AddPermanentSalaryModifiers from "../Component/Payroll/AddPermSalModifier";
import { api } from "../api/request";

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
    <>
      <div className="flex gap-1 text-white">
        <button
          className="py-1 text-black/85 rounded-sm cursor-pointer hover:text-blue-400"
          onClick={() => Navigate(`/admin-dashboard/employees/${id}`)}
        >
          <CiCircleInfo size={30}/>
        </button>
        <button
          className="py-1 flex gap-2 text-black/85 rounded-sm cursor-pointer hover:text-blue-400"
          onClick={() => Navigate(`/admin-dashboard/edit-employees/${id}`)}
        >
          | <Pencil/> |
        </button>
        <button
          className="py-1 flex gap-2 text-black/85 rounded-sm cursor-pointer hover:text-blue-400"
          onClick={() => setIsHmoModalOpen(true)}
        >
          | <HeartPulse/> |
        </button>
        <button
          className="py-1  text-black/85 rounded-sm cursor-pointer hover:text-blue-400 flex items-center gap-1"
          onClick={handleDelete}
          disabled={deleting}
        >
        <Trash2/>
        </button>
      </div>
      <HmoBeneficiary 
        isOpen={isHmoModalOpen} 
        onClose={() => setIsHmoModalOpen(false)} 
        id={id}
      />
    </>
  );
};

export const HMOButtons = ({ id }) => {
  const Navigate = useNavigate();
  return (
    <>
      <div className="flex gap-1 text-white">
        <button
          className="py-1 text-black/85 rounded-sm cursor-pointer hover:text-blue-400"
          onClick={() => Navigate(`/admin-dashboard/hmo/${id}`)}
        >
          <CiCircleInfo size={30}/>
        </button>
      </div>
    </>
  );
};



export const TempoaryPayrollButtons = ({ id }) => {
  const Navigate = useNavigate();
  const [isTemporaryModalOpen, setIsTemporaryModalOpen] = useState(false);
  const [isAddSalaryModalOpen, setIsAddSalaryModalOpen] = useState(false);
  
  return (
    <>
      <div className="flex gap-0.5 text-white">
        <button
          className="py-1 text-black/85 rounded-sm cursor-pointer hover:text-blue-400"
          onClick={() => setIsTemporaryModalOpen(true)}
        >
          <Pencil/>
        </button>
        <button
          className="py-1 flex gap-2 text-black/85 rounded-sm cursor-pointer hover:text-blue-400"
          onClick={() => setIsAddSalaryModalOpen(true)}
        >
          | <PlusCircle/>
        </button>
      </div>
      
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
    </>
  );
};

export const PayrollPermanentButtons = ({ id }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  return (
    <>
      <div className="flex gap-0.5 text-white">
        <button
          className="py-1 text-black/85 rounded-sm cursor-pointer hover:text-blue-400"
          onClick={() => setIsUpdateModalOpen(true)}
        >
          <Pencil/>
        </button>
        <button
          className="py-1 flex gap-2 text-black/85 rounded-sm cursor-pointer hover:text-blue-400"
          onClick={() => setIsAddModalOpen(true)}
        >
          | <PlusCircle/>
        </button>
      </div>
      
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
    </>
  );
};

export const getEmployee = async (id) => {
  const response = await api.get(`/employee/${id}`);

  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to fetch employee");
  }

  return response.data.employee
}