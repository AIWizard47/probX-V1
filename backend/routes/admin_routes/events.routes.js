import express from 'express';

const router = express.Router();

router.post('/',addEvent);
router.get('/',getEvents);
router.put('/:id',updateEvent);
router.get('/:id',getSingleEvent);
router.delete('/:id',deleteEvent);

export default router;