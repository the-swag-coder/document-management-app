import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import ingestionRoutes from './routes/ingestion';
import documentRoutes from './routes/documents';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/documents', documentRoutes);

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/ingestion', ingestionRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
