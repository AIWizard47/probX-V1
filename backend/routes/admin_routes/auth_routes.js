// routes/user_routes/auth_routes.js
import express from 'express';
import { signup, login } from '../../controllers/admin_controller/auth_controller.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;
