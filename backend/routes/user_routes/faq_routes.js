import express from 'express';
import { getActivefaq } from '../../controllers/user_controller/faq_controller.js';

const router = express.Router();

router.get('/all', getActivefaq);

export default router;