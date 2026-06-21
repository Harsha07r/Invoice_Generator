import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getSubtotal, getGSTAmount, getTotal, formatCurrency } from './calculations';
import { formatDate } from './invoiceNumber';

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
   A4 = 210 × 297 mm  |  margin L/R = 14 mm  |  content width = 182 mm
───────────────────────────────────────────────────────────────────────────── */
const PAGE_W   = 210;
const PAGE_H   = 297;
const ML       = 14;          // left margin
const MR       = 14;          // right margin
const CW       = PAGE_W - ML - MR;   // 182 mm content width
const RIGHT    = PAGE_W - MR;        // 196 mm

// Palette
const BLUE     = [37, 99, 235];      // #2563eb  — single accent
const BLUE_LT  = [239, 246, 255];    // #eff6ff  — accent light bg
const DARK     = [15, 23, 42];       // #0f172a  — body text
const MUTED    = [100, 116, 139];    // #64748b  — secondary text
const BORDER   = [226, 232, 240];    // #e2e8f0  — subtle borders
const STRIPE   = [248, 250, 252];    // #f8fafc  — zebra even rows
const WHITE    = [255, 255, 255];
const TOTAL_BG = [30, 64, 175];      // #1e40af  — grand total dark blue

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function setFont(doc, size, style = 'normal', color = DARK) {
  doc.setFontSize(size);
  doc.setFont('helvetica', style);
  doc.setTextColor(...color);
}

function hLine(doc, y, x1 = ML, x2 = RIGHT, color = BORDER, w = 0.25) {
  doc.setDrawColor(...color);
  doc.setLineWidth(w);
  doc.line(x1, y, x2, y);
}

function labelValue(doc, label, value, x, y, labelW = 22) {
  setFont(doc, 7.5, 'normal', MUTED);
  doc.text(label, x, y);
  setFont(doc, 8.5, 'normal', DARK);
  doc.text(value || '—', x + labelW, y);
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN GENERATOR
───────────────────────────────────────────────────────────────────────────── */
export function generatePDF(invoiceData) {
  const { seller, buyer, invoice, items, gstRate, currency } = invoiceData;

  const subtotal  = getSubtotal(items);
  const gstAmount = getGSTAmount(subtotal, gstRate);
  const total     = getTotal(subtotal, gstAmount);

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  /* ── 1. WHITE PAGE BASE ─────────────────────────────────────────────────── */
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  /* ══════════════════════════════════════════════════════════════════════════
     HEADER  (y: 10 → ~52)   ≈ 14% of page height
  ══════════════════════════════════════════════════════════════════════════ */
  let y = 12;

  /* Left: Logo */
  if (seller.logo) {
    try {
      const fmt = seller.logo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      // Logo box 28×20 mm
      doc.addImage(seller.logo, fmt, ML, y, 28, 20, undefined, 'FAST');
    } catch {
      _drawLogoPlaceholder(doc, ML, y);
    }
  } else {
    _drawLogoPlaceholder(doc, ML, y);
  }

  /* Left: Business info below logo */
  const infoY = y + 24;
  setFont(doc, 10, 'bold', DARK);
  doc.text(seller.businessName || 'Your Business', ML, infoY);

  setFont(doc, 7.5, 'normal', MUTED);
  let infoLine = infoY + 4.5;
  if (seller.email)   { doc.text(seller.email,  ML, infoLine); infoLine += 4; }
  if (seller.phone)   { doc.text(seller.phone,  ML, infoLine); infoLine += 4; }
  if (seller.address) {
    const lines = doc.splitTextToSize(seller.address, 70);
    lines.slice(0, 2).forEach(l => { doc.text(l, ML, infoLine); infoLine += 4; });
  }
  if (seller.gstNumber) {
    setFont(doc, 7, 'normal', MUTED);
    doc.text(`GSTIN: ${seller.gstNumber}`, ML, infoLine);
  }

  /* Right: INVOICE title block */
  setFont(doc, 28, 'bold', BLUE);
  doc.text('INVOICE', RIGHT, y + 8, { align: 'right' });

  setFont(doc, 8, 'bold', DARK);
  doc.text('Invoice No.', RIGHT - 38, y + 16);
  setFont(doc, 8, 'normal', MUTED);
  doc.text(invoice.number || 'INV-000001', RIGHT, y + 16, { align: 'right' });

  setFont(doc, 8, 'bold', DARK);
  doc.text('Invoice Date', RIGHT - 38, y + 22);
  setFont(doc, 8, 'normal', MUTED);
  doc.text(formatDate(invoice.date) || '—', RIGHT, y + 22, { align: 'right' });

  setFont(doc, 8, 'bold', DARK);
  doc.text('Due Date', RIGHT - 38, y + 28);
  setFont(doc, 8, 'normal', MUTED);
  doc.text(formatDate(invoice.dueDate) || '—', RIGHT, y + 28, { align: 'right' });

  /* Accent bar under "INVOICE" */
  doc.setFillColor(...BLUE);
  doc.rect(RIGHT - 50, y + 32, 50, 1, 'F');

  /* ── Header separator ── */
  y = 56;
  hLine(doc, y, ML, RIGHT, BORDER, 0.4);

  /* ══════════════════════════════════════════════════════════════════════════
     CLIENT INFO  (y: 60 → 94)
  ══════════════════════════════════════════════════════════════════════════ */
  y = 60;
  const colMid  = ML + CW / 2 + 4;  // 105 mm  — right column start
  const colW    = CW / 2 - 4;       // 87 mm each column

  /* Left bg box */
  doc.setFillColor(...STRIPE);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.2);
  doc.roundedRect(ML, y, colW, 32, 2, 2, 'FD');

  /* Right bg box */
  doc.roundedRect(colMid, y, colW, 32, 2, 2, 'FD');

  /* "BILL TO" label */
  setFont(doc, 6.5, 'bold', BLUE);
  doc.text('BILL TO', ML + 4, y + 5.5);

  setFont(doc, 9, 'bold', DARK);
  doc.text(buyer.clientName || '—', ML + 4, y + 11);
  setFont(doc, 7.5, 'normal', MUTED);
  let bY = y + 16;
  if (buyer.clientEmail) {
    doc.text(buyer.clientEmail, ML + 4, bY);
    bY += 4.5;
  }
  if (buyer.clientAddress) {
    const addrLines = doc.splitTextToSize(buyer.clientAddress, colW - 8);
    addrLines.slice(0, 3).forEach(l => { doc.text(l, ML + 4, bY); bY += 4; });
  }

  /* "FROM" label */
  setFont(doc, 6.5, 'bold', BLUE);
  doc.text('FROM', colMid + 4, y + 5.5);

  setFont(doc, 9, 'bold', DARK);
  doc.text(seller.businessName || '—', colMid + 4, y + 11);
  setFont(doc, 7.5, 'normal', MUTED);
  let fY = y + 16;
  if (seller.email) { doc.text(seller.email, colMid + 4, fY); fY += 4.5; }
  if (seller.address) {
    const sLines = doc.splitTextToSize(seller.address, colW - 8);
    sLines.slice(0, 2).forEach(l => { doc.text(l, colMid + 4, fY); fY += 4; });
  }
  if (seller.gstNumber) {
    setFont(doc, 7, 'normal', MUTED);
    doc.text(`GSTIN: ${seller.gstNumber}`, colMid + 4, fY);
  }

  /* ══════════════════════════════════════════════════════════════════════════
     ITEMS TABLE   (starts at y: ~96)
  ══════════════════════════════════════════════════════════════════════════ */
  const tableStartY = y + 36;

  const validItems = items.filter(i => i.description || i.qty || i.rate);
  const tableBody  = validItems.length > 0
    ? validItems.map((item, idx) => {
        const qty    = parseFloat(item.qty)  || 0;
        const rate   = parseFloat(item.rate) || 0;
        const amount = qty * rate;
        return [
          idx + 1,
          item.description || '',
          qty.toString(),
          formatCurrency(rate,   currency),
          formatCurrency(amount, currency),
        ];
      })
    : [[1, 'No items added', '0', formatCurrency(0, currency), formatCurrency(0, currency)]];

  autoTable(doc, {
    startY:  tableStartY,
    head:    [['#', 'Description', 'Qty', 'Unit Rate', 'Amount']],
    body:    tableBody,
    margin:  { left: ML, right: MR },
    tableWidth: 'auto',

    styles: {
      font:      'helvetica',
      fontSize:  8.5,
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
      textColor: DARK,
      lineColor: BORDER,
      lineWidth: 0.2,
    },

    headStyles: {
      fillColor:  BLUE,
      textColor:  WHITE,
      fontStyle:  'bold',
      fontSize:   8,
      cellPadding: { top: 4.5, bottom: 4.5, left: 4, right: 4 },
      halign:     'left',
    },

    alternateRowStyles: {
      fillColor: STRIPE,
    },

    bodyStyles: {
      fillColor: WHITE,
    },

    columnStyles: {
      0: { cellWidth: 10, halign: 'center', textColor: MUTED, fontSize: 8 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 18,  halign: 'center' },
      3: { cellWidth: 38,  halign: 'right' },
      4: { cellWidth: 38,  halign: 'right', fontStyle: 'bold' },
    },
  });

  /* ══════════════════════════════════════════════════════════════════════════
     TOTALS  (bottom-right, after table)
  ══════════════════════════════════════════════════════════════════════════ */
  const afterTable = doc.lastAutoTable.finalY + 6;
  const totalsX    = RIGHT - 72;        // left edge of totals box
  const totalsW    = 72;
  const rowH       = 7;

  // Subtotal row
  let tY = afterTable;
  doc.setFillColor(...WHITE);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.2);

  _totalsRow(doc, 'Subtotal',       formatCurrency(subtotal,  currency), totalsX, tY, totalsW, rowH, false);
  tY += rowH;
  _totalsRow(doc, `GST (${gstRate}%)`, formatCurrency(gstAmount, currency), totalsX, tY, totalsW, rowH, false);
  tY += rowH;

  // Thin divider above grand total
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.25);
  doc.line(totalsX, tY, RIGHT, tY);

  // Grand Total — blue background
  tY += 0.5;
  doc.setFillColor(...TOTAL_BG);
  doc.roundedRect(totalsX, tY, totalsW, rowH + 2, 2, 2, 'F');

  setFont(doc, 8.5, 'bold', WHITE);
  doc.text('Grand Total', totalsX + 4, tY + 5.5);
  setFont(doc, 9.5, 'bold', WHITE);
  doc.text(formatCurrency(total, currency), RIGHT - 3, tY + 5.5, { align: 'right' });

  /* ══════════════════════════════════════════════════════════════════════════
     NOTES & TERMS   (left side, same vertical zone as totals)
  ══════════════════════════════════════════════════════════════════════════ */
  const notesX = ML;
  const notesY = afterTable;
  const notesW = totalsX - ML - 8;

  setFont(doc, 7.5, 'bold', DARK);
  doc.text('Notes', notesX, notesY + 4);
  setFont(doc, 7.5, 'normal', MUTED);
  doc.text('Thank you for your business.', notesX, notesY + 9);

  setFont(doc, 7.5, 'bold', DARK);
  doc.text('Terms & Conditions', notesX, notesY + 16);
  setFont(doc, 7.5, 'normal', MUTED);
  const terms = doc.splitTextToSize('Payment due within 30 days of the invoice date. Please include the invoice number in your payment reference.', notesW);
  terms.slice(0, 3).forEach((line, i) => {
    doc.text(line, notesX, notesY + 21 + i * 4);
  });

  /* Bank / Payment details hint */
  setFont(doc, 7, 'normal', MUTED);

  /* ══════════════════════════════════════════════════════════════════════════
     FOOTER
  ══════════════════════════════════════════════════════════════════════════ */
  const footerY = PAGE_H - 10;

  hLine(doc, footerY - 5, ML, RIGHT, BORDER, 0.25);

  setFont(doc, 6.5, 'normal', MUTED);
  doc.text('Generated using InvoiceForge', ML, footerY);
  doc.text('Built for Digital Heroes  ·  digitalheroesco.com', RIGHT, footerY, { align: 'right' });

  // Page number center
  setFont(doc, 6.5, 'normal', MUTED);
  doc.text(`Page 1 of 1`, PAGE_W / 2, footerY, { align: 'center' });

  /* ── Save ── */
  doc.save(`${invoice.number || 'invoice'}.pdf`);
}

/* ─────────────────────────────────────────────────────────────────────────────
   PRIVATE: Logo placeholder box
───────────────────────────────────────────────────────────────────────────── */
function _drawLogoPlaceholder(doc, x, y) {
  doc.setFillColor(37, 99, 235, 0.08);
  doc.setDrawColor(...[37, 99, 235]);
  doc.setLineWidth(0.4);
  doc.roundedRect(x, y, 28, 20, 3, 3, 'FD');

  doc.setFontSize(13);
  doc.setFont('helvetica', 'black');
  doc.setTextColor(37, 99, 235);
  doc.text('IF', x + 14, y + 10, { align: 'center', baseline: 'middle' });

  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE FORGE', x + 14, y + 16, { align: 'center' });
}

/* ─────────────────────────────────────────────────────────────────────────────
   PRIVATE: Single totals row
───────────────────────────────────────────────────────────────────────────── */
function _totalsRow(doc, label, value, x, y, w, h, highlighted) {
  if (highlighted) {
    doc.setFillColor(...BLUE_LT);
    doc.rect(x, y, w, h, 'F');
  }

  const BLUE_LT = [239, 246, 255];

  // Label
  doc.setFontSize(8);
  doc.setFont('helvetica', highlighted ? 'bold' : 'normal');
  doc.setTextColor(...(highlighted ? BLUE : MUTED));
  doc.text(label, x + 4, y + 4.8);

  // Value
  doc.setFontSize(8);
  doc.setFont('helvetica', highlighted ? 'bold' : 'normal');
  doc.setTextColor(...(highlighted ? BLUE : [15, 23, 42]));
  doc.text(value, x + w - 3, y + 4.8, { align: 'right' });
}
