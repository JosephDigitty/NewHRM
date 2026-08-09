import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DepartmentForm from "./DepartmentForm";
import useToast from "../../utils/useToast";
import Loader from "../reuseables/Loader";
import { api } from "../../api/request";

const EditDepartment = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState({
    department_Name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchDepartment = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/department/${id}`);
        if (response.data.success) {
          setDepartment(response.data.department);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartment();
  }, [id]);

  const handleEdit = async (updatedDepartment) => {
    setSubmitting(true);
    try {
      const response = await axios.put(
        `http://localhost:3001/api/department/${id}`,
        updatedDepartment,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        showSuccess("Department updated successfully");
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        showError(error.response.data.error);
      }
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader size="lg" /></div>;

  return (
    <DepartmentForm
      title="Edit Department"
      initialData={department}
      onSubmit={handleEdit}
      cancelPath="/admin-dashboard/departments"
      submitText="Update Department"
      loading={submitting}
    />
  );
};

export default EditDepartment;
