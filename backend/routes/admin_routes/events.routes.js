import express from 'express';
import { addEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from '../../controllers/admin_controller/events_controller.js';

const router = express.Router();

router.post('/', addEvent);
router.get('/', getAllEvents);
router.put('/:id', updateEvent);
router.get('/:id', getEventById);
router.delete('/:id', deleteEvent);

export default router;