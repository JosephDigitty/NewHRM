import React, { useEffect, useState } from "react";
import LeaveTypeSelect from "../reuseables/EmployeeReuseable/LeaveTypeSelect";
import DateInput from "../reuseables/EmployeeReuseable/DateInput";
import TextArea from "../reuseables/EmployeeReuseable/TextArea";
import Button from "../reuseables/Button";
import { useAuth } from "../../Context/authContext";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";


const LeaveRequestForm = ({leavetypes}) => {

  const {user} = useAuth()
  const employeeId = user?._id
  const navigate = useNavigate()
  const { showSuccess, showError } = useToastContext();
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

 
  const handleSubmit = async (e) => {
  e.preventDefault(); 

  const payload = {
    employeeId,
    leaveTypeId,
    startDate,
    endDate,
    reason,
  };

  console.log("FRONTEND PAYLOAD:", payload);

  try {
    const response = await api.post("/leave/add-leave", payload);
    if (response.data.success) {
      showSuccess(response.data.message);
      navigate("/employee-dashboard/leaves");
    } else {
      navigate("/employee-dashboard/leaves")
      showError(response.data.message);
      console.log(leaveTypeId)
    }
  } catch (error) {
    console.log(error);
    showError(error || "Something went wrong");
  }
};

  return (
    <form leavetypes={leavetypes} onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-md border border-gray-200 mb-10">

      <h2 className="text-xl font-semibold mb-6">Leave Request Form</h2>
      <div className="px-40">
        {/* Leave Type */}
        <LeaveTypeSelect
          value={leaveTypeId}
          onChange={(e) => setLeaveTypeId(e.target.value)}
        />
        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4 mt-5">
          <DateInput
            label="Start date *"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DateInput
            label="End date *"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Reason */}
        <TextArea
          label="Reason for leave *"
          placeholder="Please provide a brief reason for your leave request"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {/* Submit */}
        <Button text={"Submit leave request"} type="submit" />
      </div>
    </form>
  );
};

export default LeaveRequestForm;
