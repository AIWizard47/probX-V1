import express from 'express';

const router = express.Router();

router.get('/',allEvents);

router.get("/:id",getEventById);   //id 

router.get("/category",getEventByCategory);  // category

export default router;