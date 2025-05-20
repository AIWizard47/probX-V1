import express from 'express';
import { getAllPridiction } from '../../controllers/user_controller/prediction_controller.js';

const router = express.Router();

router.get('/', getAllPridiction);

export default router;