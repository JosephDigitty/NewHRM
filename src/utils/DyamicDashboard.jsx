import { api } from "../api/request"


export const getAllEmployee = async () => {
    try {
    const res = await api.get("/employee")
    const positive = res.data.success
    if(positive) {
        const employees = res.data.employees
        return employees
        }    
    } catch (error) {
        if (error.response && !error.response.data.success) {
            showError(error.response.data.error);
        }
    }
}

export const getAllAppraisal = async () => {
    try {
        const res = await api.get("/appraisal/")
        const positive = res.data.success
        if(positive) {
            const appraisal = res.data.appraisal
            return appraisal
        }
    } catch (error) {
        console.log(error)
    }
}

export const getAllDepartment = async () => {
    try {
    const res = await api.get("/department")
    const positive = res.data.success
    if(positive){
        const departments =  res.data.departments
        return departments
    }
    } catch (error) {
    if (error.response && !error.response.data.success) {
            showError(error.response.data.error);
        }
    }
    
}

export const getAllleave = async () => {
    try {
    const res = await api.get("/leave/leave-request")
    const positive = res.data.success
    if(positive) {
        const leaves = res.data.leave
        return leaves
    }
    } catch (error) {
    if (error.response && !error.response.data.success) {
            showError(error.response.data.error);
        }
    }
    
}

export const getAllPayroll = async () => {
    try {
    const res = await api.get("/employee/payroll/list")
    const positive = res.data.success
    if(positive) {
        const leaves = res.data.payroll
        return leaves
    }
    } catch (error) {
    if (error.response && !error.response.data.success) {
            showError(error.response.data.error);
        }
    }
    
}

export const getCurrentWeekBounds = () => {
  const today = new Date()
  const day = today.getDay() 

  
  const monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)

  
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  friday.setHours(23, 59, 59, 999)

  return { monday, friday }
}

export const getEmployeesOnLeaveThisWeek = (leaves) => {
  const { monday, friday } = getCurrentWeekBounds()

  return leaves.filter(leave => {
    if (leave.status !== "approved") return false

    const leaveStart = new Date(leave.startDate)
    const leaveEnd = new Date(leave.endDate)

    return leaveStart <= friday && leaveEnd >= monday
  }).length
}

export const getMonthlyPayrollData = (payrolls) => {
  const currentYear = new Date().getFullYear()

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Filter for current year only
  const thisYearPayrolls = payrolls.filter(p => p.period.startsWith(String(currentYear)))

  // Group and sum netSalary by month
  const grouped = {}
  thisYearPayrolls.forEach(p => {
    const monthIndex = parseInt(p.period.split("-")[1]) - 1 // "2026-03" → 2
    const monthName = monthNames[monthIndex]

    if (!grouped[monthName]) grouped[monthName] = 0
    grouped[monthName] += p.netSalary
  })

  // Convert to array recharts expects, only months that have data
  return monthNames
    .filter(month => grouped[month])
    .map(month => ({
      name: month,
      value: parseFloat(grouped[month].toFixed(2)) // convert to millions
    }))
}

export const getEmployeePayroll = async (employeeId) => {
    try {
        const res = await api.post("/employee/payrolls/employee", {employeeId})
        const positive = res.data.success
        if (positive) {
            const pay = res.data.payroll
            return pay
        }
    } catch (error) {
        console.log("FULL ERROR:", error)
    }
}

export const getEmployeeAppraisals = async (employeeId) => {
    try {
        const res = await api.post("/appraisal/employeeKpis", {employeeId})
        const positive = res.data.success 
        if(positive) {
            const appraisals = res.data.appraisals
            return appraisals
        }
    } catch (error) {
        console.log("FULL ERROR:", error)
    }
}

export const getAllCycles = async () => {
    try {
      const res = await api.get("/appraisal/appraisals")   
      if(res.data.success) {
        const cycles = res.data.appraisalCycle
        return cycles
      }
    } catch (error) {
        console.log("FULL ERROR:", error)
    }
}