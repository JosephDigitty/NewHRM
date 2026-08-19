import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import LoadingState from "../reuseables/LoadingState";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../api/request";
import useToast from "../../utils/useToast";
import { columns } from "../../utils/GradeHelpers";

const GradeList = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { showError } = useToast();

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const response = await api.get("/grade");
        if (response.data.success) {
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
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          showError(error.response.data.error);
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [showError]);

  const filteredGrades = grades.filter((grade) =>
    grade.Grade_Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEntry = filteredGrades.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, filteredGrades.length);
  const totalPages = Math.max(1, Math.ceil(filteredGrades.length / rowsPerPage));

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const customStyles = {
    rows: {
      style: {
        minHeight: "64px",
        borderBottom: "1px solid #f0f0f0",
      },
    },
    headCells: {
      style: {
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "16px",
        paddingBottom: "16px",
        backgroundColor: "#fafafa",
        color: "#6b7280",
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderBottom: "1px solid #f0f0f0",
      },
    },
    cells: {
      style: {
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "16px",
        paddingBottom: "16px",
      },
    },
  };

  return (
    <LoadingState loading={loading} loadingText="Loading grades...">
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto px-6 py-8 ">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Grade Salary & Allowance Structure</h1>
              <p className="text-gray-500 mt-1">
                Manage basic salary and allowance definitions for each grade level.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by grade name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
              <Link
                to="/admin-dashboard/grade/add"
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors whitespace-nowrap"
              >
                <Plus size={16} />
                Add Grade
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredGrades}
              pagination
              paginationPerPage={rowsPerPage}
              paginationRowsPerPageOptions={[10, 20, 50]}
              paginationComponent={CustomPagination}
              customStyles={customStyles}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
            <div className="text-sm text-gray-500">
              Showing {startEntry} to {endEntry} of {filteredGrades.length} entries
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 mr-2">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-purple-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </LoadingState>
  );
};

const CustomPagination = ({ currentPage, lastPage, onPageChange }) => {
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-end gap-2 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-purple-600 text-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default GradeList;
