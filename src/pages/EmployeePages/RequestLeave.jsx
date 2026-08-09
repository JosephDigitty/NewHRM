import { useEffect, useState } from "react";
import LeaveRequestForm from "../../Component/EmployeeComponents/LeaveRequestForm";
import RequestSummary from "../../Component/EmployeeComponents/RequestSummary";
import { useToastContext } from "../../Context/ToastContext";
import { api } from "../../api/request";


const LeavePage = () => {

const [leavetype, setLeavetype] = useState([]) 
  const { showError } = useToastContext()
  useEffect(()=> {
    const getLeave = async () => {
      try{
         const res = await api.get("/leave/leaveType")
         if(res.data.success) {
          setLeavetype(res.data.leaveTypes)
          console.log(res.data.leaveTypes)
         }
      } catch (error) {
          if(error.response && !error.response.data.success) {
                showError(error.response.data.error)
                console.log(error)
              } else {
                showError("Failed to fetch leave types")
              }
      } 
    } 
    getLeave()
  }, [])

  return (
    <div className="p-8">
      <div>
        <h1 className="text-2xl font-bold">Request Leave </h1>
        <p className="text-gray-600 text-sm">
          Submit a new leave request for approval.
        </p>
      </div>

      <LeaveRequestForm leavetypes={leavetype} />
      <LeaveRequestForm leavetypes={leavetype} />

      <RequestSummary leaveType="Annual leave" available={12} />
    </div>
  );
};
export default LeavePage;
