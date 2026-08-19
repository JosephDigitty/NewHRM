import Input from "../reuseables/Input";
import Button from "../reuseables/Button";
import PageHeader from "../reuseables/PageHeader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DepartmentForm = ({
  title,
  initialData = { department_Name: "", description: "" },
  onSubmit,
  cancelPath,
  submitText = "Save",
  loading = false,
  description,
}) => {
  const [department, setDepartment] = useState(initialData);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(department); // pass data to parent
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-6 py-8">
        <PageHeader
          title={title}
          description={description || "Fill in the details below to manage this department."}
          actions={
            <button
              onClick={() => navigate(cancelPath)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          }
        />
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="department_Name"
                label="Department Name"
                placeholder="New dept Name"
                value={department.department_Name}
                onChange={handleChange}
                required
              />

              <Input
                name="description"
                label="Description"
                as="textarea"
                placeholder="Description"
                value={department.description}
                onChange={handleChange}
                required
                rows={4}
                className="md:col-span-2"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                text={loading ? "Saving..." : submitText}
                disabled={loading}
                className={loading ? "opacity-50 cursor-not-allowed" : ""}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepartmentForm;
