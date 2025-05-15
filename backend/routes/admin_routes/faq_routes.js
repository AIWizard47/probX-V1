import express from 'express';
import {
    addFaq,
    updateFaq,
    deleteFaq,
    getAllFaq,
    toggleIsActiveFaq,
} from '../../controllers/admin_controller/faq_controller.js'; // adjust path if needed
import AdminMiddleware from '../../middleware/admin_middleware.js';

const router = express.Router();

// Routes
router.post('/add', AdminMiddleware, addFaq);
router.put('/update/:id', AdminMiddleware, updateFaq);
router.delete('/delete/:id', AdminMiddleware, deleteFaq);
router.get('/all', AdminMiddleware, getAllFaq);
router.patch('/toggle/:id', AdminMiddleware, toggleIsActiveFaq);

export default router;
