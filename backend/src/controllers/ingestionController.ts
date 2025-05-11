import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Tesseract from 'tesseract.js';
import path from 'path';
import { convertPdfToImage, extractAmount, extractDate, extractVendor } from '../utils/utils';

const prisma = new PrismaClient();

export const ingestDocuments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const unprocessedDocs = await prisma.document.findMany({
      where: {
        id: {
          notIn: (await prisma.ingestion.findMany({ select: { documentId: true } })).map(i => i.documentId),
        },
      },
    });

    const results = [];

    for (const document of unprocessedDocs) {
      const filePath = path.join(__dirname, '../../uploads/', document.file);

      const ingestion = await prisma.ingestion.create({
        data: {
          documentId: document.id,
          status: 'in_progress',
        },
      });

      try {
        const imagePath = await convertPdfToImage(filePath);
        const ocrResult = await Tesseract.recognize(imagePath, 'eng');
        const text = ocrResult.data.text;

        const vendor = extractVendor(text);
        const invoiceDate = extractDate(text);
        const amount = extractAmount(text);

        if (!vendor || !invoiceDate || amount === null) {
          await prisma.ingestion.update({
            where: { id: ingestion.id },
            data: {
              status: 'failed',
              error: 'Missing one or more required fields: vendor, invoiceDate, or amount.',
            },
          });
          results.push({ documentId: document.id, status: 'failed', error: 'Missing fields' });
          continue;
        }

        await prisma.ingestion.update({
          where: { id: ingestion.id },
          data: {
            vendor,
            invoiceDate,
            amount,
            status: 'completed',
          },
        });

        results.push({ documentId: document.id, status: 'completed' });
      } catch (err: any) {
        console.error(err);
        await prisma.ingestion.update({
          where: { id: ingestion.id },
          data: {
            status: 'failed',
            error: err.message,
          },
        });
        results.push({ documentId: document.id, status: 'failed', error: err.message });
      }
    }

    res.json({ message: 'Ingestion batch complete', results });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Ingestion process failed', details: err.message });
  }
};

export const getAllIngestions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const ingestions = await prisma.ingestion.findMany();

    const data = await Promise.all(
      ingestions.map(async (i) => {
        const doc = await prisma.document.findUnique({ where: { id: i.documentId } });
        return {
          ...i,
          file: doc?.file || 'Unknown',
        };
      })
    );

    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ingestions', details: err.message });
  }
};
