import { useEffect, useState } from "react";
import { getEmployeeAppraisals } from "../../utils/DyamicDashboard";
import { useAuth } from "../../Context/authContext";

const Performance = () => {
  const { user } = useAuth()
  const employeeId = user?._id 
  const [appraisal, setAppraisal] = useState([])
  useEffect(() => {
    if(!employeeId) return
    const getAppraisal = async () => {
      try {
        const appraisal = await getEmployeeAppraisals(employeeId)
        setAppraisal(appraisal)
        console.log(appraisal)
      } catch (error) {
        console.log(error)
      }
    }
    getAppraisal()
  },[employeeId])
      const latestAppraised = appraisal.find(
      app => app.status === "Appraised"
      );
      const recentScore = latestAppraised?.totalScore || 0;
    const appraised = appraisal.filter(app => app.status === "Appraised").length
  const awaitingAppraisal = appraisal.filter(app => app.status === "Awaiting Appraisal").length
  
  return (
    <div className="bg-white w-full h-full p-4 rounded-xl shadow">
      <p className="font-bold">Performance appraisal</p>

      <div className="mt-4 text-sm space-y-2">
        <Row label="pending Appraisal" value={awaitingAppraisal} />
        <Row label="Completed Appraisal" value={appraised} />
        <Row label="Avg rating" value={recentScore} />
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between">
    <p>{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

export default Performance;
