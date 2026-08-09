export const columns = [
    {
        name:"S No",
        selector: (row) => row.sno,
        width: "90px"
    },
    {
      name:"StaffId",
      selector: (row) => row.staffId,
      width: "120px"
    },
    {
        name:"Basic Pay",
        selector: (row) => formatNaira(row.salary),
        width: "200px",
        sortable:true
    },
    {
        name:"Allowances",
        selector: (row) => formatNaira(row.allowances),
        width: "200px",
    },
    {
        name:"Deduction",
        selector: (row) => formatNaira(row.deductions),
        width: "200px",
        sortable:true,
        
    },
    {
        name:"Total",
        selector: (row) => formatNaira(row.total),
      
    },
    {
        name:"PayDate",
        selector: (row) => formatMonthYear(row.payDate),
      
    },
]

export const formatNaira = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  export const formatMonthYear = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-NG", {
      year: "numeric",
      month: "long",
    }).format(date);
  };