import express from 'express';
import { getAllEvents, getEventById, getEventsByCategory } from '../../controllers/user_controller/events_controller.js';

const router = express.Router();

router.get('/', getAllEvents);

router.get("/:id", getEventById);   //id

router.get("/category/:category", getEventsByCategory);  // category

export default router;