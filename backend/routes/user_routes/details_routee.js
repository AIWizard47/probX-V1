import express from 'express';
import { getUserNameAndBalance } from '../../controllers/user_controller/detail_controller.js';
const router = express.Router();

router.get('/', getUserNameAndBalance);


export default router;