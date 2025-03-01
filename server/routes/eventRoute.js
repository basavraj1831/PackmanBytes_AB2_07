import express from 'express'

import upload from '../config/multer.js';
import { authenticate } from '../middleware/authenticate.js';
import { addEvent, deleteEvent, editEvent, getAllEvents, getEvent, getEventByCategoryAndDate, getRelatedEvent, getTodayEvents, search, showAllEvent, updateEvent } from '../controllers/eventController.js';
import { guestAuthenticate } from '../middleware/guestAuthenticate.js';

const EventRoute = express.Router()

EventRoute.post('/add', authenticate, upload.single('file'), addEvent );
EventRoute.get('/edit/:eventid', authenticate, editEvent);
EventRoute.put('/update/:eventid', authenticate, upload.single('file'), updateEvent);
EventRoute.delete('/delete/:eventid',authenticate, deleteEvent);
EventRoute.get('/get-all', authenticate, showAllEvent);

EventRoute.get('/get-event/:slug', guestAuthenticate, getEvent);
EventRoute.get('/get-related-event/:category/:event', guestAuthenticate, getRelatedEvent);
EventRoute.get('/get-event-by-category-date', getEventByCategoryAndDate);
EventRoute.get('/search', search);
EventRoute.get('/today-events', getTodayEvents);

EventRoute.get('/events', getAllEvents);


export default EventRoute;