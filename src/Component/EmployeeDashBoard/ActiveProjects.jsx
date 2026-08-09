const ActiveProjects = ({ projects }) => {
  return (
    <div className="bg-white p-4 w-full h-full rounded-xl shadow">
      <div className="flex justify-between">
        <p className="font-semibold">Active projects</p>
        <button className="bg-blue-500 text-white px-3 py-1 rounded">
          Export
        </button>
      </div>

      <table className="w-full mt-4 text-sm">
        <thead className="text-gray-500">
          <tr>
            <th className="py-2">Kpi Title</th>
            <th>Kpi Weight </th>
            <th>Self Score</th>
            <th>Supervisor Score</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p, i) => (
            <tr key={i} className="border-t mr-14 text-center">
              <td className="py-2">{p.title.slice(0, 20)}</td>
              <td>{p.weight}</td>
              <td className="text-orange-500 font-semibold">{p.selfScore}</td>
              <td className="text-start">{p.supervisorComment|| "Supervisor"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveProjects;
