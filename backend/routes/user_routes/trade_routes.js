import express from 'express';
import { addTrade, getTradeByUserId } from '../../controllers/user_controller/trade_controller.js';
import UserMiddleware from '../../middleware/user_middleware.js';

const router = express.Router();


router.get("/", UserMiddleware, getTradeByUserId);

router.post("/", UserMiddleware, addTrade);



export default router;