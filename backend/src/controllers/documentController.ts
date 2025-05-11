import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;
  const file = req.file;

  if (!file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const doc = await prisma.document.create({
    data: { file: file.originalname, userId },
  });

  res.json({
    ...doc,
    url: `${req.protocol}://${req.get('host')}/uploads/${file.originalname}`,
  });
};

export const getAllDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const docs = await prisma.document.findMany();
    const docsWithUrl = docs.map(doc => ({
      ...doc,
      url: `${req.protocol}://${req.get('host')}/uploads/${doc.file}`,
    }));
    res.json(docsWithUrl);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const doc = await prisma.document.findUnique({ where: { id: Number(id) } });
    if (!doc) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }
    res.json({
      ...doc,
      url: `${req.protocol}://${req.get('host')}/uploads/${doc.file}`,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const doc = await prisma.document.findUnique({ where: { id: Number(id) } });

  if (!doc) {
    res.status(404).json({ message: 'Document not found' });
    return;
  }

  fs.unlinkSync(`uploads/${doc.file}`);
  await prisma.document.delete({ where: { id: Number(id) } });

  res.json({ message: 'Document deleted' });
};
