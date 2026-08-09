import React from "react";

const TextArea = ({ label, value, placeholder, onChange }) => {
  return (
    <div className="mt-5">
      <label className="block mb-2 text-gray-700">{label}</label>
      <textarea
        rows={4}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-300 outline-none"
      ></textarea>
    </div>
  );
};

export default TextArea;
