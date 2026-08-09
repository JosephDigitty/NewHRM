import axios from "axios";
import React, { useEffect, useState } from "react";
import { api } from "../../../api/request";

import { useToastContext } from "../../../Context/ToastContext";



const LeaveTypeSelect = ({ value, onChange, leavetypes }) => {

  const [leaveType, setLeaveType] = useState([]) 
   const { showError } = useToastContext();
  useEffect(()=> {
    const getLeave = async () => {
      try{
         const res = await api.get("/leave/leaveType")
         if(res.data.success) {
          setLeaveType(res.data.leaveTypes)
          console.log(res.data.leaveTypes)
         }

      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
         
        }
      }
    };
    getLeave();
  }, []);

  return (
    <div>
      <label className="block text-gray-700 mb-2">Leave type *</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          leavetypes={leavetypes}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-300 outline-none appearance-none"
        >
          <option>Select Leave Type</option>
          {leaveType.map((lev) => (
            <option key={lev._id} value={lev._id}>
              {lev.name}
            </option>
          ))}
        </select>

        <span className="absolute right-4 top-3.5 text-gray-500">▼</span>
      </div>

      <p className="text-xs text-gray-500 mt-2">12 days available</p>
    </div>
  );
};

export default LeaveTypeSelect;
