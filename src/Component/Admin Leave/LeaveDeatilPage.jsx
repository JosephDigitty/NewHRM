import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";
import LoadingState from "../reuseables/LoadingState";
import { Calendar, Info, Plane, X, CheckCircle } from "lucide-react";

const LeaveDetails = () => {
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastContext();

  useEffect(() => {
    const getLeaveDetails = async () => {
      setLoading(true);
      try {
        const res = await api.post(`/leave/leavedetails/${id}`, id);
        if (res.data.success) {
          setLeaveDetails(res.data.leave);
        } else {
          showError("Failed to fetch leave details");
        }
      } catch {
        showError("Failed to fetch leave details");
      } finally {
        setLoading(false);
      }
    };
    getLeaveDetails();
  }, [id, showError]);

  useEffect(() => {
    const getLeaveBalance = async () => {
      if (!leaveDetails?.employee?._id) return;
      try {
        const res = await api.get(
          `/leave/employeebalance/${leaveDetails.employee._id}`,
        );
        if (res.data.success) {
          setLeaveBalance(res.data.leaveBalances);
        }
      } catch {
        console.error("Failed to fetch leave balance");
      }
    };
    getLeaveBalance();
  }, [leaveDetails]);

  const rejectLeave = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/leave/reject/${id}`, id);
      if (res.data.success) {
        navigate("/admin-dashboard/leaves/all");
        showSuccess("Leave rejected successfully");
      } else {
        showError("Failed to reject leave");
      }
    } catch {
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
        showSuccess("Leave approved successfully");
      } else {
        showError("Failed to approve leave");
      }
    } catch {
      showError("Failed to approve leave");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !leaveDetails) {
    return (
      <LoadingState loading={loading} loadingText="Loading leave details..." />
    );
  }

  if (!leaveDetails || !leaveDetails.employee) {
    return (
      <div className="p-10 text-center text-slate-500">
        No leave details found.
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <main className="px-4 md:px-10 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <HomeIcon />
          <span className="cursor-pointer hover:text-gray-700">Home</span>
          <span>/</span>
          <span className="cursor-pointer hover:text-gray-700">Leaves</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            Leave Request Details
          </span>
        </nav>

        {/* Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Leave Request Details
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              View and manage employee leave request information
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={rejectLeave}
              disabled={loading}
              className="h-10 px-5 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <X size={18} />
              Reject
            </button>
            <button
              onClick={approveLeave}
              disabled={loading}
              className="h-10 px-5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Approve
            </button>
          </div>
        </div>

        {/* Blue Employee Banner */}
        <div className="bg-[#2563EB] rounded-xl p-6 flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-full bg-cover bg-center border-4 border-white/30 shrink-0"
            style={{
              backgroundImage: leaveDetails.employee.profileImage
                ? `url(${leaveDetails.employee.profileImage})`
                : "none",
              backgroundColor: leaveDetails.employee.profileImage
                ? "transparent"
                : "#93c5fd",
            }}
          >
            {!leaveDetails.employee.profileImage && (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-800">
                {leaveDetails.employee.fullname?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-bold">
              {leaveDetails.employee.fullname}
            </h2>
            <p className="text-blue-100 text-sm mt-0.5">
              {leaveDetails.employee.email}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Leave Info + Reason */}
          <div className="lg:col-span-2 space-y-6">
            {/* Leave Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Info size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Leave Information
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50/70 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar size={16} />
                    <span className="text-sm">Leave Type</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {leaveDetails.leaveType?.name}
                  </p>
                </div>

                <div className="bg-purple-50/70 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {leaveDetails.numberOfDays} Days
                  </p>
                </div>

                <div className="bg-purple-50/70 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar size={16} />
                    <span className="text-sm">Start Date</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(leaveDetails.startDate)}
                  </p>
                </div>

                <div className="bg-red-50/70 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar size={16} />
                    <span className="text-sm">End Date</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(leaveDetails.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Reason for Leave */}
            <div className="bg-[#EEEDFF] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-600">
                  <MessageCircleIcon />
                </span>
                <h3 className="text-lg font-semibold text-gray-900">
                  Reason for Leave
                </h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {leaveDetails.reason || "No reason provided"}
              </p>
            </div>
          </div>

          {/* Right Column - Balance Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#EEF2FF] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChartIcon />
                <h3 className="text-lg font-semibold text-gray-900">
                  Balance Summary
                </h3>
              </div>

              <div className="space-y-3">
                {leaveBalance.length > 0 ? (
                  leaveBalance.map((balance) => (
                    <div
                      key={balance._id}
                      className="bg-white rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Plane size={20} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {balance.leaveType?.name || "Leave"}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {balance.remainingDays} days
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Plane size={20} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Sick Leave
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        5 days
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <CalendarIcon />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Casual Leave
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        8 days
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const HomeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-400"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const MessageCircleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-600"
  >
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
);

const BarChartIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-600"
  >
    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    <path d="M7 16l4-8 4 5 4-9" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-purple-600"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export default LeaveDetails;
