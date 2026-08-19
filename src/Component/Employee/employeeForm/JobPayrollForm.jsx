import { useState } from "react";
import Input from "../../reuseables/Input";

const JobPayrollForm = ({ data = {}, onUpdate, grades = [], departments = [] }) => {
  const [formData, setFormData] = useState({
    role:'',
    dateOfHire: "",
    employmentType: "",
    position: "",
    department: "",
    reportingTo: "",
    workShift: "",
    workLocation: "",
    bankName: "",
    bankAccountNumber: "",
    grade: "",
    ...data,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    onUpdate({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
           <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border border-purple-700 px-2 py-1 w-[200px] h-[36px] mt-7 rounded-full text-sm"
        >
          <option value="">Select Role</option>
          <option value="employee">Employee</option>
          <option value="HR">Human Resource</option>
        </select>
          </div>
          <Input
            name="dateOfHire"
            type="date"
            label="Date of Hire"
            value={formData.dateOfHire}
            onChange={handleChange}
            inputClassName="border border-purple-700 px-4 py-2 mt-1 w-full rounded-full"
          />
        </div>
        <select
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          className="border border-purple-700 px-2 py-1 w-[400px] h-[36px] mt-7 rounded-full text-sm"
        >
          <option value="">Employment Type</option>
          <option value="Full-time">Full Time</option>
          <option value="Part-time">Part Time</option>
          <option value="Contract">Contract</option>
          <option value="Intern">Intern</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          name="position"
          type="text"
          label="Position"
          placeholder="Enter position"
          value={formData.position}
          onChange={handleChange}
          inputClassName="border border-purple-700  px-4 py-2 mt-1 w-full rounded-full"
        />

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="border border-purple-700 px-2 py-1 w-[200px] h-[36px] mt-7 rounded-full text-sm"
        >
          <option value="">Select Department</option>
          {departments.map((dep) => (
            <option key={dep._id} value={dep._id}>
              {dep.department_Name}
            </option>
          ))}
        </select>

        <Input
          name="reportingTo"
          type="text"
          label="Reporting To"
          placeholder="Enter manager name"
          value={formData.reportingTo}
          onChange={handleChange}
          inputClassName="border border-purple-700 px-4 py-2 mt-1 w-full rounded-full"
        />

        <Input
          name="workShift"
          type="text"
          label="Work Shift"
          placeholder="Morning, Night, etc."
          value={formData.workShift}
          onChange={handleChange}
          inputClassName="border border-purple-700 px-4 py-2 mt-1 w-full rounded-full"
        />
      </div>

      <Input
        name="workLocation"
        type="text"
        label="Work Location"
        placeholder="Enter location"
        value={formData.workLocation}
        onChange={handleChange}
        inputClassName="border border-purple-700 px-4 py-2 mt-1 w-full rounded-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          name="bankName"
          type="text"
          label="Bank Name"
          placeholder="Enter bank name"
          value={formData.bankName}
          onChange={handleChange}
          inputClassName="border border-purple-700 px-4 py-2 mt-1 w-full rounded-full"
        />

        <Input
          name="bankAccountNumber"
          type="text"
          label="Bank Account Number"
          placeholder="Enter account number"
          value={formData.bankAccountNumber}
          onChange={handleChange}
          inputClassName="border border-purple-700 px-4 py-2 mt-1 w-full rounded-full"
        />

        <select
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          className="border border-purple-700 px-2 py-1 w-[220px] h-[42px] mt-5 rounded-full text-sm"
        >
          <option value="">Select Grade</option>
          {grades.map((grd) => (
            <option key={grd._id} value={grd._id}>
              {grd.gradeName}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default JobPayrollForm;
