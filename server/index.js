import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import quizRoutes from './routes/quiz.routes.js'

dotenv.config();      // Load environment variables
connectDB();          // Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json()); // Parse incoming JSON

app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Mount authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
