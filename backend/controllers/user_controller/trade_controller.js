import { prisma } from '../../db/db.js'; // Make sure the path is correct

//create tarde
export const addTrade = async (req, res) => {
    const { price, quantity, orderType, tradeType, eventId } = req.body;

    if (!price || !quantity || !orderType || !tradeType || !eventId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const userId = req.user;
        const event = await prisma.event.findFirst({ where: { id: eventId } });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const currentTime = new Date();
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);


        if (currentTime > startTime && currentTime < endTime) {
            const trade = await prisma.trade.create({
                data: {
                    category: event.categary,
                    tradeTitle: event.eventTitle,
                    price,
                    quantity,
                    tradeLogo: event.eventLogo,
                    orderType,
                    tradeType,
                    userId,
                    eventId
                }
            });

            return res.status(200).json({ message: "Trade success", trade });
        } else if (currentTime < startTime) {
            return res.status(403).json({ message: "Trade window is no started yet" });
        }
        else {
            return res.status(403).json({ message: "Trade window is closed" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


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

export const getTradeByEventId = async (req, res) => {
    const eventId = parseInt(req.params.eventId);

    if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
    }

    try {
        const trades = await prisma.trade.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' }, // Optional: sort by newest first
        });

        if (trades.length === 0) {
            return res.status(404).json({ message: "No trades found for this event" });
        }

        return res.status(200).json(trades);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


