import express from 'express';
import { addReceiver, getAllReceivers } from '../controllers/receiverController.js';

const router = express.Router();

router.post('/add-receiver', addReceiver);
router.get('/', getAllReceivers);

export default router;