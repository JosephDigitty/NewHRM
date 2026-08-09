import axios from "axios";
import { api } from "../api/request";

export const fetchGrades = async (showError) => {
  let grade;
  try {
    const response = await api.get("/grade",);
    if (response.data.success) {
      return response.data.grades;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      showError(error.response.data.error);
    } else {
      showError(error.message);
    }
  }
  return grade;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export const columns = [
  {
    name: "S_no",
    selector: (row) => row.sno,
    width: "90px",
  },
  {
    name: "Grade Name",
    selector: (row) => row.Grade_Name,
  },
  {
    name: "Basic Salary",
    selector: (row) => formatCurrency(row.Basic_Salary),
    sortable: true,
  },
  {
    name: "Housing Allowance",
    selector: (row) => formatCurrency(row.Housing_Allownace),
  },
  {
    name: "Wardrobe Allowance",
    selector: (row) => formatCurrency(row.Wardrobe_Allowance),
  },
  {
    name: "Transport Allowance",
    selector: (row) => formatCurrency(row.Transport_Allowance),
  },
  {
    name: "Medical Allownance",
    selector: (row) => formatCurrency(row.Medical_Allownance),
  },
];
