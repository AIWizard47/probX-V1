import express from 'express';
import { addTrade, cancelOrder, getOpenOrdersOfUser, getTradeByEventId, getTradeByUserId } from '../../controllers/user_controller/trade_controller.js';
import UserMiddleware from '../../middleware/user_middleware.js';

const router = express.Router();


router.get("/", UserMiddleware, getTradeByUserId);

router.post("/", UserMiddleware, addTrade);

router.get('/open', UserMiddleware, getOpenOrdersOfUser)

router.get("/event/:eventId", getTradeByEventId);

router.post('/cancel/:orderId', UserMiddleware, cancelOrder)




export default router;