//get all payroll
// get paroll by department
// get payroll by grades
// get payroll by employee

import axios from "axios";
import { api } from "../api/request";
export const payrollByDepartment = async (showError) => {
  try {
    const response = await api.get(`/employee/payroll/departments`,);
    if (response.data.success) {
      return response.data.filteredPayrollByDepartment;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showError(error.response.data.error);
    } else {
      showError(error.message);
    }
  }
};
export const payrollByGrade = async (showError) => {
  try {
    const response = await api.get(`/employee/payroll/grade` );
    if (response.data.success) {
      return response.data.filteredPayrollByGrade;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showError(error.response.data.error);
    } else {
      showError(error.message);
    }
  }
};
export const permanentModifyers = async (id, showError) => {
  try {
    const response = await api.get(`/employee/payroll/permament/${id}` );
    if (response.data.success) {
      return {
        allowances: response.data.allowances,
        deductions: response.data.deductions,
      };
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showError(error.response.data.error);
    } else {
      showError(error.message);
    }
  }
};
export const beneficiaries = async (id, showError) => {
  try {
    const response = await api.get(`/employee/${id}`,);
    if (response.data.success) {
      return {
        beneficiary: response.data.employee.beneficiary,
      };
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showError(error.response.data.error);
    } else {
      showError(error.message);
    }
  }
};

export const getTemporaryModifiers = async (employeeId, showError) => {
  try {
    const response = await api.get(`/employee/payroll/temporary/${employeeId}`);
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showError(error.response.data.error);
    } else {
      showError(error.message);
    }
  }
};
export const getFullPayroll = async (showError) => {
  try {
    const response = await api.get(`/employee/payroll/fullpayroll`,);
    if (response.data.success) {
      return response.data.filteredPayroll;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showError(error.response.data.error);
    } else {
      showError(error.message);
    }
  }
};

export const allPayrollCollumn = [
  {
    name: "Employee Name",
    selector: (row) => row.EmployeeName,
  },
  {
    name: "Department",
    selector: (row) => row.Department,
    sortable: true,
  },
  {
    name: "Grade",
    selector: (row) => row.Grade,
    sortable: true,
  },
  {
    name: "Basic salary",
    selector: (row) => formatCurrency(row.basicSalary),
  },
  {
    name: "Housing Allowance",
    selector: (row) => formatCurrency(row.housingAllowance),
  },
  {
    name: "Wardrope Allowance",
    selector: (row) => formatCurrency(row.wardrobeAllowance),
  },
  {
    name: "Transport Allowance",
    selector: (row) => formatCurrency(row.transportAllowance),
  },
  {
    name: "Medical Allowance",
    selector: (row) => formatCurrency(row.medicalAllowance),
  },
  {
    name: "NetPay",
    selector: (row) => formatCurrency(row.NetPay),
  },
  {
    name: "Period",
    selector: (row) => row.Period,
  },
  {
    name: "Status",
    selector: (row) => row.Status,
  },
];

export const bankPayrollCollumn = [
  {
    name: "Employee Name",
    selector: (row) => row.EmployeeName,
  },
  {
    name: "Bank",
    selector: (row) => row.Bank,
    sortable: true,
  },
  {
    name: "AccountNumber ",
    selector: (row) => row.Account,
    sortable: true,
  },
  {
    name: "NetPay",
    selector: (row) => formatCurrency(row.NetPay),
  },
];

export const allPensionCollumn = [
  {
    name: "Employee Name",
    selector: (row) => row.EmployeeName,
  },
  {
    name: "Department",
    selector: (row) => row.Department,
    sortable: true,
  },
  {
    name: "Grade",
    selector: (row) => row.Grade,
    sortable: true,
  },
  {
    name: "Period",
    selector: (row) => row.Period,
  },
  {
    name: "Amount",
    selector: (row) => formatCurrency(row.Amount),
  },
];

export const BankPayrollCollumn = [
  {
    name: "Employee Name",
    selector: (row) => row.EmployeeName,
  },
  {
    name: "Bank",
    selector: (row) => row.BankName,
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row) => row.AccountDetails,
    sortable: true,
  },
  {
    name: "Net Pay",
    selector: (row) => formatCurrency(row.NetPay),
  },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export const NairaCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};