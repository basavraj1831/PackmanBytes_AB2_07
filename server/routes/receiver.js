import express from 'express';
import { acceptRequest, addReceiver, getAllPriorityReceivers, getAllReceivers, getLatestRequestByUser, sendEmailToUsers } from '../controllers/receiverController.js';

const router = express.Router();

router.post('/add-receiver', addReceiver);
router.get('/', getAllReceivers);
router.get('/latest-request-by-user/:email', getLatestRequestByUser);
router.get('/accept-request', acceptRequest);
router.post('/getAllPriorityReceivers', getAllPriorityReceivers);
router.post('/sos', sendEmailToUsers)

export default router;