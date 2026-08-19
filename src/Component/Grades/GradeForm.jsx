
import { useNavigate } from "react-router-dom";
import Button from "../reuseables/Button";
import Input from "../reuseables/Input";


const GradeForm = ({ fields, values, onChange, onSubmit, submitText = "Submit", }) => {
  const navigate = useNavigate();
  return (
   <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((field) => {
        if (field.type === "radio") {
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">{field.label}</label>
              <div className="flex gap-4 mt-2">
                {field.options.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={field.name}
                      value={opt.value}
                      checked={values[field.name] === opt.value}
                      onChange={onChange}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        }

        return (
          <Input
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type || "text"}
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={onChange}
            required={field.required}
          />
        );
      })}

      <div className="flex justify-between w-full col-span-1 md:col-span-2 mt-4">
        <Button
          text="Cancel"
          onClick={() => navigate("/admin-dashboard")}
          className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        />
        <Button type="submit" text={submitText} />
      </div>
    </form>
  );
};

export default GradeForm;
