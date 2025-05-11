import express from 'express';
import { getAllTrades, getTradeByCategory, searchTrade } from '../../controllers/admin_controller/trade_controller.js';

const router = express.Router();

router.get('/', getAllTrades);

router.get("/category/:category", getTradeByCategory);

router.get("/search", searchTrade);

export default router;