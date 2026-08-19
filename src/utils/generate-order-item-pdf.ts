import jsPDF from "jspdf";
import type { OrderItemDetail } from "@/types/order.types";

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
  DELIVERED: [22, 163, 74],
  OPEN: [217, 119, 6],
  PARTIAL: [37, 99, 235],
};

const formatCurrency = (value?: number) =>
  typeof value === "number"
    ? value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "-";

const formatQty = (value?: number, unit?: string) =>
  typeof value === "number" ? `${value}${unit ? ` ${unit}` : ""}` : "-";

const PAGE_W = 210;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;

export const generateOrderItemPdf = (item: OrderItemDetail): void => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const label = item.itemCode ?? String(item.lineNumber);
  let y = 0;

  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 0, PAGE_W, 34, "F");
  doc.setFillColor(...COLORS.accentDark);
  doc.rect(0, 30, PAGE_W, 4, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("ORDER ITEM", MARGIN, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(label, MARGIN, 24);

  // Status pill, top-right
  const statusColor = STATUS_COLORS[item.deliveryStatus] ?? COLORS.muted;
  const statusText = item.deliveryStatus ?? "-";
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const pillW = doc.getTextWidth(statusText) + 10;
  const pillX = PAGE_W - MARGIN - pillW;
  doc.setFillColor(...COLORS.white);
  doc.roundedRect(pillX, 10, pillW, 8, 2, 2, "F");
  doc.setTextColor(...statusColor);
  doc.text(statusText, pillX + pillW / 2, 15.3, { align: "center" });

  y = 46;

  // ---- Section: Item Details ----
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
    ["Item Code", item.itemCode ?? "-"],
    ["Description", item.itemDescription ?? "-"],
    ["Order Number", item.orderNumber ?? "-"],
    ["HSN Code", item.hsnCode ?? "-"],
    ["Line Number", String(item.lineNumber ?? "-")],
    ["Price", `Rs. ${formatCurrency(item.price)}`],
    ["Quantity", formatQty(item.quantity, item.measureUnit)],
    ["Pending Quantity", formatQty(item.pendingQuantity, item.measureUnit)],
    ["Delivered Quantity", formatQty(item.deliveryQuantity, item.measureUnit)],
    ["Delivery Status", item.deliveryStatus ?? "-"],
  ];

  sectionTitle("Item Details");

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
    // Wrap long descriptions instead of overflowing the box
    const maxWidth = CONTENT_W - 55 - 5;
    const lines = doc.splitTextToSize(String(value), maxWidth);
    doc.text(lines[0], MARGIN + 55, rowY);

    rowY += rowH;
  });
  y = boxTop + boxH + 16;

  // ---- Total box ----
  const totalBoxW = 70;
  const totalBoxX = PAGE_W - MARGIN - totalBoxW;
  const totalBoxH = 20;
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(totalBoxX, y, totalBoxW, totalBoxH, 2, 2, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("LINE TOTAL", totalBoxX + 5, y + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(`Rs. ${formatCurrency(item.lineTotal)}`, totalBoxX + 5, y + 16);

  // ---- Footer ----
  const footerY = 285;
  doc.setDrawColor(...COLORS.border);
  doc.line(MARGIN, footerY - 6, PAGE_W - MARGIN, footerY - 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text(`Generated on ${new Date().toLocaleDateString("en-GB")}`, MARGIN, footerY);
  doc.text(`Order Item ${label}`, PAGE_W - MARGIN, footerY, { align: "right" });

  doc.save(`OrderItem-${label.replace(/[\\/]/g, "_")}.pdf`);
};