import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./Context/ToastContext";
import ToastContainer from "./Component/reuseables/ToastContainer";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

import Employees from "./Component/Employees";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Department from "./Component/Departments";
import Leaves from "./Component/Leaves";
import Salaries from "./Component/Salaries";
import Settings from "./Component/Settings";
import AddDepartment from "./Component/Departments/AddDepartment";
import EditDepartment from "./Component/Departments/EditDepartment";
import AddEmployee from "./Component/Employee/AddEmployee";
import EmployeeSingular from "./Component/Employee/Employee";
import EditEmployee from "./Component/Employee/EditEmployee";
import ViewSalary from "./Component/Salary/ViewSalary";
import EmployeeDetails from "./Component/EmployeeDashBoard/EmployeeDetail";
import AddGrades from "./Component/Grades/AddGrades";
import UpdateTemporarySalaryModifiers from "./Component/Payroll/UpdateTemporarymodi";
import PayrollDashboard from "./Component/Payroll/PayrollDashboard";
import EmployeeTemporary from "./Component/Payroll/EmployeeTemporary";
import DashBoard from "./pages/DashBoard";
import GradeList from "./Component/Grades/GradeList";
import SalaryModifiers from "./Component/Payroll/AddSalaryModifiers";
import EmployeeSidebar from "./Component/EmployeeDashBoard/EmployeeSidebar";
import EmployeePermanent from "./Component/Payroll/EmployeePermanent";
import CreatePayroll from "./Component/Payroll/CreatePayroll";
import AddPermanentSalaryModifiers from "./Component/Payroll/AddPermSalModifier";
import UpdatePermanentSalaryModifiers from "./Component/Payroll/UpdatePermanentModifier";
import GeneratePayroll from "./Component/Payroll/GeneratePayroll";
import GeneratePension from "./Component/Payroll/GeneratePension";
import GenerateITF from "./Component/Payroll/GenerateITF";
import GenerateNSITF from "./Component/Payroll/GenerateNSITF";
import GeneratePayrollForBank from "./Component/Payroll/PayrollforBank";
import EmployeeProfile from "./Component/EmployeeDashBoard/EmployeeProfile";
import CreateHmo from "./Component/Hmo/CreateHmo";
import GetHmo from "./Component/Hmo/GetHmo";

import SalaryOverview from "./pages/EmployeePages/SalaryOverview";
import PayslipHistory from "./pages/EmployeePages/PayslipHistory";
import LeaveDashboard from "./pages/EmployeePages/LeaveDashboard";
import RequestLeave from "./pages/EmployeePages/RequestLeave";
import LeaveManagement from "./Component/Admin Leave/LeavePage";
import LeaveDetails from "./Component/Admin Leave/LeaveDeatilPage";

import TaskDetail from "./Component/Task/TaskDetail";
import TaskActivity from "./Component/Task/TaskActivity";
import EditTask from "./Component/Task/EditTask";
import ProtectedRoute, { AppraisalLayout } from "./Component/ProtectedRoute";
import AppraisalDashboard from "./pages/AppraisalDashboard";
import AdminAppraisalDashboard from "./pages/AdminAppraisalDashboard";
import EmployeeAppraisalDashboard from "./pages/EmployeeAppraisalDashboard";
import CreateAppraisalCycle from "./pages/CreateAppraisalCycle";
import EmployeeSelfAppraisal from "./pages/EmployeeSelfAppraisal";
import AssignKpiPage from "./pages/AssignKpi";
import AppraisalCycles from "./pages/ApprisalCycles";
import EditAppraisalCycle from "./pages/EditAppraisalCycle";
import SupervisorReview from "./pages/SupervisorReview";
import PerformanceResults from "./pages/PerformanceResults";
import MyAppraisals from "./pages/MyAppraisals";
import SupervisorAppraisals from "./pages/SupervisorAppraisal";
import GeneratePayee from "./Component/Payroll/GeneratePAYE";
import GeneratePayrollNew from "./Component/Payroll/GeneratePayrollN";
import EditHmo from "./Component/Hmo/EditHmo";

const App = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />

          {/* Appraisal Dashboard Routes */}
          <Route
            path="/appraisal-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "HR", "employee"]}>
                <AppraisalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appraisal-dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={["admin", "HR"]}>
                <AdminAppraisalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appraisal-dashboard/my-appraisals"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <AppraisalLayout>
                  <MyAppraisals />
                </AppraisalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appraisal-dashboard/Team-appraisals"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <AppraisalLayout>
                  <SupervisorAppraisals />
                </AppraisalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appraisal-dashboard/employee"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeAppraisalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appraisal-dashboard/my-appraisal/:id"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <AppraisalLayout>
                  <EmployeeSelfAppraisal />
                </AppraisalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appraisal-dashboard/team-appraisals/:id"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <AppraisalLayout>
                  <SupervisorReview />
                </AppraisalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appraisal-dashboard/create-cycle"
            element={
              <ProtectedRoute allowedRoles={["admin", "HR"]}>
                <AppraisalLayout>
                  <CreateAppraisalCycle />
                </AppraisalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appraisal-dashboard/appraisal-cycles"
            element={
              <ProtectedRoute allowedRoles={["admin", "HR"]}>
                <AppraisalLayout>
                  <AppraisalCycles />
                </AppraisalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appraisal-dashboard/appraisal-cycle/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "HR"]}>
                <AppraisalLayout>
                  <EditAppraisalCycle />
                </AppraisalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appraisal-dashboard/setKpis"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <AppraisalLayout>
                  <AssignKpiPage />
                </AppraisalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appraisal-dashboard/supervisor-review"
            element={
              <ProtectedRoute allowedRoles={["teamlead"]}>
                <AppraisalLayout>
                  <SupervisorReview />
                </AppraisalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appraisal-dashboard/performance-results"
            element={
              <ProtectedRoute
                allowedRoles={["employee", "teamlead", "admin", "HR"]}
              >
                <AppraisalLayout>
                  <PerformanceResults />
                </AppraisalLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<DashBoard />}></Route>
            <Route
              path="/admin-dashboard/employees"
              element={<Employees />}
            ></Route>
            <Route
              path="/admin-dashboard/employees/:id"
              element={<EmployeeSingular />}
            ></Route>
            <Route
              path="/admin-dashboard/edit-employees/:id"
              element={<EditEmployee />}
            ></Route>

            <Route
              path="/admin-dashboard/add-employee"
              element={<AddEmployee />}
            ></Route>
            <Route
              path="/admin-dashboard/departments"
              element={<Department />}
            ></Route>
            <Route path="/admin-dashboard/leaves" element={<Leaves />}></Route>
            <Route
              path="/admin-dashboard/leaves/all"
              element={<LeaveManagement />}
            ></Route>
            <Route
              path="/admin-dashboard/leave/:id"
              element={<LeaveDetails />}
            ></Route>
            <Route
              path="/admin-dashboard/hmo-create"
              element={<CreateHmo />}
            ></Route>
            <Route
              path="/admin-dashboard/hmo/:id"
              element={<EditHmo />}
            ></Route>
            <Route path="/admin-dashboard/hmo" element={<GetHmo />}></Route>
            <Route
              path="/admin-dashboard/payrolls/modifiers/temporary"
              element={<EmployeeTemporary />}
            ></Route>
            <Route
              path="/admin-dashboard/payroll"
              element={<PayrollDashboard />}
            ></Route>
            <Route
              path="/admin-dashboard/payroll/generate-Payroll"
              element={<GeneratePayroll />}
            ></Route>
            <Route
              path="/admin-dashboard/payroll/generate-new"
              element={<GeneratePayrollNew />}
            ></Route>
            <Route
              path="/admin-dashboard/payrolls/create-all/"
              element={<CreatePayroll />}
            ></Route>
            <Route
              path="/admin-dashboard/payroll/permanent"
              element={<EmployeePermanent />}
            ></Route>
            <Route
              path="/admin-dashboard/payroll/pension"
              element={<GeneratePension />}
            ></Route>
            <Route
              path="/admin-dashboard/payroll/payee"
              element={<GeneratePayee />}
            ></Route>
            <Route
              path="/admin-dashboard/payroll/itfs"
              element={<GenerateITF />}
            ></Route>
            <Route
              path="/admin-dashboard/payroll/nsitfs"
              element={<GenerateNSITF />}
            ></Route>
            <Route
              path="/admin-dashboard/payrolls/create-banks/"
              element={<GeneratePayrollForBank />}
            ></Route>
            <Route
              path="/admin-dashboard/settings"
              element={<Settings />}
            ></Route>
            <Route
              path="/admin-dashboard/add-new-department"
              element={<AddDepartment />}
            ></Route>
            <Route
              path="/admin-dashboard/departments/:id"
              element={<EditDepartment />}
            ></Route>
            <Route
              path="/admin-dashboard/grade/add"
              element={<AddGrades />}
            ></Route>
            <Route
              path="/admin-dashboard/grades/all"
              element={<GradeList />}
            ></Route>
          </Route>
          <Route path="/employee-dashboard" element={<EmployeeDashboard />}>
            <Route index element={<EmployeeDetails />}></Route>
            <Route
              path="/employee-dashboard/profile/"
              element={<EmployeeProfile />}
            ></Route>
            <Route
              path="/employee-dashboard/salary-overview/"
              element={<SalaryOverview />}
            ></Route>
            <Route
              path="/employee-dashboard/payslip-history"
              element={<PayslipHistory />}
            ></Route>
            <Route
              path="/employee-dashboard/leaves"
              element={<LeaveDashboard />}
            ></Route>
            <Route
              path="/employee-dashboard/add-leave"
              element={<RequestLeave />}
            ></Route>
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
