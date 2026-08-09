import axios from "axios";
import { useState } from "react";
import DepartmentForm from "./DepartmentForm";
import { useNavigate } from "react-router-dom";
import useToast from "../../utils/useToast";
import { api } from "../../api/request";

const AddDepartment = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAdd = async (data) => {
    setLoading(true);
    try {
      const response = await api.post( "department/add",data );
      if (response.data.success) {
        showSuccess("Department added successfully");
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      showError(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentForm
      title="Add New Department"
      onSubmit={handleAdd}
      cancelPath="/admin-dashboard/departments"
      submitText="Add New Department"
      loading={loading}
    />
  );
};
export default AddDepartment