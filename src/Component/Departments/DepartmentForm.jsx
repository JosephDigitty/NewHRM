import SubTitle from "../reuseables/SubTitle";
import Input from "../reuseables/Input";
import Button from "../reuseables/Button";
import Loader from "../reuseables/Loader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DepartmentForm = ({
  title,
  initialData = { department_Name: "", description: "" },
  onSubmit,
  cancelPath,
  submitText = "Save",
  loading = false,
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
    <div className="w-full h-[80vh] flex items-center justify-center">
      <div className="md:w-[60%] w-full bg-white p-8 rounded-md shadow-md min-w-96">
        <SubTitle text={title} className="mb-8 text-center" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
          />

          <div className="flex justify-between">
            <Button
              text="Cancel"
              onClick={() => navigate(cancelPath)}
              className="bg-white text-black border-1"
            />
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
  );
};

export default DepartmentForm;
