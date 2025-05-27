import express from 'express';
import { getOrderbookOfNO, getOrderbookOfYES, getOrderBookQuantityBUY, getOrderBookQuantitySELL, getOrderbookSummery, getProbability } from '../../controllers/user_controller/orderbook_controller.js';
const router = express.Router();

router.get('/no/:eventId', getOrderbookOfNO)
router.get('/probability/:eventId', getProbability)
router.get('/yes/:eventId', getOrderbookOfYES)
router.get('/:eventId/summary', getOrderbookSummery)
router.get("/:eventId/quantitysell", getOrderBookQuantitySELL)
router.get("/:eventId/quantitybuy", getOrderBookQuantityBUY)

export default router;