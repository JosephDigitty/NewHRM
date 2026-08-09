import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadPayrollPDF = (payroll) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold")
  doc.setTextColor(54, 141, 235)
  doc.text("Digitty Tech Solutions", 14, 15)

  doc.setFontSize(12);
  // doc.text(`Employee: ${employeeName}`, 14, 25);
  doc.text(`Pay Period: ${payroll.period}`, 14, 32)

  doc.setFontSize(12);
  doc.setTextColor(11, 13, 15)
  doc.setFont("helvetica", "normal")
  doc.text(`Employee: ${payroll.employeeName}`, 14, 25);

 autoTable(doc, {
    startY: 40,
    head: [["Earnings", "Amount"]],
    body: [
      ["Basic Salary", 'N' + payroll.salary],
      ["Housing Allowance", 'N' + payroll.housingAllowance],
      ["Wardrobe Allowance", 'N' + payroll.wardrobeAllowance],
      ["Transport Allowance", 'N' + payroll.transportAllowance],
      ["Medical Allowance", 'N' + payroll.medicalAllowance],
      ["Gross Earnings", 'N' + payroll.gross],
    ],
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Deductions", "Amount"]],
    body: [
      ["Pension", 'N' + payroll.pension],
      ["PAYE", 'N' + payroll.paye],
      ["Total Deductions", 'N' + payroll.totalDeductions],
    ],
  });

   autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Permanent Allowances", "Amount "]],
      body: payroll.permAllowances.map((a) => [
        a.label,
        "N" + Number(a.amount).toLocaleString(),
      ]),
    });

     autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Permanent Deductions", "Amount "]],
      body: payroll.permDeductions.map((d) => [
        d.label,
        "N" + Number(d.amount).toLocaleString(),
      ]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["One-Time Allowances", "Amount "]],
      body: payroll.oneTimeAllowances.map((a) => [
        a.label,
        "N" + Number(a.amount).toLocaleString(),
      ]),
    });

     autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["One-Time Deductions", "Amount "]],
      body: payroll.oneTimeDeductions.map((d) => [
        d.label,
        "N" + Number(d.amount).toLocaleString(),
      ]),
    });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Payments", "Amount"]],
    body: [['Net Salary', 'N' + payroll.net]],
  });

  doc.save(`${payroll.employeeName}'s Payroll ${payroll.period}.pdf`);
};
