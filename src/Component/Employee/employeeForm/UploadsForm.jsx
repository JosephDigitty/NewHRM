import { useState } from "react";
import Input from "../../reuseables/Input";

const UploadsForm = ({ data = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    offerLetter: null,
    resume: null,
    nationalId: null,
    passport: null,
    ...data,
  });

  const handleChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));
    onUpdate({ [name]: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          name: "offerLetter",
          label: "Offer Letter (required)",
          accept: ".pdf,.doc,.docx",
          required: true,
        },
        {
          name: "resume",
          label: "Resume/CV (required)",
          accept: ".pdf,.doc,.docx",
          required: true,
        },
        {
          name: "nationalId",
          label: "National ID",
          accept: ".pdf,.jpg,.png,.jpeg",
        },
        { name: "passport", label: "Passport", accept: ".jpg,.png,.jpeg" },
      ].map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="mb-2 font-medium">{field.label}</label>
          <input
            type="file"
            name={field.name}
            accept={field.accept}
            required={field.required}
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                       file:rounded-full file:border-0 file:text-sm file:font-semibold 
                       file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {/* 👇 show filename if file is selected */}
          {formData[field.name] && (
            <p className="mt-1 text-xs text-purple-600">
              {formData[field.name].name} uploaded ✔
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default UploadsForm;
