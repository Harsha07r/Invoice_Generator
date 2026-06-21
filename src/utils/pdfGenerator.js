import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getSubtotal, getGSTAmount, getTotal } from './calculations';
import { formatDate } from './invoiceNumber';

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS — A4 = 210 × 297 mm
───────────────────────────────────────────────────────────────────────────── */
const PAGE_W = 210;
const PAGE_H = 297;
const ML     = 15;                   // left margin
const MR     = 15;                   // right margin
const CW     = PAGE_W - ML - MR;    // 180 mm usable width
const RX     = PAGE_W - MR;         // 195 mm — right edge

// Colour palette
const C_BLUE     = [37,  99, 235];   // accent #2563eb
const C_BLUE_DK  = [30,  64, 175];   // grand total bg #1e40af
const C_DARK     = [17,  24,  39];   // near-black body
const C_MUTED    = [107, 114, 128];  // grey labels
const C_BORDER   = [229, 231, 235];  // table / box borders
const C_STRIPE   = [249, 250, 251];  // zebra even row
const C_HEADBG   = [243, 244, 246];  // section header bg
const C_WHITE    = [255, 255, 255];

/* ─────────────────────────────────────────────────────────────────────────────
   PDF-SAFE CURRENCY FORMATTER
   jsPDF's built-in Helvetica (Latin-1) cannot render ₹  → use "Rs."
   for USD/EUR the symbols work fine.
───────────────────────────────────────────────────────────────────────────── */
function pdfMoney(amount, code = 'INR') {
  const prefix  = { INR: 'Rs.', USD: '$', EUR: 'EUR' };
  const locale  = { INR: 'en-IN', USD: 'en-US', EUR: 'de-DE' };
  const pfx     = prefix[code] ?? 'Rs.';
  const loc     = locale[code] ?? 'en-IN';
  try {
    const n = new Intl.NumberFormat(loc, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${pfx} ${n}`;
  } catch {
    return `${pfx} ${amount.toFixed(2)}`;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   MICRO HELPERS
───────────────────────────────────────────────────────────────────────────── */
const sf = (doc, size, style = 'normal', color = C_DARK) => {
  doc.setFontSize(size);
  doc.setFont('helvetica', style);
  doc.setTextColor(...color);
};

const hRule = (doc, y, color = C_BORDER, lw = 0.25, x1 = ML, x2 = RX) => {
  doc.setDrawColor(...color);
  doc.setLineWidth(lw);
  doc.line(x1, y, x2, y);
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────────────────── */
export function generatePDF(invoiceData) {
  const { seller, buyer, invoice, items, gstRate, currency } = invoiceData;

  const sub  = getSubtotal(items);
  const gst  = getGSTAmount(sub, gstRate);
  const tot  = getTotal(sub, gst);

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // White base
  doc.setFillColor(...C_WHITE);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  /* ════════════════════════════════════════════════════════════════════════
     SECTION 1 — HEADER  (y 12 → ~54)
  ════════════════════════════════════════════════════════════════════════ */
  let y = 12;

  /* ── Left: Logo ── */
  if (seller.logo) {
    try {
      const fmt = seller.logo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      // Clean white-bg box for logo
      doc.setFillColor(...C_WHITE);
      doc.setDrawColor(...C_BORDER);
      doc.setLineWidth(0.3);
      doc.roundedRect(ML, y, 26, 20, 2, 2, 'FD');
      doc.addImage(seller.logo, fmt, ML + 1, y + 1, 24, 18, undefined, 'FAST');
    } catch {
      drawDefaultLogo(doc, ML, y);
    }
  } else {
    drawDefaultLogo(doc, ML, y);
  }

  /* ── Left: Seller details below logo ── */
  let sy = y + 25;
  sf(doc, 11, 'bold', C_DARK);
  doc.text(seller.businessName || 'Your Business', ML, sy);

  sf(doc, 7.5, 'normal', C_MUTED);
  sy += 5;
  if (seller.email)   { doc.text(seller.email,   ML, sy); sy += 4; }
  if (seller.phone)   { doc.text(seller.phone,   ML, sy); sy += 4; }
  if (seller.address) {
    const ln = doc.splitTextToSize(seller.address, 72);
    ln.slice(0, 2).forEach(l => { doc.text(l, ML, sy); sy += 4; });
  }
  if (seller.gstNumber) {
    sf(doc, 7, 'normal', C_MUTED);
    doc.text(`GSTIN: ${seller.gstNumber}`, ML, sy);
  }

  /* ── Right: INVOICE heading + meta ──────────────────────────────────── */
  // "INVOICE" — large, blue, top-right
  sf(doc, 30, 'bold', C_BLUE);
  doc.text('INVOICE', RX, y + 10, { align: 'right' });

  // Thin blue underline beneath heading
  doc.setFillColor(...C_BLUE);
  doc.rect(RX - 52, y + 13, 52, 0.8, 'F');

  // Meta block — label left, value right, stacked rows
  // Use left-edge of meta block at x=128, right edge at RX=195
  const META_L = 128;  // label column x
  const META_R = RX;   // value right-align x

  const metaRows = [
    ['Invoice No.',   invoice.number  || '—'],
    ['Invoice Date',  formatDate(invoice.date)  || '—'],
    ['Due Date',      formatDate(invoice.dueDate) || '—'],
  ];

  let my = y + 21;
  metaRows.forEach(([label, value]) => {
    sf(doc, 7.5, 'bold', C_DARK);
    doc.text(label, META_L, my);
    sf(doc, 7.5, 'normal', C_MUTED);
    doc.text(value, META_R, my, { align: 'right' });
    my += 6;
  });

  /* ── Header bottom rule ── */
  const headerBottom = Math.max(sy + 4, my + 2, 55);
  hRule(doc, headerBottom, C_BORDER, 0.4);

  /* ════════════════════════════════════════════════════════════════════════
     SECTION 2 — BILL TO / FROM  (two equal columns)
  ════════════════════════════════════════════════════════════════════════ */
  y = headerBottom + 6;
  const colW = (CW - 5) / 2;       // ~87.5 mm each
  const col2 = ML + colW + 5;       // right column x start

  // Left box — Bill To
  doc.setFillColor(...C_STRIPE);
  doc.setDrawColor(...C_BORDER);
  doc.setLineWidth(0.2);
  doc.roundedRect(ML, y, colW, 34, 2, 2, 'FD');

  // Right box — From
  doc.roundedRect(col2, y, colW, 34, 2, 2, 'FD');

  // Bill To content
  sf(doc, 6.5, 'bold', C_BLUE);
  doc.text('BILL TO', ML + 4, y + 6);

  sf(doc, 9, 'bold', C_DARK);
  doc.text(buyer.clientName || '—', ML + 4, y + 12);

  sf(doc, 7.5, 'normal', C_MUTED);
  let by = y + 17.5;
  if (buyer.clientEmail) {
    doc.text(buyer.clientEmail, ML + 4, by); by += 4.5;
  }
  if (buyer.clientAddress) {
    const ln = doc.splitTextToSize(buyer.clientAddress, colW - 8);
    ln.slice(0, 2).forEach(l => { doc.text(l, ML + 4, by); by += 4; });
  }

  // From content
  sf(doc, 6.5, 'bold', C_BLUE);
  doc.text('FROM', col2 + 4, y + 6);

  sf(doc, 9, 'bold', C_DARK);
  doc.text(seller.businessName || '—', col2 + 4, y + 12);

  sf(doc, 7.5, 'normal', C_MUTED);
  let fy = y + 17.5;
  if (seller.email) { doc.text(seller.email, col2 + 4, fy); fy += 4.5; }
  if (seller.address) {
    const ln = doc.splitTextToSize(seller.address, colW - 8);
    ln.slice(0, 2).forEach(l => { doc.text(l, col2 + 4, fy); fy += 4; });
  }
  if (seller.gstNumber) {
    sf(doc, 7, 'normal', C_MUTED);
    doc.text(`GSTIN: ${seller.gstNumber}`, col2 + 4, fy);
  }

  /* ════════════════════════════════════════════════════════════════════════
     SECTION 3 — LINE ITEMS TABLE
     Columns total = 180 mm (= CW)
       #    10  center
       Desc 82  left
       Qty  16  center
       Rate 36  right
       Amt  36  right
  ════════════════════════════════════════════════════════════════════════ */
  const tableY = y + 40;

  const validItems = items.filter(i => i.description || i.qty || i.rate);
  const rows = validItems.length > 0
    ? validItems.map((item, idx) => {
        const q   = parseFloat(item.qty)  || 0;
        const r   = parseFloat(item.rate) || 0;
        const amt = q * r;
        return [idx + 1, item.description || '', q, pdfMoney(r, currency), pdfMoney(amt, currency)];
      })
    : [[1, 'No items added yet', 0, pdfMoney(0, currency), pdfMoney(0, currency)]];

  autoTable(doc, {
    startY:    tableY,
    head:      [['#', 'Description', 'Qty', 'Unit Rate', 'Amount']],
    body:      rows,
    margin:    { left: ML, right: MR },
    tableWidth: CW,

    styles: {
      font:         'helvetica',
      fontSize:     8.5,
      textColor:    C_DARK,
      lineColor:    C_BORDER,
      lineWidth:    0.2,
      overflow:     'linebreak',
      cellPadding:  { top: 4, bottom: 4, left: 4, right: 4 },
    },

    headStyles: {
      fillColor:    C_BLUE,
      textColor:    C_WHITE,
      fontStyle:    'bold',
      fontSize:     8,
      halign:       'left',
      cellPadding:  { top: 5, bottom: 5, left: 4, right: 4 },
    },

    alternateRowStyles: { fillColor: C_STRIPE },
    bodyStyles:         { fillColor: C_WHITE },

    columnStyles: {
      0: { cellWidth: 10, halign: 'center', textColor: C_MUTED, fontSize: 8 },
      1: { cellWidth: 80, halign: 'left' },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 37, halign: 'right' },
      4: { cellWidth: 37, halign: 'right', fontStyle: 'bold' },
    },

    // Draw right-border on each cell to act as column separator
    didParseCell: () => {},
  });

  /* ════════════════════════════════════════════════════════════════════════
     SECTION 4 — TOTALS (right-aligned) + NOTES (left)
  ════════════════════════════════════════════════════════════════════════ */
  const afterY   = doc.lastAutoTable.finalY + 8;
  const TOT_W    = 76;          // totals block width
  const TOT_X    = RX - TOT_W; // left edge of totals block = 119

  /* Subtotal row */
  let ty = afterY;
  drawTotalsRow(doc, 'Subtotal', pdfMoney(sub, currency), TOT_X, ty, TOT_W, false);
  ty += 7.5;

  /* GST row */
  drawTotalsRow(doc, `GST (${gstRate}%)`, pdfMoney(gst, currency), TOT_X, ty, TOT_W, false);
  ty += 7.5;

  /* Divider */
  hRule(doc, ty, C_BORDER, 0.25, TOT_X, RX);
  ty += 2;

  /* Grand Total — dark blue bg */
  doc.setFillColor(...C_BLUE_DK);
  doc.roundedRect(TOT_X, ty, TOT_W, 10, 2, 2, 'F');
  sf(doc, 9, 'bold', C_WHITE);
  doc.text('Grand Total', TOT_X + 4, ty + 6.5);
  sf(doc, 9.5, 'bold', C_WHITE);
  doc.text(pdfMoney(tot, currency), RX - 4, ty + 6.5, { align: 'right' });

  /* ── Notes & Terms (left side, same y zone) ── */
  const notesX = ML;
  const notesW = TOT_X - ML - 8;
  let   ny     = afterY;

  sf(doc, 8, 'bold', C_DARK);
  doc.text('Notes', notesX, ny + 4);
  sf(doc, 7.5, 'normal', C_MUTED);
  doc.text('Thank you for your business.', notesX, ny + 9);

  ny += 16;
  sf(doc, 8, 'bold', C_DARK);
  doc.text('Terms & Conditions', notesX, ny);
  sf(doc, 7.5, 'normal', C_MUTED);
  const terms = doc.splitTextToSize(
    'Payment due within 30 days of the invoice date. Please include the invoice number in your payment reference.',
    notesW
  );
  terms.slice(0, 3).forEach((line, i) => {
    doc.text(line, notesX, ny + 5 + i * 4.5);
  });

  /* ════════════════════════════════════════════════════════════════════════
     SECTION 5 — FOOTER
  ════════════════════════════════════════════════════════════════════════ */
  const footerY = PAGE_H - 10;
  hRule(doc, footerY - 5, C_BORDER, 0.25);
  sf(doc, 6.5, 'normal', C_MUTED);
  doc.text('Generated using InvoiceForge', ML, footerY);
  doc.text('Page 1 of 1', PAGE_W / 2, footerY, { align: 'center' });
  doc.text('Built for Digital Heroes  ·  digitalheroesco.com', RX, footerY, { align: 'right' });

  /* ── Save ── */
  doc.save(`${invoice.number || 'invoice'}.pdf`);
}

/* ─────────────────────────────────────────────────────────────────────────────
   PRIVATE: Clean minimal logo placeholder
───────────────────────────────────────────────────────────────────────────── */
function drawDefaultLogo(doc, x, y) {
  // Outer rounded square — white fill, blue stroke
  doc.setFillColor(239, 246, 255);           // very light blue bg
  doc.setDrawColor(...C_BLUE);
  doc.setLineWidth(0.6);
  doc.roundedRect(x, y, 26, 20, 3, 3, 'FD');

  // Top accent bar inside box
  doc.setFillColor(...C_BLUE);
  doc.rect(x, y, 26, 4, 'F');

  // "IF" initials — white on blue bar
  doc.setFont('helvetica', 'black');
  doc.setFontSize(9);
  doc.setTextColor(...C_WHITE);
  doc.text('IF', x + 13, y + 3.2, { align: 'center', baseline: 'middle' });

  // "INVOICE FORGE" subtitle — blue text on light bg
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(4.5);
  doc.setTextColor(...C_BLUE);
  doc.text('INVOICE FORGE', x + 13, y + 14, { align: 'center' });
}

/* ─────────────────────────────────────────────────────────────────────────────
   PRIVATE: Totals row (label + right-aligned value)
───────────────────────────────────────────────────────────────────────────── */
function drawTotalsRow(doc, label, value, x, y, w, _highlighted) {
  sf(doc, 8, 'normal', C_MUTED);
  doc.text(label, x + 4, y + 5);
  sf(doc, 8.5, 'bold', C_DARK);
  doc.text(value, x + w - 4, y + 5, { align: 'right' });
}
