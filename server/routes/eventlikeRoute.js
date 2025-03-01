import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { doLike, likeCount } from '../controllers/eventlikeController.js';

const EventLikeRoute = express.Router();

EventLikeRoute.post('/do-like', authenticate, doLike);
EventLikeRoute.get('/get-like/:eventid/:userid?', likeCount);


export default EventLikeRoute;