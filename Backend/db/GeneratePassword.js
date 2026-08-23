export const generatePassword = (companyName, fullname, department, dob) => {
  const companyInitials = companyName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const employeeInitials = fullname
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const deptCode = (department || "GEN").slice(0, 3).toUpperCase();

  // dob expected as a date string/Date e.g. "1998-05-21"
  const date = new Date(dob);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  const dobCode = `${dd}${mm}${yy}`;

  return `${companyInitials}${employeeInitials}${deptCode}${dobCode}`;
};