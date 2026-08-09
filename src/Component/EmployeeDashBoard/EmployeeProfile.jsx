import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/authContext";
import axios from "axios";
import { useToastContext } from "../../Context/ToastContext";

const EmployeeProfile = () => {
  const { showError } = useToastContext();
  const [employee, setEmployeee] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const id = user?._id;
  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setEmployeee([response.data.employee]);

          setLoading(false);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
          showError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);
  return (
    <>
      {employee.map((emp) => (
        <div
          key={emp._id}
          className="relative flex min-h-screen w-full flex-col bg-slate-50 overflow-x-hidden font-inter"
        >
          <div className="layout-container flex h-full flex-col">
            <div className="gap-1 px-6 flex flex-1 justify-center py-5">
              {/* LEFT COLUMN (EMPLOYEE BASIC INFO + MENU) */}
              <div className="layout-content-container flex flex-col w-80">
                <div className="flex h-full min-h-[700px] flex-col justify-between bg-slate-50 p-4">
                  <div className="flex flex-col gap-4">
                    {/* PROFILE IMAGE + NAME */}

                    <div className="flex flex-col  gap-3" key={emp._id}>
                      <div
                        className=" bg-cover bg-no-repeat rounded-full size-70"
                        style={{
                          backgroundImage: `url(http://localhost:3001/uploads/${emp.userId.profileImage})`,
                        }}
                      />
                      <div className="flex flex-col">
                        <h1 className="text-[#0d141b] text-base font-medium leading-normal">
                          {emp.userId.fullname}
                        </h1>
                        <p className="text-[#4c739a] text-sm font-normal leading-normal">
                          Employee ID:{" "}
                          <span>
                            {emp.employeeId ? emp.employeeId : "12345"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT MAIN CONTENT */}
              <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                {/* HEADER */}
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <div className="flex min-w-72 flex-col gap-3">
                    <p className="text-[#0d141b] text-[32px] font-bold leading-tight">
                      Employee Profile
                    </p>
                    <p className="text-[#4c739a] text-sm font-normal leading-normal">
                      View and manage employee information
                    </p>
                  </div>
                </div>

                {/* ------ OVERVIEW SECTION ------ */}
                <h2 className="text-[#0d141b] text-[22px] font-bold tracking-[-0.015em] px-4 pb-3 pt-5">
                  Overview
                </h2>

                <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-[#cfdbe7] py-5">
                    <p className="text-[#4c739a] text-sm">Department</p>
                    <p className="text-[#0d141b] text-sm">
                      {emp.job.department.department_Name}
                    </p>
                  </div>

                  <div className="col-span-2 grid grid-cols-subgrid border-t border-[#cfdbe7] py-5">
                    <p className="text-[#4c739a] text-sm">Role</p>
                    <p className="text-[#0d141b] text-sm">{emp.job.position}</p>
                  </div>

                  <div className="col-span-2 grid grid-cols-subgrid border-t border-[#cfdbe7] py-5">
                    <p className="text-[#4c739a] text-sm">Reporting to</p>
                    <p className="text-[#0d141b] text-sm">
                      {emp.job.reportingTo}
                    </p>
                  </div>

                  <div className="col-span-2 grid grid-cols-subgrid border-t border-[#cfdbe7] py-5">
                    <p className="text-[#4c739a] text-sm">Gender</p>
                    <p className="text-[#0d141b] text-sm">
                      {emp.personal.gender}
                    </p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-[#cfdbe7] py-5">
                    <p className="text-[#4c739a] text-sm">Marital Status</p>
                    <p className="text-[#0d141b] text-sm">
                      {emp.personal.maritalStatus}
                    </p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-[#cfdbe7] py-5">
                    <p className="text-[#4c739a] text-sm">Grade</p>
                    <p className="text-[#0d141b] text-sm">
                      {emp.job.grade.gradeName}
                    </p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-[#cfdbe7] py-5">
                    <p className="text-[#4c739a] text-sm">Employment Type</p>
                    <p className="text-[#0d141b] text-sm">
                      {emp.job.employmentType}
                    </p>
                  </div>
                </div>

                {/* ------ CONTACT SECTION ------ */}
                <h2 className="text-[#0d141b] text-[22px] font-bold tracking-[-0.015em] px-4 pb-3 pt-5">
                  Contact Information
                </h2>

                <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-[#cfdbe7] py-5">
                    <p className="text-[#4c739a] text-sm">Email</p>
                    <p className="text-[#0d141b] text-sm">{emp.userId.email}</p>
                  </div>

                  <div className="col-span-2 grid grid-cols-subgrid border-t border-[#cfdbe7] py-5">
                    <p className="text-[#4c739a] text-sm">Phone</p>
                    <p className="text-[#0d141b] text-sm">(555) 123-4567</p>
                  </div>

                  <div className="col-span-2 grid grid-cols-subgrid border-t border-[#cfdbe7] py-5">
                    <p className="text-[#4c739a] text-sm">Address</p>
                    <p className="text-[#0d141b] text-sm">
                      {emp.personal.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default EmployeeProfile;
