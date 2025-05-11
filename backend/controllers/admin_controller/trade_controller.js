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

export const getTradeByCategory = async (req, res) => {
    const category = req.params.category;
    try {
        const trade = await prisma.trade.findMany({
            where: {
                category: category
            }
        })
        return res.status(200).json({ trades: trade });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const searchTrade = async (req, res) => {
    const { tradeTitle } = req.body; // expecting a key named tradeTitle
    try {
        const trades = await prisma.trade.findMany({
            where: {
                tradeTitle: {
                    contains: tradeTitle,
                    mode: 'insensitive', // makes it case-insensitive
                },
            },
        });

        return res.status(200).json(trades);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const getTradeByorderType = async (req, res) => {

}

export const getTradeBytradeType = async (req, res) => {

}


