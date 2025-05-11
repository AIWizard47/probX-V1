import express from 'express';
import { addTrade, getTradeByEventId, getTradeByUserId } from '../../controllers/user_controller/trade_controller.js';
import UserMiddleware from '../../middleware/user_middleware.js';

const router = express.Router();


router.get("/", UserMiddleware, getTradeByUserId);

router.post("/", UserMiddleware, addTrade);

router.get("/event/:eventId", getTradeByEventId);




export default router;