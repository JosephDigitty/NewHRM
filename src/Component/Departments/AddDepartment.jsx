import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "../../utils/useToast";
import Loader from "../reuseables/Loader";
import { api } from "../../api/request";
import {
  Info,
  Building2,
  FileText,
  X,
  Users,
  BarChart3,
  Lock,
  Handshake,
} from "lucide-react";

const AddDepartment = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const [department, setDepartment] = useState({
    department_Name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("department/add", department);
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-6 py-8 ">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Department
            </h1>
            <p className="text-gray-500 mt-1">
              Create a new department and get your team organized.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin-dashboard/departments")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <Info className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Department Information
                </h2>
              </div>
              <p className="text-sm text-gray-500 mb-6 ml-8">
                Fill in the details below to create a new department.
              </p>

              <form onSubmit={handleAdd} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="department_Name"
                      value={department.department_Name}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter department name"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose a clear and unique name for the department.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-start pointer-events-none pt-2.5">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <textarea
                      name="description"
                      value={department.description}
                      onChange={handleChange}
                      rows={6}
                      className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter department description (optional)"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Provide a brief description of the department's purpose and
                    responsibilities.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader size="sm" />
                    ) : (
                      <>
                        <span className="text-lg leading-none">+</span>
                        Add New Department
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-center mb-6">
                <div className="w-48 h-48 bg-purple-50 rounded-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-40 h-40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="60"
                      y="90"
                      width="25"
                      height="60"
                      rx="2"
                      fill="#7c3aed"
                    />
                    <rect
                      x="90"
                      y="70"
                      width="25"
                      height="80"
                      rx="2"
                      fill="#6d28d9"
                    />
                    <rect
                      x="120"
                      y="100"
                      width="25"
                      height="50"
                      rx="2"
                      fill="#5b21b6"
                    />
                    <rect
                      x="45"
                      y="110"
                      width="20"
                      height="40"
                      rx="2"
                      fill="#8b5cf6"
                    />
                    <rect
                      x="65"
                      y="95"
                      width="8"
                      height="8"
                      rx="1"
                      fill="#c4b5fd"
                    />
                    <rect
                      x="65"
                      y="110"
                      width="8"
                      height="8"
                      rx="1"
                      fill="#c4b5fd"
                    />
                    <rect
                      x="65"
                      y="125"
                      width="8"
                      height="8"
                      rx="1"
                      fill="#c4b5fd"
                    />
                    <rect
                      x="95"
                      y="80"
                      width="8"
                      height="8"
                      rx="1"
                      fill="#ddd6fe"
                    />
                    <rect
                      x="95"
                      y="95"
                      width="8"
                      height="8"
                      rx="1"
                      fill="#ddd6fe"
                    />
                    <rect
                      x="95"
                      y="110"
                      width="8"
                      height="8"
                      rx="1"
                      fill="#ddd6fe"
                    />
                    <rect
                      x="95"
                      y="125"
                      width="8"
                      height="8"
                      rx="1"
                      fill="#ddd6fe"
                    />
                    <rect
                      x="125"
                      y="110"
                      width="8"
                      height="8"
                      rx="1"
                      fill="#c4b5fd"
                    />
                    <rect
                      x="125"
                      y="125"
                      width="8"
                      height="8"
                      rx="1"
                      fill="#c4b5fd"
                    />
                    <circle cx="55" cy="155" r="5" fill="#22c55e" />
                    <circle cx="150" cy="155" r="5" fill="#22c55e" />
                    <circle cx="100" cy="158" r="4" fill="#f97316" />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Why add departments?
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Departments help you organize your company structure and
                improve:
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Team Organization
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Group employees by function or specialization
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Reporting & Analytics
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Track performance and metrics more effectively
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Access Control
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Manage permissions and access by department
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Handshake className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Better Collaboration
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Improve communication and workflow across teams
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
