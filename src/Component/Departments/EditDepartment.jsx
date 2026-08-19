import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToast from "../../utils/useToast";
import Loader from "../reuseables/Loader";
import { api } from "../../api/request";
import {
  Info,
  Building2,
  FileText,
  Hash,
  Calendar,
  Clock,
  ShieldCheck,
  Users,
  DollarSign,
  BarChart3,
  GitBranch,
  Trash2,
  ChevronLeft,
  Lightbulb,
} from "lucide-react";

const EditDepartment = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState({
    department_Name: "",
    description: "",
    departmentId: "",
    createdAt: "",
    updatedAt: "",
    status: "Active",
    employeeCount: 0,
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
          const dept = response.data.department;
          setDepartment({
            department_Name: dept.department_Name || "",
            description: dept.description || "",
            departmentId:
              dept.departmentId || `DPT-${dept._id?.slice(-4) || "0042"}`,
            createdAt: dept.createdAt || "May 10, 2024",
            updatedAt: dept.updatedAt || "May 20, 2025",
            status: dept.status || "Active",
            employeeCount: dept.employeeCount || 0,
          });
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
  }, [id, showError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

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
        },
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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEdit({
      department_Name: department.department_Name,
      description: department.description,
    });
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await api.delete(`/department/${id}`);
        showSuccess("Department deleted successfully");
        navigate("/admin-dashboard/departments");
      } catch (error) {
        showError("Error deleting department: " + error.message);
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-6 py-8 ">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Department
            </h1>
            <p className="text-gray-500 mt-1">
              Update department details and keep your organization structure up
              to date.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin-dashboard/departments")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Departments
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                Make changes to the department details below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department Name *
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
                      placeholder="Human Resources"
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
                      rows={4}
                      className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Responsible for managing employee relations, recruitment, training and overall human capital development."
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Provide a brief description of the department's purpose and
                    responsibilities.
                  </p>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Department Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Hash className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department ID</p>
                    <p className="text-sm font-medium text-gray-900">
                      {department.departmentId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created On</p>
                    <p className="text-sm font-medium text-gray-900">
                      {department.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">
                      {department.updatedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      {department.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
                Delete Department
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin-dashboard/departments")}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Updating..." : "Update Department"}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <Info className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Department Impact
                </h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Changes to this department may affect related data.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Employees
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      12 employees are currently assigned to this department.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Payroll
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Payroll records will remain intact but linked to this
                      department.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Reports
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Department reports and analytics will reflect the changes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <GitBranch className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Workflows
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Approval workflows may be impacted by department changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Tip:</span> Review all changes
                  before updating to ensure data accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;
