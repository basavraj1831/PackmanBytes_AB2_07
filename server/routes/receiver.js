import express from 'express';
import { addReceiver } from '../controllers/receiverController.js';

const router = express.Router();

router.post('/', addReceiver);

export default router;