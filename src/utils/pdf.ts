import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate } from '../data/mockData';
import type { DashboardQuote } from '../stores/dashboardStore';

export async function createQuotePdf(quote: DashboardQuote): Promise<Blob> {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - margin * 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Devis professionnel', margin, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`N° ${quote.quoteNumber}`, margin, 90);
  doc.text(`Client : ${quote.clientName}`, margin, 105);
  if (quote.clientEmail) {
    doc.text(`Email : ${quote.clientEmail}`, margin, 120);
  }
  doc.text(`Émis le : ${formatDate(quote.issuedAt)}`, margin, 135);
  doc.text(`Valide jusqu'au : ${formatDate(quote.validUntil)}`, margin, 150);

  doc.setDrawColor(183);
  doc.setLineWidth(1);
  doc.line(margin, 170, pageWidth - margin, 170);

  const tableTop = 190;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const columns = ['Désignation', 'Qté', 'Prix unitaire', 'Total'];
  const columnX = [margin, margin + 260, margin + 400, margin + 500];
  columns.forEach((title, index) => doc.text(title, columnX[index], tableTop));

  doc.setFont('helvetica', 'normal');
  let currentY = tableTop + 20;

  const addLineItem = (item: { description: string; quantity: number; unitPrice: number }) => {
    doc.text(item.description, columnX[0], currentY, { maxWidth: 240 });
    doc.text(String(item.quantity), columnX[1], currentY, { align: 'right' });
    doc.text(formatCurrency(item.unitPrice, quote.currency), columnX[2], currentY, { align: 'right' });
    doc.text(formatCurrency(item.quantity * item.unitPrice, quote.currency), columnX[3], currentY, { align: 'right' });
    currentY += 20;
  };

  quote.lineItems?.forEach((item) => {
    if (currentY > 740) {
      doc.addPage();
      currentY = margin;
    }
    addLineItem(item);
  });

  if (currentY > 700) {
    doc.addPage();
    currentY = margin;
  }

  doc.setDrawColor(183);
  doc.line(margin, currentY + 10, pageWidth - margin, currentY + 10);
  currentY += 30;

  doc.setFont('helvetica', 'bold');
  doc.text('Total TTC', columnX[2], currentY, { align: 'right' });
  doc.text(formatCurrency(quote.total, quote.currency), columnX[3], currentY, { align: 'right' });
  currentY += 30;

  doc.setFont('helvetica', 'bold');
  doc.text('Notes et conditions', margin, currentY);
  currentY += 16;
  doc.setFont('helvetica', 'normal');
  doc.text(quote.notes || 'Aucune condition spécifique n’a été ajoutée.', margin, currentY, { maxWidth: usableWidth });

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
  const blob = await downloadQuotePdf(quote);
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  return url;
}
