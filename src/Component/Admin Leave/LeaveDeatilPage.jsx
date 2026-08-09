import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";
import LoadingState from "../reuseables/LoadingState";
const LeaveDetails = () => {
  const [leaveDetails, setLeaveDeatils] = useState(null);
  const [loading, setLoading] = useState(false);
  const id = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastContext();
  useEffect(() => {
    const getLeaveDetails = async () => {
      setLoading(true);
      try {
        const res = await api.post(`/leave/leavedetails/${id}`, id);
        if (res.data.success) {
          setLeaveDeatils(res.data.leave);
          console.log(res.data.leave);
          showSuccess("Leave details fetched successfully");
        } else {
          console.log("something went wrong");
          showError("Failed to fetch leave details");
        }
      } catch (error) {
        console.log(error);
        showError("Failed to fetch leave details");
      } finally {
        setLoading(false);
      }
    };
    getLeaveDetails();
  }, [id]);

  const rejectLeave = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/leave/reject/${id}`, id);
      if (res.data.success) {
        navigate("/admin-dashboard/leaves/all");
        console.log(res.data.leave);
        showSuccess("Leave rejected successfully");
      } else {
        console.log("something went wrong");
        showError("Failed to reject leave");
      }
    } catch (error) {
      console.log(error);
      showError("Failed to reject leave");
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/leave/approve/${id}`, id);
      if (res.data.success) {
        navigate("/admin-dashboard/leaves/all");
        console.log(res.data.leave);
        showSuccess("Leave approved successfully");
      } else {
        console.log("something went wrong");
        showError("Failed to approve leave");
      }
    } catch (error) {
      console.log(error);
      showError("Failed to approve leave");
    } finally {
      setLoading(false);
    }
  };

  if (!leaveDetails || !leaveDetails.employee) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading leave details...
      </div>
    );
  }

  return (
    <main className="px-4 md:px-10 py-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-500">
          Home / Leaves /{" "}
          <span className="text-black dark:text-white">
            Request #LR-2023-8492
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Leave Request Details
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={rejectLeave}
              className="h-10 px-4 rounded-lg  border font-bold hover:bg-red-700 hover:text-white cursor-pointer"
            >
              Reject
            </button>
            <button
              onClick={approveLeave}
              className="h-10 px-6 rounded-lg bg-[#5048e5] text-white font-bold bg-blue-600 hover:bg-blue-400 cursor-pointer"
            >
              Approve
            </button>
          </div>
        </div>

        {/* Card */}
        <section className="bg-white rounded-xl border  overflow-hidden">
          {/* Profile */}
          <div className="p-6 border-b flex items-center gap-6">
            <div
              className="size-24 rounded-full bg-cover border-4"
              style={{
                backgroundImage: `url(http://localhost:3001/uploads/${leaveDetails.employee.profileImage})`,
              }}
            />

            <div>
              <h3 className="text-2xl font-bold">
                {leaveDetails?.employee.fullname}
              </h3>
              <p className="text-slate-500 text-sm">
                {leaveDetails.employee.email}
              </p>
            </div>
          </div>

          {/* Leave Info */}
          <div className="p-6 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h4 className="text-sm font-bold uppercase text-slate-500">
                  Leave Information
                </h4>

                <div className="grid sm:grid-cols-2 gap-6 mt-4">
                  <div>
                    <p className="text-sm text-slate-500">Leave Type</p>
                    <p className="font-medium">{leaveDetails.leaveType.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Duration</p>
                    <p className="font-medium">{`${leaveDetails.numberOfDays} Days`}</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Start Date</p>
                    <p className="font-medium">
                      {new Date(leaveDetails.startDate).toLocaleDateString(
                        "en-GB",
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">End Date</p>
                    <p className="font-medium">
                      {new Date(leaveDetails.endDate).toLocaleDateString(
                        "en-GB",
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase text-slate-500">
                  Reason for Leave
                </h4>
                <div className="bg-slate-100 rounded-lg p-4 mt-3">
                  {leaveDetails.reason}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="bg-[#137fec]/5 rounded-xl p-5">
              <h4 className="text-sm font-bold uppercase text-slate-500 mb-4">
                Balance Summary
              </h4>

              <div className="space-y-4">
                <div className="bg-white  p-3 rounded-lg">
                  <p className="text-xs text-slate-500">Sick Leave</p>
                  <p className="text-2xl font-bold">5 days</p>
                </div>

                <div className="bg-white  p-3 rounded-lg">
                  <p className="text-xs text-slate-500">Casual Leave</p>
                  <p className="text-2xl font-bold">8 days</p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LeaveDetails;
