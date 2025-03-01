import express from 'express'
import { deleteUser, getAllUsers, getUser, updateUser } from '../controllers/userController.js';
import upload from '../config/multer.js';
import { adminAuthenticate } from '../middleware/adminAuthenticate.js';
import { authenticate } from '../middleware/authenticate.js';

const UserRoute = express.Router();

UserRoute.get('/get-user/:userid', authenticate, getUser);
UserRoute.put('/update-user/:userid', authenticate, upload.single('file'), updateUser);
UserRoute.get('/get-all-user', adminAuthenticate, getAllUsers);
UserRoute.delete('/delete/:id', adminAuthenticate, deleteUser);

export default UserRoute;
