import { useState } from "react";
import Input from "../../reuseables/Input";
import SubTitle from "../../reuseables/SubTitle";

const PersonalInfoForm = ({
  data = {},
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    password: "",
    address: "",
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
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
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4 md:gap-6 ">
      <div className="grid-cols-1 grid md:grid-cols-3 gap-4 ">
        <Input
          label="Full Name"
          name="fullname"
          placeholder="Enter full name"
          value={formData.fullname}
          onChange={handleChange}
          inputClassName="border px-4 py-2 mt-1 w-full rounded-full"
          required
        />
        <select name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="border px-4 py-2 w-[250px] h-[45px] ml-3 mt-5 rounded-full"
        >
        <option value="">Select Gender </option>
        <option value="male">Male </option>
        <option value="female">Female </option>
        </select>
        <Input
          label="Date of Birth"
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          inputClassName="border px-4 py-2 mt-1 w-full rounded-full"
          required
        />
      </div>
      <div className="grid-cols-1 grid md:grid-cols-4 gap-4 ">
       <select name="maritalStatus"
        onChange={handleChange}
        value={formData.maritalStatus}
        className="border px-4 py-2 w-[190px] h-[45px] mt-5 rounded-full"
        >
        <option value="">Marital Status </option>
        <option value="single">Single</option>
        <option value="married">Married </option>
        <option value="divorced">Divorced </option>
        </select>
        <Input
          type="password"
          label="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          inputClassName="border px-4 py-2 mt-1 w-full rounded-full"
          required
        />
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          inputClassName="border px-4 py-2 mt-1 w-full rounded-full"
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
          inputClassName="border px-4 py-2 mt-1 w-full rounded-full"
          required
        />
      </div>

      <Input
        label="Home Address"
        name="address"
        placeholder="Enter home address"
        value={formData.address}
        onChange={handleChange}
        inputClassName="border px-4 py-2 mt-1 w-full rounded-full"
      />

      <SubTitle text={"Emergency Contact"} textSize={"text-lg"} />
      <div className="grid-cols-1 grid md:grid-cols-3 gap-4">
        <Input
          label="Full Name"
          name="emergencyName"
          placeholder="Enter name"
          value={formData.emergencyName}
          onChange={handleChange}
          inputClassName="border px-4 py-2 mt-1 w-full rounded-full"
          required
        />
        <Input
          label="Relationship"
          name="emergencyRelationship"
          placeholder="e.g. Brother"
          value={formData.emergencyRelationship}
          onChange={handleChange}
          inputClassName="border px-4 py-2 mt-1 w-full rounded-full"
          required
        />
        <Input
          label="Phone Number"
          name="emergencyPhone"
          placeholder="Enter phone number"
          value={formData.emergencyPhone}
          onChange={handleChange}
          inputClassName="border px-4 py-2 mt-1 w-full rounded-full"
          required
        />
      </div>
    </form>
  );
};

export default PersonalInfoForm;

