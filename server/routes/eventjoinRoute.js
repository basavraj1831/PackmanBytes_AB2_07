import express from 'express';
import { checkPaymentStatus, getAttendeeCount, paymentRazorpay, verifyRazorpay } from '../controllers/eventjoinController.js';
import { authenticate } from '../middleware/authenticate.js';


const EventJoinRoute = express.Router();


EventJoinRoute.get('/get-attendees/:eventid/:userid?', getAttendeeCount);
EventJoinRoute.post('/payment-razorpay', authenticate, paymentRazorpay);
EventJoinRoute.post('/verify-razorpay', verifyRazorpay);
EventJoinRoute.get('/transaction-check/:eventid/:userid', checkPaymentStatus);


export default EventJoinRoute;