const Notifications = () => {
  return (
    <div className="bg-white w-full h-full p-4 rounded-xl shadow">
      <div className="flex justify-between">
        <p className="font-semibold">Notifications</p>
        <button className="text-blue-500 text-sm">View all</button>
      </div>

      <div className="mt-4 space-y-3">
        {[1, 2 ].map((_, i) => (
          <div
            key={i}
            className="bg-blue-50 border border-blue-100 p-3 rounded-lg"
          >
            <p className="font-semibold text-blue-600">Leave Request Approved</p>
            <p className="text-sm">
              Your leave request for December has been approved.
            </p>
            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
