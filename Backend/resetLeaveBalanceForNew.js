import Employee from "./model/Employee.js";
import LeaveType from "./model/LeaveType.js";
import LeaveBalance from "./model/LeaveBalance.js";

const resetLeaveBalancesForNewYear = async (year) => {
  const employees = await Employee.find({}, "_id");
  const leaveTypes = await LeaveType.find({}, "_id daysPerYear");

  if (!employees.length || !leaveTypes.length) {
    console.log("No employees or leave types found. Skipping yearly reset.");
    return;
  }

  let created = 0;
  let skipped = 0;

  for (const employee of employees) {
    for (const leaveType of leaveTypes) {

      const exists = await LeaveBalance.findOne({
        employee: employee._id,
        leaveType: leaveType._id,
        year,
      });

      if (exists) {
        skipped++;
        continue;
      }

      await LeaveBalance.create({
        employee: employee._id,
        leaveType: leaveType._id,
        totalDays: leaveType.daysPerYear,
        usedDays: 0,
        remainingDays: leaveType.daysPerYear,
        year,
      });

      created++;
    }
  }

  console.log(
    `Leave reset for ${year} → created: ${created}, skipped: ${skipped}`
  );
};

export default resetLeaveBalancesForNewYear;
