
import { useNavigate } from "react-router-dom";
import Button from "../reuseables/Button";
import Input from "../reuseables/Input";


const GradeForm = ({ fields, values, onChange, onSubmit, submitText = "Submit", }) => {
  const navigate = useNavigate();
  return (
   <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
      {fields.map((field) => {
        // Handle Radio Inputs
        if (field.type === "radio") {
          return (
            <div key={field.name} className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">{field.label}</label>
              <div className="flex gap-4 mt-2">
                {field.options.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={field.name}
                      value={opt.value}
                      checked={values[field.name] === opt.value}
                      onChange={onChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        }

        // Default Input for text/number/etc.
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

      <div className="flex justify-between w-full col-start-1 md:col-end-3 mt-4">
        <Button
          text="Cancel"
          onClick={() => navigate("/admin-dashboard")}
          className="bg-white text-black border border-gray-300"
        />
        <Button type="submit" text={submitText} />
      </div>
    </form>
  );
};

export default GradeForm;
