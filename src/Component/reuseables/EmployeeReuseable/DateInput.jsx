import React from "react";

const DateInput = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block mb-2 text-gray-700">{label}</label>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-300 outline-none"
      />
    </div>
  );
};

export default DateInput;
