import express from 'express'
import { GoogleLogin, Login, Logout, Register, resetPassword, sendResetOtp, verifyEmail } from '../controllers/authController.js'

const AuthRoute = express.Router()

AuthRoute.post('/register', Register);
AuthRoute.post('/login', Login);
AuthRoute.post('/google-login', GoogleLogin);
AuthRoute.post('/verify-email', verifyEmail);
AuthRoute.post('/send-reset-otp', sendResetOtp);
AuthRoute.post('/reset-password', resetPassword);
AuthRoute.get('/logout', Logout);

export default AuthRoute;
