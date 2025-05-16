import express from 'express';
import { addEvent, deleteEvent, getAllEvents, getEventById, getEventsByCategory, searchEvents, updateEvent } from '../../controllers/admin_controller/events_controller.js';
import AdminMiddleware from '../../middleware/admin_middleware.js';

const router = express.Router();

router.post('/', AdminMiddleware, addEvent);
router.get('/category/All', AdminMiddleware, getAllEvents);
router.put('/:id', AdminMiddleware, updateEvent);
router.get('/:id', AdminMiddleware, getEventById);
router.delete('/:id', AdminMiddleware, deleteEvent);
router.get("/category/:category", AdminMiddleware, getEventsByCategory);
router.get('/search/:query', AdminMiddleware, searchEvents)

export default router;