// components/appraisal/EmployeeTable.jsx

const EmployeeTable = ({ employees }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b flex justify-between">
        <h2 className="font-bold">Employee Performance</h2>
      </div>

      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-4 text-xs">Name</th>
            <th className="p-4 text-xs">Department</th>
            <th className="p-4 text-xs">Status</th>
            <th className="p-4 text-xs">Score</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id} className="border-t">
              <td className="p-4">
                <p className="font-bold">{emp.employee?.fullname}</p>
                <p className="text-xs text-slate-500">{emp.role}</p>
              </td>

              <td className="p-4">{emp.cycle?.cycleName.slice(0,2)}</td>
              <td className="p-4">{emp.status}</td>

              <td className="p-4">
                {emp.totalScore ? emp.totalScore : "Processing..."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;