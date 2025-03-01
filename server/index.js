import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import DonorRoute from './routes/donorRoute.js';
import receiverRoutes from './routes/receiver.js';
import AuthRoute from './routes/authRoute.js';

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
app.use('/api/receiver', receiverRoutes);
app.use('/api/donor', DonorRoute);


mongoose.connect(process.env.MONGODB_CONN, {dbName: 'blood-donation'}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Database connection failed',err);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});

app.use((err, req, res, next ) => {
   const statusCode = err.statusCode || 500;
   const message = err.message || 'Internal server error.';
   res.status(statusCode).json({
    success: false,
    statusCode,
    message
   });
});
