// components/appraisal/ProgressSection.jsx

const ProgressSection = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h3 className="font-bold mb-4">Department Progress</h3>

      {data.map((dept, i) => (
        <div key={i} className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>{dept.name}</span>
            <span>{dept.value}%</span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded">
            <div
              className="bg-[#5048e5] h-2 rounded"
              style={{ width: `${dept.value}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressSection;