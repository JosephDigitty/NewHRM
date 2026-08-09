import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GradeForm from "./GradeForm";
import SubTitle from "../reuseables/SubTitle";
import LoadingState from "../reuseables/LoadingState";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";

const AddGrades = () => {
  const [grade, setGrade] = useState({
    gradeName: "",
    basicSalary: "",
    housingAllowance: "",
    wardrobeAllowance: "",
    transportAllowance: "",
    medicalAllowance: "",
    isTaxable:true 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastContext();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGrade({ ...grade, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add grade to the database
    setLoading(true);
    try {
      const response = await api.post("/grade/add", grade);
      if (response.data.success) {
        navigate("/admin-dashboard/grades/all");
        showSuccess("New Grade Successfully Added");
        setGrade({
          gradeName: "",
          basicSalary: "",
        });
      }
    } catch (error) {
      if (error.response && !error.response.data.sucess) {
        showError(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
    
  };
  const fields = [
    {
      name: "gradeName",
      label: "Grade Name",
      type: "text",
      placeholder: "Grade Name",
      required: true,
    },
    {
      name: "basicSalary",
      label: "Basic Salary",
      type: "text",
      placeholder: "Basic Salary",
      required: true,
    },
    {
      name: "housingAllowance",
      label: "Housing Allowance",
      type: "text",
      placeholder: "Housing Allowance",
    },
    {
      name: "wardrobeAllowance",
      label: "Wardrobe Allowance",
      type: "text",
      placeholder: "Wardrobe Allowance",
    },
    {
      name: "transportAllowance",
      label: "Transport Allowance",
      type: "text",
      placeholder: "Transport Allowance",
    },
    {
      name: "medicalAllowance",
      label: "Medical Allowance",
      type: "text",
      placeholder: "Medical Allowance",
    },
  ];
  return (
    <div className="w-full h-[90vh]  mt-10 md:mt-0 flex items-center justify-center">
      <div className="md:w-[60%] w-full bg-white p-8 rounded-md shadow-md min-w-96">
        <SubTitle
          text={"Create New Grading System"}
          className="mb-8 text-center"
        />
        {/* Form to add new department */}
        <GradeForm
          fields={fields}
          values={grade}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitText="Create New Grade"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AddGrades;
