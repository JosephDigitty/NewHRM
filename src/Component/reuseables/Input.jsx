import React from "react";

const Input = ({
  id,
  name,
  label,
  as = "input", // input, textarea, select, radio-group
  type = "text",
  value,
  placeholder,
  onChange,
  required = false,
  disabled = false,
  className = "",
  inputClassName = "mt-1 w-full p-2 border border-gray-300 rounded-md",
  labelClassName = "block text-sm font-medium text-gray-700",
  rows = 3, // only for textarea
  options = [], // for select or radio-group
  accept, // for file input
}) => {
  const commonProps = {
    id: id || name,
    name,
    value,
    placeholder,
    onChange,
    required,
    disabled,
    className: inputClassName,
  };

  return (
    <div className={className}>
      {label && (
        <label className={labelClassName} htmlFor={id || name}>
          {label}
        </label>
      )}

      {as === "textarea" ? (
        <textarea {...commonProps} rows={rows} />
      ) : as === "select" ? (
        <select {...commonProps}>
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value || opt._id} value={opt.value || opt._id}>
              {opt.label || opt.department_Name || opt.gradeName}
            </option>
          ))}
        </select>
      ) : as === "radio-group" ? (
        <div className="flex gap-4 mt-2">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={onChange}
                disabled={disabled}
              />
              {opt.label}
            </label>
          ))}
        </div>
      ) : (
        <input {...commonProps} type={type} accept={accept} />
      )}
    </div>
  );
};

export default Input;
