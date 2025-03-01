import express from 'express';
import { addReceiver, getAllReceivers, getLatestRequest } from '../controllers/receiverController.js';

const router = express.Router();

router.post('/add-receiver', addReceiver);
router.get('/', getAllReceivers);
router.get('/get-latest-request/:email', getLatestRequest);

export default router;