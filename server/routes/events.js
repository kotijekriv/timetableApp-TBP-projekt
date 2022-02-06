import express from 'express';
import { createEvent, updateEvent, deleteEvent, getEvents, getEventsByTime, getEventTypes, getSubjects, getEvent } from '../controllers/events.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/create', auth, createEvent);
router.post('/update', auth, updateEvent);
router.post('/delete', auth, deleteEvent);
router.post('/all', auth, getEvents);
router.post('/byTime', auth, getEventsByTime);
router.post('/getOne', auth, getEvent);
router.post('/types', getEventTypes);
router.post('/subjects', getSubjects);

export default router;