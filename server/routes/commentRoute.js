import express from 'express';
import { addComment, commentCount, deleteComment, getAllComments, getComments } from '../controllers/commentController.js';
import { authenticate } from '../middleware/authenticate.js';

const CommentRoute = express.Router();

CommentRoute.post('/add', authenticate, addComment);
CommentRoute.get('/get/:eventid', getComments);
CommentRoute.get('/get-count/:eventid', commentCount);
CommentRoute.get('/get-all-comment', authenticate, getAllComments);
CommentRoute.delete('/delete/:commentid', authenticate, deleteComment);


export default CommentRoute;