import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import DonorRoute from './routes/donorRoute.js';
import receiverRoutes from './routes/receiver.js';
import AuthRoute from './routes/authRoute.js';
import chatRoute from './routes/chatRoute.js';
import UserRoute from './routes/userRoute.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use('/api/auth', AuthRoute);
app.use('/api/user', UserRoute)
app.use('/api/receiver', receiverRoutes);
app.use('/api/donor', DonorRoute);
app.use('/api/chat', chatRoute);

mongoose.connect(process.env.MONGODB_CONN, {
  dbName: 'blood-donation',
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal server error.',
  });
});
