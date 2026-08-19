import jsPDF from "jspdf";
import type { Invoice } from "@/types/invoice.types";

const COLORS = {
  primary: [30, 30, 30] as [number, number, number],       
  accent: [233, 39, 57] as [number, number, number],      
  accentDark: [180, 24, 40] as [number, number, number],  
  muted: [107, 114, 128] as [number, number, number],      
  border: [237, 220, 221] as [number, number, number],     
  bandBg: [253, 242, 243] as [number, number, number],     
  white: [255, 255, 255] as [number, number, number],
};

const STATUS_COLORS: Record<string, [number, number, number]> = {
  PAID: [22, 163, 74],
  CANCELLED: [220, 38, 38],
  PENDING: [217, 119, 6],
  OVERDUE: [220, 38, 38],
};

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const formatCurrency = (value?: number) =>
  typeof value === "number"
    ? value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "-";

const PAGE_W = 210;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;

export const generateInvoicePdf = (invoice: Invoice): void => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const label = invoice.invoiceNumber ?? String(invoice.docEntry);
  let y = 0;

  // ---- Header band ----
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 0, PAGE_W, 34, "F");
  doc.setFillColor(...COLORS.accentDark);
  doc.rect(0, 30, PAGE_W, 4, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("INVOICE", MARGIN, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(label, MARGIN, 24);

  // Status pill, top-right — white background so it reads clearly against the red band
  const statusColor = STATUS_COLORS[invoice.status] ?? COLORS.muted;
  const statusText = invoice.status ?? "-";
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const pillW = doc.getTextWidth(statusText) + 10;
  const pillX = PAGE_W - MARGIN - pillW;
  doc.setFillColor(...COLORS.white);
  doc.roundedRect(pillX, 10, pillW, 8, 2, 2, "F");
  doc.setTextColor(...statusColor);
  doc.text(statusText, pillX + pillW / 2, 15.3, { align: "center" });

  y = 46;

  // ---- Section: Invoice Details ----
  const sectionTitle = (text: string) => {
    doc.setTextColor(...COLORS.primary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(text, MARGIN, y);
    y += 3;
    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, y, MARGIN + 10, y);
    y += 8;
  };

  const detailGrid: [string, string][] = [
    ["Buyer", invoice.cardName ?? "-"],
    ["Shipped To", invoice.shipToCode ?? "-"],
    ["Vertical", invoice.vertical ?? "-"],
    ["Invoice Date", formatDate(invoice.docDate)],
    ["Due Date", formatDate(invoice.docDueDate)],
    ["Card Code", invoice.cardCode ?? "-"],
  ];

  sectionTitle("Invoice Details");

  const boxTop = y - 2;
  const rowH = 9;
  const boxH = detailGrid.length * rowH + 4;
  doc.setDrawColor(...COLORS.border);
  doc.setFillColor(...COLORS.bandBg);
  doc.roundedRect(MARGIN, boxTop, CONTENT_W, boxH, 2, 2, "FD");

  let rowY = boxTop + 8;
  detailGrid.forEach(([labelText, value], i) => {
    if (i % 2 === 1) {
      doc.setFillColor(...COLORS.white);
      doc.rect(MARGIN, rowY - 6, CONTENT_W, rowH, "F");
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...COLORS.muted);
    doc.text(labelText.toUpperCase(), MARGIN + 5, rowY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...COLORS.primary);
    doc.text(String(value), MARGIN + 55, rowY);

    rowY += rowH;
  });
  y = boxTop + boxH + 12;

  // ---- Section: Related Orders ----
  if (invoice.orders?.length) {
    sectionTitle("Related Orders");

    const colOrderX = MARGIN + 5;
    const colDocX = MARGIN + 90;
    const headerH = 9;

    doc.setFillColor(...COLORS.accent);
    doc.rect(MARGIN, y - 6, CONTENT_W, headerH, "F");
    doc.setTextColor(...COLORS.white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("ORDER NUMBER", colOrderX, y);
    doc.text("DOC ENTRY", colDocX, y);
    y += headerH;

    invoice.orders.forEach((o, i) => {
      const rh = 9;
      if (i % 2 === 1) {
        doc.setFillColor(...COLORS.bandBg);
        doc.rect(MARGIN, y - 6, CONTENT_W, rh, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.primary);
      doc.text(o.orderNumber, colOrderX, y);
      doc.text(`#${o.docEntry}`, colDocX, y);
      y += rh;
    });

    doc.setDrawColor(...COLORS.border);
    doc.rect(MARGIN, y - 6 - headerH - (invoice.orders.length * 9), CONTENT_W, headerH + invoice.orders.length * 9);
    y += 10;
  }

  // ---- Section: Compliance ----
  if (invoice.edocNo || invoice.ewayBillNumber) {
    sectionTitle("Compliance");
    const rows: [string, string][] = [];
    if (invoice.edocNo) rows.push(["E-Doc No", invoice.edocNo]);
    if (invoice.ewayBillNumber) rows.push(["E-Way Bill No", invoice.ewayBillNumber]);

    rows.forEach(([labelText, value]) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...COLORS.muted);
      doc.text(labelText.toUpperCase(), MARGIN + 5, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(...COLORS.primary);
      doc.text(value, MARGIN + 55, y);
      y += 8;
    });
    y += 4;
  }

  const totalBoxW = 70;
  const totalBoxX = PAGE_W - MARGIN - totalBoxW;
  const totalBoxH = 20;
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(totalBoxX, y, totalBoxW, totalBoxH, 2, 2, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("TOTAL AMOUNT", totalBoxX + 5, y + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(`Rs. ${formatCurrency(invoice.docTotal)}`, totalBoxX + 5, y + 16);

  const footerY = 285;
  doc.setDrawColor(...COLORS.border);
  doc.line(MARGIN, footerY - 6, PAGE_W - MARGIN, footerY - 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text(`Generated on ${new Date().toLocaleDateString("en-GB")}`, MARGIN, footerY);
  doc.text(`Invoice ${label}`, PAGE_W - MARGIN, footerY, { align: "right" });

  doc.save(`Invoice-${label.replace(/[\\/]/g, "_")}.pdf`);
};