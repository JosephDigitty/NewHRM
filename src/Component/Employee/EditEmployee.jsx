import { useEffect, useState } from "react";
import { fetchDepartments, getHmo } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../reuseables/Loader";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";

const EditEmployee = () => {
  const { showError } = useToastContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const [departments, setDepartments] = useState([]);
  const [HMO, setHMO] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Departments
  useEffect(() => {
    const getDepartments = async () => {
      const deps = await fetchDepartments(showError);
      setDepartments(deps);
    };
    getDepartments();
  }, []);

  useEffect(() => {
    const getHMO = async () => {
      const hmo = await getHmo(showError);
      setHMO(hmo);
    };
    getHMO();
  }, []);

  // Fetch Employee
  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/employee/${id}`);

        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  // Handle Change for Nested Fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If nested field like "userId.fullname"
    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setEmployee((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Normal field like "hmo"
      setEmployee((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.put(
        `/employee/${id}`,
        employee,
      );

      if (response.data.success) {
        navigate("/admin-dashboard/Employees");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        showError(error.response.data.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !employee) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="relative flex min-h-screen w-full  flex-col bg-slate-50 overflow-x-hidden font-inter">
        <div className="layout-container flex h-full flex-col">
          <div className="gap-1 px-6 flex flex-1 justify-center py-5">
            {/* LEFT SIDEBAR */}
            <div className="layout-content-container flex flex-col w-80">
              <div className="flex h-full min-h-[700px] flex-col justify-between bg-slate-50 p-4">
                <div className="flex flex-col gap-4">
                  {/* PROFILE IMAGE + NAME */}
                  <div className="flex flex-col items-center gap-3">
                    {/* Profile Picture */}
                    <div
                      className="bg-cover bg-center bg-no-repeat rounded-full size-32 border border-slate-300 shadow-md"
                      style={{
                        backgroundImage: `url(http://localhost:3001/uploads/${employee.userId.profileImage})`,
                      }}
                    />

                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-[#0d141b] text-lg font-semibold">
                        {employee.userId.fullname}
                      </h1>

                      <p className="text-[#4c739a] text-sm">
                        Employee ID: <span>{employee.employeeId}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              {/* HEADER */}
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-[#0d141b] text-[32px] font-bold leading-tight">
                    Edit Employee Profile
                  </p>
                  <p className="text-[#4c739a] text-sm">
                    Update and manage employee information
                  </p>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="px-4 w-9/10">
                {/* FULL NAME */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t py-5">
                  <label className="text-[#4c739a] text-sm">Full Name</label>
                  <input
                    type="text"
                    name="userId.fullname"
                    value={employee.userId.fullname}
                    onChange={handleChange}
                    className="border rounded-md p-2"
                    required
                  />
                </div>

                {/* DOB */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t py-5">
                  <label className="text-[#4c739a] text-sm">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="personal.dob"
                    value={employee.personal.dob?.split("T")[0]}
                    onChange={handleChange}
                    className="border rounded-md p-2"
                    required
                  />
                </div>

                {/* GENDER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t py-5">
                  <label className="text-[#4c739a] text-sm">Gender</label>
                  <select
                    name="personal.gender"
                    value={employee.personal.gender}
                    onChange={handleChange}
                    className="border rounded-md p-2"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* MARITAL STATUS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t py-5">
                  <label className="text-[#4c739a] text-sm">
                    Marital Status
                  </label>
                  <select
                    name="personal.maritalStatus"
                    value={employee.personal.maritalStatus}
                    onChange={handleChange}
                    className="border rounded-md p-2"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                  </select>
                </div>

                {/* DEPARTMENT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t py-5">
                  <label className="text-[#4c739a] text-sm">Department</label>
                  <select
                    name="job.department"
                    value={employee.job.department?._id}
                    onChange={(e) =>
                      setEmployee((prev) => ({
                        ...prev,
                        job: { ...prev.job, department: e.target.value },
                      }))
                    }
                    className="border rounded-md p-2"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dep) => (
                      <option key={dep._id} value={dep._id}>
                        {dep.department_Name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* POSITION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t py-5">
                  <label className="text-[#4c739a] text-sm">Job Position</label>
                  <input
                    type="text"
                    name="job.position"
                    value={employee.job.position}
                    onChange={handleChange}
                    className="border rounded-md p-2"
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t py-5">
                  <label className="text-[#4c739a] text-sm">Email</label>
                  <input
                    type="email"
                    name="userId.email"
                    value={employee.userId.email}
                    onChange={handleChange}
                    className="border rounded-md p-2"
                    required
                  />
                </div>

                {/* ADDRESS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t py-5">
                  <label className="text-[#4c739a] text-sm">Address</label>
                  <input
                    type="text"
                    name="personal.address"
                    value={employee.personal.address}
                    onChange={handleChange}
                    className="border rounded-md p-2"
                    required
                  />
                </div>

                {/* HMO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t py-5">
                  <label className="text-[#4c739a] text-sm">HMO</label>
                  <select
                    name="hmo"
                    value={employee.hmo}
                    onChange={handleChange}
                    className="border rounded-md p-2"
                    required
                  >
                    <option value="">Select HMO</option>
                    {HMO.map((hmo) => (
                      <option key={hmo._id} value={hmo._id}>
                        {hmo.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* SUBMIT */}
                <button
                  className="mt-6 ml-[500px] w-1/4 rounded-md bg-[#70c7ff] cursor-pointer hover:bg-[#30aefc] py-3 text-black hover:text-white font-medium flex justify-center gap-3"
                  disabled={submitting}
                >
                  {submitting && <Loader size="sm" />}
                  {submitting ? "Updating..." : "Update Employee"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEmployee;
