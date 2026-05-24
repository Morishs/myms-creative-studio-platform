import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate, formatDateTime } from '../data/mockData';
import { companyInfo } from '../data';
import type { DashboardQuote } from '../stores/dashboardStore';

const PRIMARY_COLOR = '#0D6EFD';
const TEXT_COLOR = '#1F2937';
const SECONDARY_TEXT = '#4B5563';

async function loadImageDataUrl(src: string): Promise<string | undefined> {
  try {
    const response = await fetch(src);
    if (!response.ok) return undefined;
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      if (blob.type === 'image/svg+xml') {
        blob.text().then((svgText) => {
          const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
          const image = new Image();
          image.crossOrigin = 'anonymous';
          image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width || 180;
            canvas.height = image.height || 180;
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(undefined);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
          };
          image.onerror = () => resolve(undefined);
          image.src = svgData;
        }).catch(() => resolve(undefined));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      }
    });
  } catch {
    return undefined;
  }
}

function drawHeader(doc: jsPDF, logoDataUrl: string | undefined) {
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', margin, 40, 90, 90);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(PRIMARY_COLOR);
  doc.text(companyInfo.name, margin + 110, 58);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SECONDARY_TEXT);
  doc.text(companyInfo.tagline || 'Studio créatif', margin + 110, 74);

  const rightColumnX = pageWidth - margin;
  const rightText = [
    companyInfo.email,
    companyInfo.phone,
    companyInfo.address,
    companyInfo.website || 'https://myms-studio.com',
  ].filter(Boolean);

  rightText.forEach((text, index) => {
    doc.text(text, rightColumnX, 50 + index * 14, { align: 'right' });
  });

  doc.setDrawColor(PRIMARY_COLOR);
  doc.setLineWidth(2);
  doc.line(margin, 150, pageWidth - margin, 150);
}

function drawInfoBoxes(doc: jsPDF, quote: DashboardQuote) {
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const boxWidth = (pageWidth - margin * 2 - 20) / 2;
  const boxHeight = 110;

  doc.setDrawColor('#E5E7EB');
  doc.setFillColor('#F9FAFB');
  doc.roundedRect(margin, 165, boxWidth, boxHeight, 8, 8, 'FD');
  doc.roundedRect(margin + boxWidth + 20, 165, boxWidth, boxHeight, 8, 8, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(SECONDARY_TEXT);
  doc.text('Informations client', margin + 12, 183);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(TEXT_COLOR);
  doc.setFontSize(11);
  doc.text(quote.clientName, margin + 12, 198);

  doc.setFont('helvetica', 'normal');
  const clientLines = [
    quote.clientEmail || 'Email non renseigné',
    quote.clientId || 'Référence client non précisée',
  ].filter(Boolean);

  if (quote.clientEmail) doc.text(quote.clientEmail, margin + 12, 214);
  if (quote.clientId) doc.text(`Référence : ${quote.clientId}`, margin + 12, 230);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SECONDARY_TEXT);
  doc.text('Informations du devis', margin + boxWidth + 20 + 12, 183);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_COLOR);
  const quoteStatus = quote.status || 'DRAFT';

  doc.text(`N° ${quote.quoteNumber}`, margin + boxWidth + 20 + 12, 198);
  doc.text(`Créé le ${formatDate(quote.issuedAt)}`, margin + boxWidth + 20 + 12, 214);
  doc.text(`Statut : ${quoteStatus}`, margin + boxWidth + 20 + 12, 230);
  if (quote.validUntil) {
    doc.text(`Date limite : ${formatDate(quote.validUntil)}`, margin + boxWidth + 20 + 12, 246);
  }
}

function drawServicesTable(doc: jsPDF, quote: DashboardQuote) {
  const margin = 40;
  const startY = 290;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const columnWidths = [contentWidth * 0.38, contentWidth * 0.18, contentWidth * 0.2, contentWidth * 0.24];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);
  const headers = ['Prestation', 'Qté', 'Prix unitaire', 'Total'];
  let x = margin;
  headers.forEach((header, index) => {
    doc.text(header, x + 2, startY);
    x += columnWidths[index];
  });

  doc.setDrawColor('#E5E7EB');
  doc.setLineWidth(1);
  doc.line(margin, startY + 6, pageWidth - margin, startY + 6);

  doc.setFont('helvetica', 'normal');
  let currentY = startY + 18;

  const rows = quote.lineItems?.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.quantity * item.unitPrice,
  })) || [];

  rows.forEach((row) => {
    const rowHeight = doc.getTextDimensions(row.description, { maxWidth: columnWidths[0] - 8 }).h + 10;
    if (currentY + rowHeight > doc.internal.pageSize.getHeight() - 140) {
      doc.addPage();
      currentY = 60;
    }

    let cellX = margin;
    doc.text(row.description, cellX + 2, currentY);
    cellX += columnWidths[0];
    doc.text(String(row.quantity), cellX + columnWidths[1] - 4, currentY, { align: 'right' });
    cellX += columnWidths[1];
    doc.text(formatCurrency(row.unitPrice, quote.currency), cellX + columnWidths[2] - 4, currentY, { align: 'right' });
    cellX += columnWidths[2];
    doc.text(formatCurrency(row.subtotal, quote.currency), cellX + columnWidths[3] - 4, currentY, { align: 'right' });

    doc.setDrawColor('#F3F4F6');
    doc.line(margin, currentY + rowHeight - 6, pageWidth - margin, currentY + rowHeight - 6);
    currentY += rowHeight;
  });

  const subTotal = rows.reduce((sum, row) => sum + row.subtotal, 0);
  const taxAmount = Math.max(0, quote.total - subTotal);

  currentY += 12;
  doc.setDrawColor('#E5E7EB');
  doc.line(pageWidth - margin - columnWidths[2] - columnWidths[3] - 8, currentY, pageWidth - margin, currentY);
  currentY += 18;

  doc.setFont('helvetica', 'normal');
  doc.text('Sous-total', pageWidth - margin - columnWidths[3] - 4, currentY, { align: 'right' });
  doc.text(formatCurrency(subTotal, quote.currency), pageWidth - margin, currentY, { align: 'right' });
  currentY += 16;

  if (taxAmount > 0) {
    doc.text('Taxes', pageWidth - margin - columnWidths[3] - 4, currentY, { align: 'right' });
    doc.text(formatCurrency(taxAmount, quote.currency), pageWidth - margin, currentY, { align: 'right' });
    currentY += 16;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(TEXT_COLOR);
  doc.text('Total', pageWidth - margin - columnWidths[3] - 4, currentY, { align: 'right' });
  doc.text(formatCurrency(quote.total, quote.currency), pageWidth - margin, currentY, { align: 'right' });
}

function drawFooter(doc: jsPDF, quote: DashboardQuote) {
  const margin = 40;
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = pageHeight - 140;

  doc.setDrawColor('#E5E7EB');
  doc.line(margin, footerY, doc.internal.pageSize.getWidth() - margin, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(TEXT_COLOR);
  doc.text('Conditions et mentions', margin, footerY + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const notes = quote.notes || 'Merci de régler selon les conditions de paiement indiquées. Ce devis est valable 30 jours à compter de sa date d’émission.';
  doc.text(notes, margin, footerY + 40, { maxWidth: doc.internal.pageSize.getWidth() - margin * 2 });

  doc.text('Signature:', margin, footerY + 90);
  doc.line(margin + 60, footerY + 94, margin + 280, footerY + 94);
}

export async function createQuotePdf(quote: DashboardQuote): Promise<Blob> {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const logoDataUrl = await loadImageDataUrl('/logo_myms.svg');

  doc.setFillColor('#ffffff');
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

  drawHeader(doc, logoDataUrl);
  drawInfoBoxes(doc, quote);
  drawServicesTable(doc, quote);
  drawFooter(doc, quote);

  return doc.output('blob');
}

export async function downloadQuotePdf(quote: DashboardQuote) {
  const blob = await createQuotePdf(quote);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${quote.quoteNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return blob;
}

export async function previewQuotePdf(quote: DashboardQuote) {
  const blob = await createQuotePdf(quote);
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  return url;
}
