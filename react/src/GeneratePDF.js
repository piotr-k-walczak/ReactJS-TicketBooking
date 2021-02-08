import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

function generatePDF(eventName, sales, summary) {
  const doc = new jsPDF();

  const summaryHeaders = [
    "Nazwa Biletu",
    "Sprzedane",
    "Naklad",
    "Przychod"
  ];

  const summaryRows = [];

  summary.forEach((s) => {
    const summaryData = [
      s.NazwaB,
      s.Sprzedane,
      s.MaksIlosc || "Nieograniczony",
      s.Przychod + " PLN"
    ];
    summaryRows.push(summaryData);
  });

  const tableHeaders = [
    "Data Zakupu",
    "Nazwa Biletu",
    "Cena Zakupu",
    "Ilosc Biletów",
    "Anulowany",
  ];

  const tableRows = [];

  sales.forEach((t) => {
    const ticketData = [
      format(new Date(t.DataZakupu), "yyyy-MM-dd hh:mm:ss"),
      t.NazwaB,
      t.CenaZakupu + " PLN",
      t.IloscB,
      t.IdA ? "Anulowany" : "",
    ];
    tableRows.push(ticketData);
  });

  const date = Date().split(" ");
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  doc.text("Podsumowanie finansowe " + eventName, 14, 15);
  doc.autoTable(summaryHeaders, summaryRows,  { startY: 20 });
  doc.autoTable(tableHeaders, tableRows);
  doc.save(`report_${dateStr}.pdf`);
}

export default generatePDF;
