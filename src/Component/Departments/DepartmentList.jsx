import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelpers";
import { useEffect, useState } from "react";
import axios from "axios";
import SubTitle from "../reuseables/SubTitle";
import Loader from "../reuseables/Loader";
import useToast from "../../utils/useToast";
import { api } from "../../api/request";

const DepartmentList = () => {
  const [department, setdepartment] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const { showError } = useToast();
  const handleDeleted = async (id) => {
    const data = department.filter((dep) => dep._id !== id);
    setdepartment(data);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true);
      try {
        const response = await api.get("/department" );
        if (response.data.success) {
          let sno = 1;
          const data = await response.data.departments.map((department) => ({
            _id: department._id,
            sno: sno++,
            department_Name: department.department_Name,
            Action: (
              <DepartmentButtons
                _id={department._id}
                handleDeleted={handleDeleted}
              />
            ),
          }));

          setdepartment(data);
          setFilteredDepartments(data);
        }
        const data = response;
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
        showError(error.message);
      } finally {
        setDepLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const filterDepartments = (e) => {
    const records = department.filter((dep) =>
      dep.department_Name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredDepartments(records);
  };

  return (
    <>
      {depLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="px-6 mt-4">
          <SubTitle text={"Manage Departments"} className="text-center" />

          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search by Dept name"
              className="px-4 py-0.5 border"
              onChange={filterDepartments}
            />
          </div>
          <div className="mt-5 w-full">
            <DataTable
              columns={columns}
              data={filteredDepartments}
              pagination
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
