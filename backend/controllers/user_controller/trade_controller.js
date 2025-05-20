import { prisma } from '../../db/db.js'; // Make sure the path is correct
import { PredictPrice } from '../../utils/pridict_price.js';


// API to handle placing a trade (BUY/SELL) with YES/NO order types for a specific event
export const addTrade = async (req, res) => {
    const { price, quantity, orderType, tradeType, eventId } = req.body;

    // Validate required fields
    if (!price || !quantity || !orderType || !tradeType || !eventId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate enum values
    const validOrderTypes = ["BUY", "SELL"];
    const validTradeTypes = ["YES", "NO"];
    if (!validOrderTypes.includes(orderType) || !validTradeTypes.includes(tradeType)) {
        return res.status(400).json({ message: "Invalid tradeType or orderType" });
    }

    try {
        const userId = req.user;

        // Get event details
        const event = await prisma.event.findFirst({ where: { id: eventId } });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const currentTime = new Date();
        const startTime = new Date(event.startTime);
        const endTime = new Date(event.endTime);

        // Get user's balance
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if within trading window
        if (currentTime > startTime && currentTime < endTime) {

            if (orderType === "BUY") {
                // BUY order: Check balance
                const totalCost = price * quantity;
                if (user.balance < totalCost) {
                    return res.status(400).json({ message: "Insufficient balance" });
                }

                // Create BUY trade
                const trade = await prisma.trade.create({
                    data: {
                        category: event.categary,
                        tradeTitle: event.eventTitle,
                        price,
                        quantity,
                        tradeLogo: event.eventLogo,
                        orderType,   // BUY
                        tradeType,   // YES or NO
                        userId,
                        eventId
                    }
                });

                // add in prediction table
                await prisma.prediction.create({
                    data: {
                        price,
                        quantity,
                        orderType,
                        prediction: tradeType,
                        eventId,
                        userId,
                        tradeId: trade.id
                    }
                })
                // Deduct balance
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        balance: user.balance - totalCost
                    }
                });

                // Predict updated price
                const prices = await prisma.trade.findMany({
                    where: { eventId },
                    orderBy: { createdAt: 'desc' },
                });

                const result = PredictPrice(prices);
                const up = await prisma.event.update({
                    where: {
                        id: eventId, // ID of the event you want to update
                    },
                    data: {
                        yesPrice: result.YesPrice, // new value for yesPrice
                        noPrice: result.NoPrice,   // new value for noPrice
                    },
                });

                return res.status(200).json({ message: "Trade success", trade, result });

            } else if (orderType === "SELL") {

                // Fetch total BUY and SELL quantity for this tradeType
                const [buyTrades, sellTrades] = await Promise.all([
                    prisma.trade.findMany({
                        where: {
                            userId,
                            eventId,
                            tradeType,
                            orderType: "BUY"
                        }
                    }),
                    prisma.trade.findMany({
                        where: {
                            userId,
                            eventId,
                            tradeType,
                            orderType: "SELL"
                        }
                    })
                ]);

                const totalBuy = buyTrades.reduce((sum, t) => sum + t.quantity, 0);
                const totalSell = sellTrades.reduce((sum, t) => sum + t.quantity, 0);
                const availableQuantity = totalBuy - totalSell;


                if (availableQuantity < quantity) {
                    return res.status(400).json({
                        message: `You don't have enough ${tradeType} quantity to SELL`
                    });
                }

                // Create SELL trade
                const trade = await prisma.trade.create({
                    data: {
                        category: event.categary,
                        tradeTitle: event.eventTitle,
                        price,
                        quantity,
                        tradeLogo: event.eventLogo,
                        orderType,   // SELL
                        tradeType,   // YES or NO
                        userId,
                        eventId
                    }
                });

                // delete from prediction table
                await prisma.prediction.delete({
                    where: {
                        tradeId: trade.id
                    }
                })

                // Credit balance
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        balance: user.balance + price * quantity
                    }
                });

                // Predict updated price
                const prices = await prisma.trade.findMany({
                    where: { eventId },
                    orderBy: { createdAt: 'desc' },
                });

                const result = PredictPrice(prices);
                //update yes price and no price
                const up = await prisma.event.update({
                    where: {
                        id: eventId, // ID of the event you want to update
                    },
                    data: {
                        yesPrice: result.YesPrice, // new value for yesPrice
                        noPrice: result.NoPrice,   // new value for noPrice
                    },
                });

                return res.status(200).json({ message: "Trade success", trade, result });
            }

        } else if (currentTime < startTime) {
            return res.status(403).json({ message: "Trade window is not started yet" });
        } else {
            return res.status(403).json({ message: "Trade window is closed" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
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


