import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  getSubtotal, getGSTAmount, getTotal, formatCurrency, getCurrencySymbol,
} from './calculations';
import { formatDate } from './invoiceNumber';

/**
 * Generate and download a PDF invoice using jsPDF + autoTable.
 * @param {Object} invoiceData - Full invoice state
 */
export function generatePDF(invoiceData) {
  const { seller, buyer, invoice, items, gstRate, currency } = invoiceData;

  const subtotal  = getSubtotal(items);
  const gstAmount = getGSTAmount(subtotal, gstRate);
  const total     = getTotal(subtotal, gstAmount);

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW  = doc.internal.pageSize.getWidth();
  const margin = 15;

  // ── Colors ──────────────────────────────────────────────
  const primaryColor  = [67, 97, 238];   // #4361ee
  const accentColor   = [249, 115, 22];  // #f97316
  const darkText      = [15, 23, 42];    // surface-900
  const mutedText     = [100, 116, 139]; // surface-500
  const lightBg       = [241, 245, 249]; // surface-100
  const white         = [255, 255, 255];

  // ── Header Banner ────────────────────────────────────────
  doc.setFillColor(...primaryColor);
  doc.roundedRect(0, 0, pageW, 42, 0, 0, 'F');

  // Logo area — use uploaded logo if available, else draw text placeholder
  doc.setDrawColor(...white);
  doc.roundedRect(margin, 9, 42, 24, 4, 4, 'S');

  if (seller.logo) {
    try {
      // Detect format from data URL
      const format = seller.logo.startsWith('data:image/png') ? 'PNG'
        : seller.logo.startsWith('data:image/svg') ? 'PNG'  // SVG not directly supported
        : 'JPEG';
      doc.addImage(seller.logo, format, margin + 1, 10, 40, 22, undefined, 'FAST');
    } catch {
      // Fallback to text if image fails
      doc.setTextColor(...white);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('LOGO', margin + 21, 23, { align: 'center' });
    }
  } else {
    doc.setTextColor(...white);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('IF', margin + 21, 20, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('INVOICE', margin + 21, 26, { align: 'center' });
    doc.text('FORGE', margin + 21, 30, { align: 'center' });
  }

  // Company name in header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(seller.businessName || 'Your Business', margin + 48, 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  if (seller.gstNumber) {
    doc.text(`GSTIN: ${seller.gstNumber}`, margin + 48, 24);
  }
  if (seller.email) doc.text(seller.email, margin + 48, 29);
  if (seller.phone) doc.text(seller.phone, margin + 48, 34);

  // "INVOICE" label on right
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageW - margin, 22, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`#${invoice.number}`, pageW - margin, 32, { align: 'right' });

  // ── Invoice Meta ─────────────────────────────────────────
  let y = 52;
  doc.setFontSize(8);
  doc.setTextColor(...mutedText);
  doc.text('Invoice Date', margin, y);
  doc.text('Due Date', margin + 50, y);
  doc.text('Currency', margin + 100, y);
  y += 5;
  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(formatDate(invoice.date) || '—', margin, y);
  doc.text(formatDate(invoice.dueDate) || '—', margin + 50, y);
  doc.text(currency, margin + 100, y);
  doc.setFont('helvetica', 'normal');

  // ── Divider ───────────────────────────────────────────────
  y += 10;
  doc.setDrawColor(...lightBg);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);

  // ── Bill To ───────────────────────────────────────────────
  y += 8;
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin, y, (pageW - 2 * margin) / 2 - 5, 30, 3, 3, 'F');

  doc.setFontSize(7);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', margin + 5, y + 7);

  doc.setTextColor(...darkText);
  doc.setFontSize(10);
  doc.text(buyer.clientName || '—', margin + 5, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  if (buyer.clientEmail) doc.text(buyer.clientEmail, margin + 5, y + 20);

  const addrLines = doc.splitTextToSize(buyer.clientAddress || '', 70);
  doc.text(addrLines.slice(0, 2), margin + 5, y + 25);

  // Seller address on the right
  const rightX = (pageW - 2 * margin) / 2 + margin + 5;
  doc.setFillColor(...lightBg);
  doc.roundedRect(rightX - 5, y, (pageW - 2 * margin) / 2 - 5, 30, 3, 3, 'F');

  doc.setFontSize(7);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('FROM', rightX, y + 7);

  doc.setTextColor(...darkText);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const sellerAddrLines = doc.splitTextToSize(seller.address || '', 70);
  doc.text(sellerAddrLines.slice(0, 3), rightX, y + 14);

  // ── Line Items Table ──────────────────────────────────────
  y += 38;

  const tableRows = items
    .filter(item => item.description || item.qty || item.rate)
    .map((item, i) => {
      const qty  = parseFloat(item.qty)  || 0;
      const rate = parseFloat(item.rate) || 0;
      return [
        i + 1,
        item.description || '',
        qty,
        formatCurrency(rate, currency),
        formatCurrency(qty * rate, currency),
      ];
    });

  if (tableRows.length === 0) {
    tableRows.push([1, 'No items added', 0, formatCurrency(0, currency), formatCurrency(0, currency)]);
  }

  autoTable(doc, {
    startY:     y,
    head:       [['#', 'Description', 'Qty', 'Rate', 'Amount']],
    body:       tableRows,
    margin:     { left: margin, right: margin },
    theme:      'plain',
    headStyles: {
      fillColor:   primaryColor,
      textColor:   white,
      fontStyle:   'bold',
      fontSize:    9,
      cellPadding: 4,
    },
    bodyStyles: {
      textColor:   darkText,
      fontSize:    9,
      cellPadding: 3.5,
    },
    alternateRowStyles: {
      fillColor: lightBg,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 38, halign: 'right', fontStyle: 'bold' },
    },
    didDrawPage: (data) => {
      y = data.cursor.y;
    },
  });

  // ── Totals Section ────────────────────────────────────────
  const finalY = doc.lastAutoTable.finalY + 8;
  const totalsX = pageW - margin - 72;

  doc.setFillColor(...lightBg);
  doc.roundedRect(totalsX, finalY, 72, 36, 3, 3, 'F');

  const rowH = 7;
  doc.setFontSize(9);
  doc.setTextColor(...mutedText);
  doc.setFont('helvetica', 'normal');

  doc.text('Subtotal:', totalsX + 5, finalY + rowH * 1.2);
  doc.text(`GST (${gstRate}%):`, totalsX + 5, finalY + rowH * 2.2);

  doc.setTextColor(...darkText);
  doc.text(formatCurrency(subtotal, currency), totalsX + 67, finalY + rowH * 1.2, { align: 'right' });
  doc.text(formatCurrency(gstAmount, currency), totalsX + 67, finalY + rowH * 2.2, { align: 'right' });

  // Grand total highlight
  doc.setFillColor(...primaryColor);
  doc.roundedRect(totalsX, finalY + rowH * 2.8, 72, 10, 3, 3, 'F');
  doc.setTextColor(...white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL:', totalsX + 5, finalY + rowH * 3.5);
  doc.text(formatCurrency(total, currency), totalsX + 67, finalY + rowH * 3.5, { align: 'right' });

  // ── Footer note ──────────────────────────────────────────
  const footerY = finalY + 52;
  doc.setTextColor(...mutedText);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.text('Thank you for your business!', margin, footerY);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated by InvoiceForge', pageW - margin, footerY, { align: 'right' });

  // ── Save ─────────────────────────────────────────────────
  doc.save(`${invoice.number || 'invoice'}.pdf`);
}
