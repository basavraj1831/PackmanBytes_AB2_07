import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.access_token
        if (!token) {
            return next(403, 'Unathorized')
        }
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodeToken._id).select("name role");

        if (user.role !== 'guest' ) {
            req.user = user
            next()
        } else {
            return next(403, 'Unathorized')
        }
        
    } catch (error) {
        next(500, error.message)
    }
}