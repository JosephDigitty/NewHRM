import { useState } from "react";
import { HiBell } from "react-icons/hi";
import {
  FiSearch,
  FiSliders,
} from "react-icons/fi";
import CashRequisitionSidebar from "../Component/CashRequisition/CashRequisitionSidebar";

const requests = [
  {
    id: "CR-2026-00012",
    title: "Travel Advance",
    subtitle: "Travel & Logistics",
    amount: "₦250,000",
    date: "10 May, 2026",
    stage: "Unit Head Approval",
    stageDetail: "Mr. Chinedu Okafor",
    status: "Pending",
  },
  {
    id: "CR-2026-00011",
    title: "Client Meeting Expense",
    subtitle: "Client Entertainment",
    amount: "₦120,000",
    date: "8 May, 2026",
    stage: "Admin Review",
    stageDetail: "Admin Department",
    status: "In Review",
  },
  {
    id: "CR-2026-00010",
    title: "Office Supplies",
    subtitle: "General Expenses",
    amount: "₦85,000",
    date: "5 May, 2026",
    stage: "Accounts (Payment)",
    stageDetail: "Finance Department",
    status: "In Accounts",
  },
  {
    id: "CR-2026-00009",
    title: "Training Expense",
    subtitle: "Training & Development",
    amount: "₦60,000",
    date: "2 May, 2026",
    stage: "Completed",
    stageDetail: "Paid on 4 May, 2026",
    status: "Paid",
  },
  {
    id: "CR-2026-00008",
    title: "Conference Registration",
    subtitle: "Training & Development",
    amount: "₦45,000",
    date: "25 Apr, 2026",
    stage: "Rejected",
    stageDetail: "Request not approved",
    status: "Rejected",
  },
];

const statusGuide = [
  {
    label: "Unit Head Approval",
    color: "bg-orange-500",
    description: "Request is waiting for your unit head approval",
  },
  {
    label: "Admin Review",
    color: "bg-blue-500",
    description: "Request is being reviewed by admin",
  },
  {
    label: "Accounts (Payment)",
    color: "bg-purple-500",
    description: "Request has been approved and is with accounts for payment",
  },
  {
    label: "Completed",
    color: "bg-green-500",
    description: "Payment has been made successfully",
  },
];

const CashRequisitionDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Ongoing", "Completed", "Rejected"];

  const filteredRequests = requests.filter((req) => {
    if (activeTab === "All") return true;
    if (activeTab === "Ongoing")
      return req.status === "Pending" || req.status === "In Review" || req.status === "In Accounts";
    if (activeTab === "Completed") return req.status === "Paid";
    if (activeTab === "Rejected") return req.status === "Rejected";
    return true;
  });

  const totalRequests = requests.length;
  const ongoingRequests = requests.filter(
    (r) => r.status === "Pending" || r.status === "In Review" || r.status === "In Accounts"
  ).length;
  const approvedRequests = requests.filter((r) => r.status === "Paid").length;
  const rejectedRequests = requests.filter((r) => r.status === "Rejected").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CashRequisitionSidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Good morning, Joseph <span className="inline-block">👋</span>
              </h1>
              <p className="text-gray-500 mt-1">
                Track your cash requisitions and create new requests.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <HiBell className="text-2xl" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors">
                <FaPlusCircle />
                New Cash Requisition
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaClipboardList className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
                  <p className="text-xs text-gray-400">All time</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ongoing Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{ongoingRequests}</p>
                  <p className="text-xs text-gray-400">In progress</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{approvedRequests}</p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">×</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{rejectedRequests}</p>
                  <p className="text-xs text-gray-400">All time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Requests Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  My Requests
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <FiSliders />
                    Filter
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-purple-600 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Request ID
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Title
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Amount
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Date Requested
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Current Stage
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-line">
                          {req.id}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {req.title}
                            </p>
                            <p className="text-xs text-gray-500">{req.subtitle}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {req.amount}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-pre-line">
                          {req.date}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 ${
                                req.stage === "Unit Head Approval"
                                  ? "bg-orange-500"
                                  : req.stage === "Admin Review"
                                  ? "bg-blue-500"
                                  : req.stage === "Accounts (Payment)"
                                  ? "bg-purple-500"
                                  : req.stage === "Completed"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {req.stage}
                              </p>
                              <p className="text-xs text-gray-500">{req.stageDetail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              req.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : req.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : req.status === "In Review"
                                ? "bg-blue-100 text-blue-700"
                                : req.status === "In Accounts"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Track My Request */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Track My Request
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Enter a Request ID to check status
                </p>
                <input
                  type="text"
                  placeholder="e.g. CR-2026-"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-medium transition-colors">
                  Track Request
                </button>
              </div>

              {/* Request Status Guide */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Request Status Guide
                </h3>
                <div className="space-y-5">
                  {statusGuide.map((item) => (
                    <div key={item.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${item.color}`}
                        />
                        <div className="w-0.5 h-full bg-gray-200 mt-1" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashRequisitionDashboard;
