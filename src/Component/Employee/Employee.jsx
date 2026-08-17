import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingState from "../reuseables/LoadingState";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";
import {
  FaArrowLeft,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaChevronDown,
  FaFilePdf,
  FaFileImage,
  FaDownload,
  FaPlus,
  FaTimes,
  FaUpload,
} from "react-icons/fa";
import { getEmployee } from "../../utils/EmployeeHelper";
import { useAuth } from "../../Context/authContext";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const MOCK_DISCIPLINARY_RECORDS = [
  {
    id: 1,
    type: "Promotion",
    date: "2025-05-15",
    caseId: "DR-2025-005",
    severity: "High",
    status: "Open",
    reportedBy: "Mary Johnson (Head of Operations)",
    department: "Operations",
    nextReviewDate: "2025-08-15",
    description:
      "Employee has been late to work on multiple occasions despite previous warnings and counseling. This is the final warning issued.",
    actionTaken:
      "Final warning letter issued. Employee advised to adhere strictly to attendance policy.",
    employeeResponse:
      "Employee acknowledged the warning and committed to improvement.",
    attachments: [
      { name: "Final Warning Letter.pdf", size: "128 KB" },
      { name: "Attendance Summary - Apr-May 2025.png", size: "245 KB" },
    ],
  },
  {
    id: 2,
    type: "Query - Unauthorised Absence",
    date: "2025-04-10",
    caseId: "DR-2025-004",
    severity: "Medium",
    status: "Closed",
    reportedBy: "Mary Johnson (Head of Operations)",
    department: "Operations",
    nextReviewDate: "N/A",
    description:
      "Employee was absent without approved leave for two consecutive days.",
    actionTaken: "Written query issued. Employee provided explanation which was accepted.",
    employeeResponse: "Employee provided medical documentation for the absence.",
    attachments: [
      { name: "Query Letter.pdf", size: "96 KB" },
    ],
  },
  {
    id: 3,
    type: "First Warning - Policy Violation",
    date: "2025-03-12",
    caseId: "DR-2025-003",
    severity: "Low",
    status: "Closed",
    reportedBy: "HR Department",
    department: "Operations",
    nextReviewDate: "N/A",
    description: "Minor violation of company dress code policy.",
    actionTaken: "Verbal warning issued and policy reminder sent.",
    employeeResponse: "Employee acknowledged and agreed to comply.",
    attachments: [],
  },
  {
    id: 4,
    type: "Counselling - Performance Improvement",
    date: "2025-01-20",
    caseId: "DR-2025-002",
    severity: "Low",
    status: "Closed",
    reportedBy: "Line Manager",
    department: "Operations",
    nextReviewDate: "N/A",
    description: "Performance below expected standards in Q4 2024.",
    actionTaken: "Performance improvement plan initiated with regular check-ins.",
    employeeResponse: "Employee agreed to the improvement plan.",
    attachments: [
      { name: "PIP Document.pdf", size: "210 KB" },
    ],
  },
  {
    id: 5,
    type: "Verbal Caution - Dress Code",
    date: "2024-12-05",
    caseId: "DR-2024-001",
    severity: "Low",
    status: "Closed",
    reportedBy: "Supervisor",
    department: "Operations",
    nextReviewDate: "N/A",
    description: "Employee reported to work in inappropriate attire.",
    actionTaken: "Verbal caution given. Employee changed into appropriate attire.",
    employeeResponse: "Employee acknowledged the caution.",
    attachments: [],
  },
];

const getSeverityColor = (severity) => {
  switch (severity) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Medium":
      return "bg-orange-100 text-orange-700";
    case "Low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getSeverityBg = (severity) => {
  switch (severity) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Medium":
      return "bg-orange-100 text-orange-700";
    case "Low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusColor = (status) => {
  return status === "Open"
    ? "bg-green-100 text-green-700"
    : "bg-gray-100 text-gray-700";
};

const EmployeeSingular = () => {
  const { showError } = useToastContext();
  const [employee, setEmployeee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("disciplinary");
  const [selectedRecord, setSelectedRecord] = useState(MOCK_DISCIPLINARY_RECORDS[0]);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const { id } = useParams();

  const [recordForm, setRecordForm] = useState({
  title: "",
  type: "",
  date: "",
  status: "Open",
  location: employee?.job?.workLocation || "",
  description: "",
  actionTaken: "",
  employeeResponse: "",
  });

  useEffect(() => {
      const fetchEmployee = async () => {
        setLoading(true);

        try {
          const employee = await getEmployee(id);
          setEmployeee([employee]);
        } catch (error) {
          showError(
            error.response?.data?.error ||
            error.message ||
            "An error occurred while fetching employee"
          );
        } finally {
          setLoading(false);
        }
      };
    fetchEmployee();
  }, [id, showError]);

  if (loading) {
    return <LoadingState loading={loading} loadingText="Loading employee..." />;
  }

  const emp = employee[0];

  if (!emp) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">No employee data found</p>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "employment", label: "Employment" },
    { id: "performance", label: "Performance" },
    { id: "leave", label: "Leave" },
    { id: "documents", label: "Documents" },
    { id: "disciplinary", label: "Disciplinary Records" },
    { id: "notes", label: "Notes" },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 overflow-x-hidden font-inter">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link
            to="/admin-dashboard/employees"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <FaArrowLeft size={16} />
            <span className="text-sm font-medium">Back to Employees</span>
          </Link>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search employees, documents..."
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 w-80"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100">
            <FaBell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100">
            <FaEnvelope size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 pl-4 border-l border-slate-200 ml-2">
            <span className="text-sm font-medium text-slate-700">Acme Corporation</span>
            <FaChevronDown size={12} className="text-slate-400" />
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src={`${import.meta.env.VITE_UPLOADS_URL}/${emp.userId.profileImage}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  e.target.src = "";
                }}
              />
            </div>

            {/* Employee Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  {emp.userId.fullname}
                </h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Employee ID:{" "}
                <span className="font-medium text-slate-700">
                  {emp.employeeId || "EMP-0234"}
                </span>
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Department</p>
                  <p className="text-sm font-medium text-slate-900">
                    {emp.job?.department?.department_Name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-slate-900">
                    {emp.userId.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <p className="text-sm font-medium text-slate-900">
                    {emp.personal?.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Reports To</p>
                  <p className="text-sm font-medium text-slate-900">
                    {emp.job?.reportingTo || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Date of Joining</p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatDate(emp.job?.dateOfHire)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Manager</p>
                  <p className="text-sm font-medium text-slate-900">
                    {emp.job?.reportingTo || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Location</p>
                  <p className="text-sm font-medium text-slate-900">
                    {emp.job?.workLocation || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Employment Type</p>
                  <p className="text-sm font-medium text-slate-900">
                    {emp.job?.employmentType || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-slate-200 px-6">
            <div className="flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-teal-600 text-teal-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Full Name</p>
                    <p className="text-sm font-medium text-slate-900">
                      {emp.userId.fullname}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Gender</p>
                    <p className="text-sm font-medium text-slate-900">
                      {emp.personal?.gender || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Date of Birth</p>
                    <p className="text-sm font-medium text-slate-900">
                      {emp.personal?.dob ? formatDate(emp.personal.dob) : "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Marital Status</p>
                    <p className="text-sm font-medium text-slate-900">
                      {emp.personal?.maritalStatus || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Address</p>
                    <p className="text-sm font-medium text-slate-900">
                      {emp.personal?.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "employment" && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Employment Details
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Position</p>
                    <p className="text-sm font-medium text-slate-900">
                      {emp.job?.position || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Department</p>
                    <p className="text-sm font-medium text-slate-900">
                      {emp.job?.department?.department_Name || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Employment Type</p>
                    <p className="text-sm font-medium text-slate-900">
                      {emp.job?.employmentType || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Grade</p>
                    <p className="text-sm font-medium text-slate-900">
                      {emp.job?.grade?.gradeName || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Date of Joining</p>
                    <p className="text-sm font-medium text-slate-900">
                      {formatDate(emp.job?.dateOfHire)}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Work Location</p>
                    <p className="text-sm font-medium text-slate-900">
                      {emp.job?.workLocation || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Work Shift</p>
                    <p className="text-sm font-medium text-slate-900">
                      {emp.job?.workShift || "N/A"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Reporting To</p>
                    <p className="text-sm font-medium text-slate-900">
                      {emp.job?.reportingTo || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Performance Overview
                </h3>
                <div className="p-8 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <p className="text-slate-500">Performance appraisal data will be displayed here.</p>
                </div>
              </div>
            )}

            {activeTab === "leave" && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Leave Management
                </h3>
                <div className="p-8 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <p className="text-slate-500">Leave records and balances will be displayed here.</p>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Documents
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {emp.documents?.offerLetter && (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <FaFilePdf className="text-red-500 text-xl" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Offer Letter</p>
                          <p className="text-xs text-slate-500">PDF Document</p>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-teal-600">
                        <FaDownload size={16} />
                      </button>
                    </div>
                  )}
                  {emp.documents?.resume && (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <FaFilePdf className="text-red-500 text-xl" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Resume</p>
                          <p className="text-xs text-slate-500">PDF Document</p>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-teal-600">
                        <FaDownload size={16} />
                      </button>
                    </div>
                  )}
                  {emp.documents?.nationalId && (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <FaFileImage className="text-blue-500 text-xl" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">National ID</p>
                          <p className="text-xs text-slate-500">Image Document</p>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-teal-600">
                        <FaDownload size={16} />
                      </button>
                    </div>
                  )}
                  {emp.documents?.passport && (
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <FaFileImage className="text-blue-500 text-xl" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">Passport</p>
                          <p className="text-xs text-slate-500">Image Document</p>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-teal-600">
                        <FaDownload size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "disciplinary" && (
              <DisciplinaryRecords
                records={MOCK_DISCIPLINARY_RECORDS}
                selectedRecord={selectedRecord}
                setSelectedRecord={setSelectedRecord}
                employee={emp}
              />
            )}

            {activeTab === "notes" && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Notes
                </h3>
                <div className="p-8 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <p className="text-slate-500">Employee notes will be displayed here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

const DisciplinaryRecords = ({ records, selectedRecord, setSelectedRecord, employee }) => {
  const {id} = useParams()
  const {user} = useAuth()
  const userid = user._id
  const [filterType, setFilterType] = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const { showSuccess, showError } = useToastContext();
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.caseId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "All Types" ||
      record.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesStatus =
      filterStatus === "All Status" || record.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

    const [showRecordModal, setShowRecordModal] = useState(false);

    const [recordForm, setRecordForm] = useState({
      title: "",
      type: "",
      date: "",
      status: "Open",
      location: employee?.job?.workLocation || "",
      description: "",
      actionTaken: "",
      employeeResponse: "",
    });

    const handleSubmit = async (e) => {
      e.preventDefault()
      console.log("Document to upload:", recordForm.document);
      try {
        const formData = new FormData();
        
      formData.append("title", recordForm.title);
      formData.append("description", recordForm.description);
      formData.append("date", recordForm.date);
      formData.append("type", recordForm.type);
      formData.append("status", recordForm.status);
      formData.append("location", recordForm.location);
      formData.append("actionTaken", recordForm.actionTaken);
      formData.append("employeeResponse",recordForm.employeeResponse);
      formData.append("userid", userid);

      if (recordForm.document) {
        formData.append("document", recordForm.document);
      }

      const res = await api.post(
        `/employee/employee-records/${id}`,
        formData
      )
      if (res.data.success) {
        showSuccess(res.data.message)
        setShowRecordModal(false)
        setRecordForm({
        title: "",
        description: "",
        date: "",
        type: "",
        status: "Open",
        location: "",
        actionTaken: "",
        employeeResponse: "",
        document: null,
      });
      } else {
         alert("error alert")
         console.log(res.data)
      }
      } catch (error) {
        showError(error.response?.data?.error || "Failed to create record");
      }

    } 

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Disciplinary Records
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage disciplinary actions, queries, warnings and other
            employee related incidents.
          </p>
        </div>
        <button
        onClick={() => setShowRecordModal(true)}
        className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 flex items-center gap-2 transition-colors"
        >
        <FaPlus size={14} />
        New Employee Record
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 bg-white"
        >
          <option>All Types</option>
          <option>Promotion</option>
            <option>Training</option>
            <option>Query</option>
            <option>Misconduct</option>
            <option>Absence</option>
            <option>Warning</option>
            <option>Commendation</option>
            <option>Other</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 bg-white"
        >
          <option>All Status</option>
          <option>Open</option>
          <option>Closed</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="From - Select date"
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 w-40"
          />
          <span className="text-slate-400">-</span>
          <input
            type="text"
            placeholder="To - Select date"
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 w-40"
          />
        </div>
        <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
          Reset
        </button>
        <div className="relative ml-auto">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 w-64"
          />
        </div>
      </div>

      {/* Records List + Detail */}
      <div className="flex gap-6">
        {/* Left: Records List */}
        <div className="w-2/5 space-y-3">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedRecord?.id === record.id
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getSeverityBg(
                    record.severity
                  )}`}
                >
                  {record.type.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium text-slate-900 truncate">
                      {record.type}
                    </h4>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${getSeverityColor(
                        record.severity
                      )}`}
                    >
                      {record.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDate(record.date)} · Case ID: {record.caseId}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Detail View */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 p-6">
          {selectedRecord ? (
            <div>
              {/* Detail Header */}
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-base font-semibold text-slate-900">
                  {selectedRecord.type}
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      selectedRecord.status
                    )}`}
                  >
                    {selectedRecord.status}
                  </span>
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    ...
                  </button>
                </div>
              </div>

              {/* Info Fields */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Incident Date</p>
                    <p className="text-sm text-slate-900">
                      {formatDate(selectedRecord.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Type</p>
                    <p className="text-sm text-slate-900">
                      {selectedRecord.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Reported By</p>
                    <p className="text-sm text-slate-900">
                      {selectedRecord.reportedBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <p className="text-sm text-slate-900">
                      {selectedRecord.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Department</p>
                    <p className="text-sm text-slate-900">
                      {selectedRecord.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Location</p>
                    <p className="text-sm text-slate-900">
                      {employee?.job?.workLocation || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Next Review Date</p>
                    <p className="text-sm text-slate-900">
                      {formatDate(selectedRecord.nextReviewDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-slate-200 pt-4 mb-4">
                <h5 className="text-sm font-semibold text-slate-900 mb-2">
                  Description
                </h5>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedRecord.description}
                </p>
              </div>

              {/* Action Taken */}
              <div className="border-t border-slate-200 pt-4 mb-4">
                <h5 className="text-sm font-semibold text-slate-900 mb-2">
                  Action Taken
                </h5>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li>{selectedRecord.actionTaken}</li>
                </ul>
              </div>

              {/* Employee Response */}
              <div className="border-t border-slate-200 pt-4 mb-4">
                <h5 className="text-sm font-semibold text-slate-900 mb-2">
                  Employee Response
                </h5>
                <p className="text-sm text-slate-600">
                  {selectedRecord.employeeResponse}
                </p>
              </div>

              {/* Attachments */}
              <div className="border-t border-slate-200 pt-4">
                <h5 className="text-sm font-semibold text-slate-900 mb-3">
                  Attachments ({selectedRecord.attachments.length})
                </h5>
                <div className="space-y-2">
                  {selectedRecord.attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        {file.name.endsWith(".pdf") ? (
                          <FaFilePdf className="text-red-500" />
                        ) : (
                          <FaFileImage className="text-blue-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500">{file.size}</p>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-teal-600">
                        <FaDownload size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-400">
              <p>Select a record to view details</p>
            </div>
          )}
        </div>
      </div>
      {/* New Employee Record Modal */}
{showRecordModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
    onClick={() => setShowRecordModal(false)}
  >
    <div
      className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            New Employee Record
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Add a new record to this employee's HR history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRecordModal(false)}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <FaTimes />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();       // 1. Prevents page reload immediately
          await handleSubmit(e);
          setShowRecordModal(false);
          console.log("New employee record:", recordForm);
          setRecordForm({
            title: "",
            type: "",
            date: "",
            status: "Open",
            location: employee?.job?.workLocation || "",
            description: "",
            actionTaken: "",
            employeeResponse: "",
          });
        }}
        className="p-6"
      >
        {/* Employee */}
        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500 mb-1">
            Employee
          </p>

          <p className="text-sm font-semibold text-slate-900">
            {employee?.userId?.fullname || "N/A"}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {employee?.employeeId || "N/A"} ·{" "}
            {employee?.job?.department?.department_Name || "N/A"}
          </p>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Title */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={recordForm.title}
              onChange={(e) =>
                setRecordForm({
                  ...recordForm,
                  title: e.target.value,
                })
              }
              placeholder="e.g. Promotion to Senior Staff"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Record Type <span className="text-red-500">*</span>
            </label>

            <select
              value={recordForm.type}
              onChange={(e) =>
                setRecordForm({
                  ...recordForm,
                  type: e.target.value,
                })
              }
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
            >
              <option value="">Select record type</option>
              <option value="Promotion">Promotion</option>
              <option value="Training">Training</option>
              <option value="Query">Query</option>
              <option value="Misconduct">Misconduct</option>
              <option value="Absence">Absence</option>
              <option value="Warning">Warning</option>
              <option value="Commendation">Commendation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              value={recordForm.date}
              onChange={(e) =>
                setRecordForm({
                  ...recordForm,
                  date: e.target.value,
                })
              }
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>

            <select
              value={recordForm.status}
              onChange={(e) =>
                setRecordForm({
                  ...recordForm,
                  status: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
            >
              <option value="Open">Open</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location
            </label>

            <input
              type="text"
              value={recordForm.location}
              onChange={(e) =>
                setRecordForm({
                  ...recordForm,
                  location: e.target.value,
                })
              }
              placeholder="e.g. Lagos Branch"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>

          <textarea
            rows={4}
            value={recordForm.description}
            onChange={(e) =>
              setRecordForm({
                ...recordForm,
                description: e.target.value,
              })
            }
            placeholder="Describe the event, reason or record..."
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
          />
        </div>

        {/* Action Taken */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Action Taken
          </label>

          <textarea
            rows={3}
            value={recordForm.actionTaken}
            onChange={(e) =>
              setRecordForm({
                ...recordForm,
                actionTaken: e.target.value,
              })
            }
            placeholder="Describe any action taken..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
          />
        </div>

        {/* Employee Response */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Employee Response
          </label>

          <textarea
            rows={3}
            value={recordForm.employeeResponse}
            onChange={(e) =>
              setRecordForm({
                ...recordForm,
                employeeResponse: e.target.value,
              })
            }
            placeholder="Enter employee's response or explanation..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500"
          />
        </div>

        {/* Supporting Documents */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Supporting Documents
          </label>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-teal-400 transition-colors">
            <FaUpload className="mx-auto text-slate-400 text-xl mb-2" />

            <p className="text-sm text-slate-600">
              Upload supporting documents
            </p>

            <p className="text-xs text-slate-400 mt-1">
              PDF, DOCX, JPG or PNG
            </p>

            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setRecordForm({ ...recordForm, document: e.target.files[0] });
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-5 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setShowRecordModal(false)}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700"
          >
            Save Record
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default EmployeeSingular;
