import express, { RequestHandler } from 'express';
import multer from 'multer';
import { uploadDocument, deleteDocument, getAllDocuments, getDocumentById } from '../controllers/documentController';
import { authenticate } from '../middleware/authMiddleware';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get('/', authenticate as RequestHandler, getAllDocuments as RequestHandler);
router.post('/', authenticate as RequestHandler, upload.single('file'), uploadDocument as RequestHandler);
router.get('/:id', authenticate as RequestHandler, getDocumentById as RequestHandler);
router.delete('/:id', authenticate as RequestHandler, deleteDocument as RequestHandler);

export default router;
