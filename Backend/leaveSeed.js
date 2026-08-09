import leaveType from "./model/LeaveType.js";

const seedLeaveTypes = async () => {
  const leaveTypes = [
    { name: "Sick", daysPerYear: 5 },
    { name: "Annual", daysPerYear: 20 },
    { name: "Maternity", daysPerYear: 90 },
    { name: "Education", daysPerYear: 14 },
  ];

  for (const type of leaveTypes) {
    const exists = await leaveType.findOne({ name: type.name });
    if (!exists) {
      await leaveType.create(type);
    }
  }
};

export default seedLeaveTypes;
