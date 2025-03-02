import express from 'express';
import { acceptLink, addReceiver, getAllReceivers, getLatestreceiver,  } from '../controllers/receiverController.js';

const router = express.Router();

router.post('/add-receiver', addReceiver);
router.get('/', getAllReceivers);
router.get('/get-latest-request/:email', getLatestreceiver);
router.post('/accept/:receiverId/:donorId', acceptLink);

export default router;