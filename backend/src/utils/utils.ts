import path from 'path';
import pdf from 'pdf-poppler';
import fs from 'fs';
import os from 'os';

export async function convertPdfToImage(pdfPath: string): Promise<string> {
  const outputDir = path.join(os.tmpdir(), 'pdf-images');
  fs.mkdirSync(outputDir, { recursive: true });

  const opts = {
    format: 'png',
    out_dir: outputDir,
    out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
    page: 1, // Only convert the first page (you can loop if needed)
  };

  await pdf.convert(pdfPath, opts);
  return path.join(outputDir, `${opts.out_prefix}-1.png`);
}

export function extractVendor(text: string): string {
  const vendorLine = text.split('\n').find(line => /vendor/i.test(line));
  return vendorLine?.split(':')[1]?.trim() || 'Unknown Vendor';
}

export function extractDate(text: string): Date | null {
  const match = text.match(/\b(20\d{2})[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])\b/);
  return match ? new Date(match[0]) : null;
}

export function extractAmount(text: string): number | null {
  const amountPatterns = [
    /\$\s?([\d,]+\.\d{2})/,          // Matches "$1,234.56"
    /\$\s?([\d,]+)/,                 // Matches "$1,200"
    /amount\s*[:\-]?\s*\$?([\d,]+\.\d{2})/i,
    /amount\s*[:\-]?\s*\$?([\d,]+)/i
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
  }

  return null;
}