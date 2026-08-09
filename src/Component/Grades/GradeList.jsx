import { useEffect, useState } from "react";
import { columns } from "../../utils/GradeHelpers";
import axios from "axios";
import DataTable from "react-data-table-component";
import SubTitle from "../reuseables/SubTitle";
import Input from "../reuseables/Input";
import LoadingState from "../reuseables/LoadingState";
import { api } from "../../api/request";
import { useToastContext } from "../../Context/ToastContext";

const GradeList = () => {
  const [grades, setGrades] = useState([]);
  const [filteredGrade, setFilteredGrade] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useToastContext();

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const response = await api.get("/grade");
        if (response.data.success) {  
          setGrades(response.data.grades);

          let sno = 1;
          const data = response.data.grades.map((grade) => ({
            _id: grade._id,
            sno: sno++,
            Grade_Name: grade.gradeName,
            Basic_Salary: grade.basicSalary,
            Housing_Allownace: grade.housingAllowance,
            Wardrobe_Allowance: grade.wardrobeAllowance,
            Transport_Allowance: grade.transportAllowance,
            Medical_Allownance: grade.medicalAllowance,
          }));
          setGrades(data);
          setFilteredGrade(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
        showError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const handleFilter = (e) => {
    const records = grades.filter((grd) =>
      grd.gradeName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredGrade(records);
  };

  return (
    <LoadingState loading={loading} loadingText="Loading grades...">
      <div className="px-6 mt-6">
        <SubTitle text={" Manage Grade"} className="text-center mb-2" />

        <div className="flex justify-between items-center">
          <Input
            name="searchGrade"
            type="text"
            placeholder="Search by Grade name"
            onChange={handleFilter}
            className="w-1/5"
          />
        </div>
        <div className="mt-5 w-full">
          <DataTable columns={columns} data={filteredGrade} pagination />
        </div>
      </div>
    </LoadingState>
  );
};

export default GradeList;
