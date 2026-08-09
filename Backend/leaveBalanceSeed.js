import Employee from "./model/Employee.js";
import LeaveType from "./model/LeaveType.js";
import LeaveBalance from "./model/LeaveBalance.js";
import User from "./model/user.js";

const seedLeaveBalances = async () => {
  const year = new Date().getFullYear();

  const employees = await User.find({}, "_id");
  const leaveTypes = await LeaveType.find({}, "_id daysPerYear");

  if (!employees.length || !leaveTypes.length) {
    console.log("No employees or leave types found. Skipping leave balance seed.");
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

  console.log(`LeaveBalance seed done → created: ${created}, skipped: ${skipped}`);
};

export default seedLeaveBalances;
