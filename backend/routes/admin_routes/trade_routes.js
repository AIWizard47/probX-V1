import express from 'express';
import { getAllTrades } from '../../controllers/admin_controller/trade_controller.js';

const router = express.Router();

router.get('/', getAllTrades);

// router.get("/category/:category", getTradeByEventCategoryId);

// router.get("/search", getTradeByEventname);

export default router;