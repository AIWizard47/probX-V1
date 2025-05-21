import express from 'express';
import { deletePredictionById, getAllPridiction } from '../../controllers/user_controller/prediction_controller.js';

const router = express.Router();

router.get('/', getAllPridiction);
router.delete('/:id' , deletePredictionById)

export default router;