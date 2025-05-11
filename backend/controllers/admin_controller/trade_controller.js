import { prisma } from '../../db/db.js';

export const getAllTrades = async (req, res) => {
    try {
        const trade = await prisma.trade.findMany();
        return res.status(200).json({ tardes: trade })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getTradeByEventCategoryId = async (req, res) => {
    const category = req.params.category;
    try {

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}