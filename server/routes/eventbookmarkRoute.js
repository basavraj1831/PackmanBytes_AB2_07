import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { doMark, getAllBookmark, getMarked } from '../controllers/eventbookmarkController.js';

const EventBookmarkRoute = express.Router();

EventBookmarkRoute.post('/do-mark', authenticate, doMark);
EventBookmarkRoute.get('/get-marked/:eventid/:userid?', getMarked);
EventBookmarkRoute.get('/get-marks', authenticate, getAllBookmark);


export default EventBookmarkRoute;