import jsPDF from "jspdf";
import type { OrderItem, OrderItemDetail } from "@/types/order.types";
import type { OrderWithExtras } from "@/types/orderDetail.types";
import type { Invoice } from "@/types/invoice.types";
import { formatDate } from "./common.utils";

// jsPDF's standard fonts (helvetica) only support WinAnsi/Latin-1 glyphs.
// The shared formatCurrency() embeds the ₹ symbol (U+20B9), which isn't in
// that set and renders as a broken glyph (looks like "¹"). For PDF text we
// format just the number and prefix "Rs." as plain ASCII instead.
const formatCurrency = (value?: number) =>
  typeof value === "number"
    ? value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "-";

const COLORS = {
  primary: [30, 30, 30] as [number, number, number],
  accent: [233, 39, 57] as [number, number, number],       // #E92739
  accentDark: [180, 24, 40] as [number, number, number],
  muted: [107, 114, 128] as [number, number, number],
  border: [237, 220, 221] as [number, number, number],
  bandBg: [253, 242, 243] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

const STATUS_COLORS: Record<string, [number, number, number]> = {
  DELIVERED: [22, 163, 74],
  FULLY_DELIVERED: [22, 163, 74],
  PENDING: [217, 119, 6],
  OPEN: [217, 119, 6],
  PARTIAL: [37, 99, 235],
  PARTIALLY_DELIVERED: [37, 99, 235],
  CANCELLED: [220, 38, 38],
};



const PAGE_W = 210;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = 285;
const BOTTOM_LIMIT = FOOTER_Y - 10;

export const generateOrderPdf = (
  order: OrderWithExtras,
  items: OrderItem[] = [],
  invoices: Invoice[] = [],
  totalOverride?: number
): void => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const label = order.orderNumber ?? String(order.docEntry);
  let y = 0;
  let page = 1;

  const drawFooter = () => {
    doc.setDrawColor(...COLORS.border);
    doc.line(MARGIN, FOOTER_Y - 6, PAGE_W - MARGIN, FOOTER_Y - 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-GB")}`, MARGIN, FOOTER_Y);
    doc.text(`Order ${label} - Page ${page}`, PAGE_W - MARGIN, FOOTER_Y, { align: "right" });
  };

  const addPage = () => {
    drawFooter();
    doc.addPage();
    page += 1;
    y = 20;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > BOTTOM_LIMIT) addPage();
  };

  // ---- Header band ----
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 0, PAGE_W, 34, "F");
  doc.setFillColor(...COLORS.accentDark);
  doc.rect(0, 30, PAGE_W, 4, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("ORDER", MARGIN, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(label, MARGIN, 24);

  const statusColor = STATUS_COLORS[order.orderDeliveryStatus] ?? COLORS.muted;
  const statusText = order.orderDeliveryStatus?.replace(/_/g, " ") ?? "-";
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const pillW = doc.getTextWidth(statusText) + 10;
  const pillX = PAGE_W - MARGIN - pillW;
  doc.setFillColor(...COLORS.white);
  doc.roundedRect(pillX, 10, pillW, 8, 2, 2, "F");
  doc.setTextColor(...statusColor);
  doc.text(statusText, pillX + pillW / 2, 15.3, { align: "center" });

  y = 46;

  const sectionTitle = (text: string) => {
    ensureSpace(14);
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
    ["Buyer", order.cardName ?? "-"],
    ["Vertical", order.vertical ?? "-"],
    ["Order Date", formatDate(order.docDate)],
    ["Due Date", formatDate(order.docDueDate)],
    ["Card Code", order.cardCode ?? "-"],
    ["Order Type", order.orderType ?? "-"],
    ["Total Items", String(order.totalItems ?? items.length ?? "-")],
    ["Fulfilled", `${order.fulfilledPercentage ?? 0}%`],
  ];

  sectionTitle("Order Details");
  const rowH = 9;

  const boxH = detailGrid.length * rowH + 4;
  ensureSpace(boxH + 10);
  const boxTopFinal = y - 2;
  doc.setDrawColor(...COLORS.border);
  doc.setFillColor(...COLORS.bandBg);
  doc.roundedRect(MARGIN, boxTopFinal, CONTENT_W, boxH, 2, 2, "FD");

  let rowY = boxTopFinal + 8;
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
  y = boxTopFinal + boxH + 12;

  // ---- Items table ----
  if (items.length) {
    sectionTitle("Order Items");

    const cols = [
      { key: "itemCode", label: "ITEM CODE", x: MARGIN + 3, w: 28 },
      { key: "itemDescription", label: "DESCRIPTION", x: MARGIN + 32, w: 62 },
      { key: "quantity", label: "QTY", x: MARGIN + 96, w: 16 },
      { key: "price", label: "PRICE", x: MARGIN + 114, w: 24 },
      { key: "lineTotal", label: "TOTAL", x: MARGIN + 140, w: 24 },
      { key: "deliveryStatus", label: "STATUS", x: MARGIN + 166, w: 24 },
    ];
    const headerH = 9;

    const drawTableHeader = () => {
      doc.setFillColor(...COLORS.accent);
      doc.rect(MARGIN, y - 6, CONTENT_W, headerH, "F");
      doc.setTextColor(...COLORS.white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      cols.forEach((c) => doc.text(c.label, c.x, y));
      y += headerH;
    };

    drawTableHeader();

    items.forEach((item, i) => {
      const rh = 9;
      if (y + rh > BOTTOM_LIMIT) {
        addPage();
        sectionTitleContinued();
        drawTableHeader();
      }
      if (i % 2 === 1) {
        doc.setFillColor(...COLORS.bandBg);
        doc.rect(MARGIN, y - 6, CONTENT_W, rh, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...COLORS.primary);

      doc.text(item.itemCode ?? "-", cols[0].x, y);
      const desc = (item.itemDescription ?? "-").slice(0, 40);
      doc.text(desc, cols[1].x, y);
      doc.text(String(item.quantity ?? "-"), cols[2].x, y);
      doc.text(formatCurrency(item.price), cols[3].x, y);
      doc.text(formatCurrency(item.lineTotal), cols[4].x, y);

      const itemStatusColor = STATUS_COLORS[item.deliveryStatus] ?? COLORS.muted;
      doc.setTextColor(...itemStatusColor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text(item.deliveryStatus ?? "-", cols[5].x, y);

      y += rh;
    });

    function sectionTitleContinued() {
      doc.setTextColor(...COLORS.primary);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Order Items (continued)", MARGIN, y);
      y += 10;
    }

    y += 8;
  }

  // ---- Related Invoices ----
  if (invoices.length) {
    ensureSpace(20);
    sectionTitle("Related Invoices");

    const colInvX = MARGIN + 5;
    const colDateX = MARGIN + 70;
    const colTotalX = MARGIN + 110;
    const colStatusX = MARGIN + 150;
    const headerH = 9;

    doc.setFillColor(...COLORS.accent);
    doc.rect(MARGIN, y - 6, CONTENT_W, headerH, "F");
    doc.setTextColor(...COLORS.white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("INVOICE NUMBER", colInvX, y);
    doc.text("DATE", colDateX, y);
    doc.text("TOTAL", colTotalX, y);
    doc.text("STATUS", colStatusX, y);
    y += headerH;

    invoices.forEach((inv, i) => {
      const rh = 9;
      if (y + rh > BOTTOM_LIMIT) {
        addPage();
      }
      if (i % 2 === 1) {
        doc.setFillColor(...COLORS.bandBg);
        doc.rect(MARGIN, y - 6, CONTENT_W, rh, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...COLORS.primary);
      doc.text(inv.invoiceNumber ?? String(inv.docEntry), colInvX, y);
      doc.text(formatDate(inv.docDate), colDateX, y);
      doc.text(formatCurrency(inv.docTotal), colTotalX, y);

      const invStatusColor = STATUS_COLORS[inv.status] ?? COLORS.muted;
      doc.setTextColor(...invStatusColor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(inv.status ?? "-", colStatusX, y);

      y += rh;
    });
    y += 8;
  }

  // ---- Total block ----
  ensureSpace(28);
  const totalBoxW = 70;
  const totalBoxX = PAGE_W - MARGIN - totalBoxW;
  const totalBoxH = 20;
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(totalBoxX, y, totalBoxW, totalBoxH, 2, 2, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("ORDER TOTAL", totalBoxX + 5, y + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(`Rs. ${formatCurrency(totalOverride ?? order.docTotal)}`, totalBoxX + 5, y + 16);

  drawFooter();

  doc.save(`Order-${label.replace(/[\\/]/g, "_")}.pdf`);
};

// ---------------------------------------------------------------------------
// Single order-item PDF
// ---------------------------------------------------------------------------

export const generateOrderItemPdf = (item: OrderItemDetail): void => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const label = item.itemCode ?? String(item.lineNumber);
  let y = 0;
  let page = 1;

  const drawFooter = () => {
    doc.setDrawColor(...COLORS.border);
    doc.line(MARGIN, FOOTER_Y - 6, PAGE_W - MARGIN, FOOTER_Y - 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-GB")}`, MARGIN, FOOTER_Y);
    doc.text(`Order Item ${label} - Page ${page}`, PAGE_W - MARGIN, FOOTER_Y, { align: "right" });
  };

  const addPage = () => {
    drawFooter();
    doc.addPage();
    page += 1;
    y = 20;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > BOTTOM_LIMIT) addPage();
  };

  const sectionTitle = (text: string) => {
    ensureSpace(14);
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

  // ---- Header band ----
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

  const statusColor = STATUS_COLORS[item.deliveryStatus] ?? COLORS.muted;
  const statusText = item.deliveryStatus?.replace(/_/g, " ") ?? "-";
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const pillW = doc.getTextWidth(statusText) + 10;
  const pillX = PAGE_W - MARGIN - pillW;
  doc.setFillColor(...COLORS.white);
  doc.roundedRect(pillX, 10, pillW, 8, 2, 2, "F");
  doc.setTextColor(...statusColor);
  doc.text(statusText, pillX + pillW / 2, 15.3, { align: "center" });

  y = 46;

  // ---- Item description strip ----
  ensureSpace(20);
  doc.setDrawColor(...COLORS.border);
  doc.setFillColor(...COLORS.bandBg);
  doc.roundedRect(MARGIN, y, CONTENT_W, 16, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.text("DESCRIPTION", MARGIN + 5, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.primary);
  const descLines = doc.splitTextToSize(item.itemDescription ?? "-", CONTENT_W - 10);
  doc.text(descLines[0] ?? "-", MARGIN + 5, y + 12);
  y += 24;

  // ---- Quantity stat cards ----
  sectionTitle("Quantity Overview");
  const cardGap = 6;
  const cardW = (CONTENT_W - cardGap * 2) / 3;
  const cardH = 24;
  const stats: [string, string | number, [number, number, number]][] = [
    ["ORDERED", `${item.quantity ?? 0} ${item.measureUnit ?? ""}`, COLORS.primary],
    ["DELIVERED", `${item.deliveryQuantity ?? 0} ${item.measureUnit ?? ""}`, [22, 163, 74]],
    ["PENDING", `${item.pendingQuantity ?? 0} ${item.measureUnit ?? ""}`, [217, 119, 6]],
  ];
  ensureSpace(cardH + 6);
  stats.forEach(([labelText, value, color], i) => {
    const cardX = MARGIN + i * (cardW + cardGap);
    doc.setDrawColor(...COLORS.border);
    doc.setFillColor(...COLORS.white);
    doc.roundedRect(cardX, y, cardW, cardH, 2, 2, "FD");
    doc.setFillColor(...color);
    doc.rect(cardX, y, 2.5, cardH, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(labelText, cardX + 7, y + 9);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...color);
    doc.text(String(value), cardX + 7, y + 18);
  });
  y += cardH + 6;

  // ---- Delivery progress bar ----
  const qty = item.quantity || 0;
  const delivered = item.deliveryQuantity || 0;
  const pct = qty > 0 ? Math.min(100, Math.round((delivered / qty) * 100)) : 0;
  ensureSpace(16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.muted);
  doc.text(`DELIVERY PROGRESS - ${pct}%`, MARGIN, y);
  y += 4;
  doc.setFillColor(...COLORS.border);
  doc.roundedRect(MARGIN, y, CONTENT_W, 4, 2, 2, "F");
  if (pct > 0) {
    doc.setFillColor(...(STATUS_COLORS[item.deliveryStatus] ?? [22, 163, 74]));
    doc.roundedRect(MARGIN, y, (CONTENT_W * pct) / 100, 4, 2, 2, "F");
  }
  y += 14;

  // ---- Details grid ----
  sectionTitle("Item Details");
  const detailGrid: [string, string][] = [
    ["Item Code", item.itemCode ?? "-"],
    ["Order Number", item.orderNumber ?? "-"],
    ["HSN Code", item.hsnCode ?? "-"],
    ["Line Number", String(item.lineNumber ?? "-")],
    ["Measure Unit", item.measureUnit ?? "-"],
    ["Unit Price", `Rs. ${formatCurrency(item.price)}`],
  ];
  const rowH = 9;
  const boxH = detailGrid.length * rowH + 4;
  ensureSpace(boxH + 10);
  const boxTop = y - 2;
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
  y = boxTop + boxH + 14;

  // ---- Total block ----
  ensureSpace(28);
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

  drawFooter();

  doc.save(`OrderItem-${label.replace(/[\\/]/g, "_")}.pdf`);
};