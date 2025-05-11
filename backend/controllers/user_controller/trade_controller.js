import { prisma } from '../../db/db.js'; // Make sure the path is correct

//create tarde
export const addTrade = async (req, res) => {
    const { price, quantity, orderType, tradeType, eventId } = req.body;
    if (!price || !quantity || !orderType || !tradeType || !eventId) {
        return res.status(400).json({ message: "All field required" });
    }
    try {
        const userId = req.user;
        const event = await prisma.event.findFirst({ where: { id: eventId } });
        if (!event) {
            return res.status(404).json({ message: "event not found" });
        }

        const trade = await prisma.trade.create({
            data: {
                tradeTitle: event.eventTitle,
                price,
                quantity,
                tradeLogo: event.eventLogo,
                orderType,
                tradeType,
                userId,
                eventId
            }
        })

        return res.status(200).json({ message: "trade sucess", trade });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export const getTradeByUserId = async (req, res) => {
    const UserId = req.user;
    try {
        const trade = await prisma.trade.findMany({ where: { userId: UserId } });
        if (!trade) {
            return res.status(400).json({ meassage: "You have not placed tarde yet" });
        }

        return res.status(200).json({ tardes: trade })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}