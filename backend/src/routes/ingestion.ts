import express, { RequestHandler } from 'express';
import { getAllIngestions, ingestDocuments } from '../controllers/ingestionController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('', authenticate as RequestHandler, getAllIngestions as RequestHandler);
router.post('', authenticate as RequestHandler, ingestDocuments as RequestHandler);

export default router;
