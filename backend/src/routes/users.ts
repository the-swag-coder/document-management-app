import express, { RequestHandler } from 'express';
import { createUser, updateUser, deleteUser, getUsers, getUserById } from '../controllers/userController';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticate as RequestHandler, authorizeAdmin as RequestHandler, getUsers as RequestHandler);
router.post('/', authenticate as RequestHandler, authorizeAdmin as RequestHandler, createUser as RequestHandler);
router.get('/:id', authenticate as RequestHandler, authorizeAdmin as RequestHandler, getUserById as RequestHandler);
router.put('/:id', authenticate as RequestHandler, authorizeAdmin as RequestHandler, updateUser as RequestHandler);
router.delete('/:id', authenticate as RequestHandler, authorizeAdmin as RequestHandler, deleteUser as RequestHandler);

export default router;
