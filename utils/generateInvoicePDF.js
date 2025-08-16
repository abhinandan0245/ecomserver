const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const generateInvoiceHTML = require('./invoiceTemplate');

async function generateInvoicePDF(invoiceData) {
  const browser = await puppeteer.launch({
    headless: 'new', // modern Puppeteer syntax
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const htmlContent = generateInvoiceHTML(invoiceData);
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const invoiceDir = path.join(__dirname, '../invoices');
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

  const pdfPath = path.join(invoiceDir, `${invoiceData.invoiceNumber}.pdf`);
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
  });

  await browser.close();
  return pdfPath;
}

module.exports = generateInvoicePDF;
