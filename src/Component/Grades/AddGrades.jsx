import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/request";
import useToast from "../../utils/useToast";
import {
  Star,
  ArrowLeft,
  Info,
  Tag,
  Banknote,
  Home,
  Shirt,
  Car,
  Heart,
  X,
} from "lucide-react";

const AddGrades = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const [grade, setGrade] = useState({
    gradeName: "",
    basicSalary: "",
    housingAllowance: "",
    wardrobeAllowance: "",
    transportAllowance: "",
    medicalAllowance: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGrade({ ...grade, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/grade/add", grade);
      if (response.data.success) {
        showSuccess("New Grade Successfully Added");
        navigate("/admin-dashboard/grades/all");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        showError(error.response.data.error);
      } else {
        showError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "gradeName",
      label: "Grade Name",
      placeholder: "Enter grade name",
      required: true,
      icon: Tag,
    },
    {
      name: "basicSalary",
      label: "Basic Salary",
      placeholder: "Enter basic salary",
      required: true,
      icon: Banknote,
    },
    {
      name: "housingAllowance",
      label: "Housing Allowance",
      placeholder: "Enter housing allowance",
      icon: Home,
    },
    {
      name: "wardrobeAllowance",
      label: "Wardrobe Allowance",
      placeholder: "Enter wardrobe allowance",
      icon: Shirt,
    },
    {
      name: "transportAllowance",
      label: "Transport Allowance",
      placeholder: "Enter transport allowance",
      icon: Car,
    },
    {
      name: "medicalAllowance",
      label: "Medical Allowance",
      placeholder: "Enter medical allowance",
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-6 py-8 ">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Grade</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Create a new grade and define its pay structure.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin-dashboard/grades/all")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Grades
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
              <Info className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Grade Information</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6 ml-8">
            Fill in the details below to create a new grading system.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={grade[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="pl-12 w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/admin-dashboard/grades/all")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create New Grade"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGrades;
