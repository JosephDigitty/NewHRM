const LeaveReport = () => {
  return (
    <div className="bg-white w-full h-full p-4 rounded-xl shadow">
      <p className="font-semibold">Leave report</p>

      <div className="mt-4 space-y-3">
        <Item color="bg-yellow-400" label="Pending" />
        <Item color="bg-green-500" label="Approved" />
        <Item color="bg-red-500" label="Rejected" />
      </div>
    </div>
  );
};

const Item = ({ color, label }) => (
  <div className="flex items-center gap-3 text-sm">
    <span className={`h-3 w-3 rounded-full ${color}`}></span>
    {label}
  </div>
);

export default LeaveReport;
