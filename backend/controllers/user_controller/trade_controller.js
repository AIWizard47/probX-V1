import { prisma } from '../../db/db.js'; // Make sure the path is correct

// import { PredictPrice } from '../../utils/pridict_price.js';
import { matchOrder } from "../../utils/matchOrder.js";

import { updatePredictedPrices } from '../../utils/updatePredictedPrices.js';


// API to handle placing a trade (BUY/SELL) with YES/NO order types for a specific event
// export const addTrade = async (req, res) => {
//     const { price, quantity, orderType, tradeType, eventId } = req.body;

//     // Validate required fields
//     if (!price || !quantity || !orderType || !tradeType || !eventId) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     // Validate enum values
//     const validOrderTypes = ["BUY", "SELL"];
//     const validTradeTypes = ["YES", "NO"];
//     if (!validOrderTypes.includes(orderType) || !validTradeTypes.includes(tradeType)) {
//         return res.status(400).json({ message: "Invalid tradeType or orderType" });
//     }

//     try {
//         const userId = req.user;

//         // Get event details
//         const event = await prisma.event.findFirst({ where: { id: eventId } });
//         if (!event) {
//             return res.status(404).json({ message: "Event not found" });
//         }

//         const currentTime = new Date();
//         const startTime = new Date(event.startTime);
//         const endTime = new Date(event.endTime);

//         // Get user's balance
//         const user = await prisma.user.findUnique({
//             where: { id: userId },
//             select: { balance: true }
//         });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Check if within trading window
//         if (currentTime > startTime && currentTime < endTime) {

//             if (orderType === "BUY") {
//                 // BUY order: Check balance
//                 const totalCost = price * quantity;
//                 if (user.balance < totalCost) {
//                     return res.status(400).json({ message: "Insufficient balance" });
//                 }

//                 if (tradeType === "YES") {
//                     await prisma.event.update({
//                         where: { id: eventId },
//                         data: {
//                             yesLiquidity: event.yesLiquidity + totalCost,

//                         }
//                     });
//                 } else {
//                     await prisma.event.update({
//                         where: { id: eventId },
//                         data: {
//                             noLiquidity: event.noLiquidity + totalCost,

//                         }
//                     });
//                 }

//                 // Create BUY trade
//                 const trade = await prisma.trade.create({
//                     data: {
//                         category: event.categary,
//                         tradeTitle: event.eventTitle,
//                         price,
//                         quantity,
//                         tradeLogo: event.eventLogo,
//                         orderType,   // BUY
//                         tradeType,   // YES or NO
//                         userId,
//                         eventId
//                     }
//                 });

//                 // add in prediction table
//                 await prisma.prediction.create({
//                     data: {
//                         price,
//                         quantity,
//                         orderType,
//                         prediction: tradeType,
//                         eventId,
//                         userId,
//                         tradeId: trade.id
//                     }
//                 })
//                 // Deduct balance
//                 await prisma.user.update({
//                     where: { id: userId },
//                     data: {
//                         balance: user.balance - totalCost
//                     }
//                 });

//                 // Predict updated price
//                 const prices = await prisma.trade.findMany({
//                     where: { eventId },
//                     orderBy: { createdAt: 'desc' },
//                 });

//                 const result = await PredictPrice(prices, eventId);
//                 const up = await prisma.event.update({
//                     where: {
//                         id: eventId, // ID of the event you want to update
//                     },
//                     data: {
//                         yesPrice: result.YesPrice, // new value for yesPrice
//                         noPrice: result.NoPrice,   // new value for noPrice
//                     },
//                 });
//                 return res.status(200).json({ message: "Trade success", trade, result });

//             } else if (orderType === "SELL") {

//                 // Fetch total BUY and SELL quantity for this tradeType
//                 const [buyTrades, sellTrades] = await Promise.all([
//                     prisma.trade.findMany({
//                         where: {
//                             userId,
//                             eventId,
//                             tradeType,
//                             orderType: "BUY"
//                         }
//                     }),
//                     prisma.trade.findMany({
//                         where: {
//                             userId,
//                             eventId,
//                             tradeType,
//                             orderType: "SELL"
//                         }
//                     })
//                 ]);

//                 const totalBuy = buyTrades.reduce((sum, t) => sum + t.quantity, 0);
//                 const totalSell = sellTrades.reduce((sum, t) => sum + t.quantity, 0);
//                 const availableQuantity = totalBuy - totalSell;


//                 if (availableQuantity < quantity) {
//                     return res.status(400).json({
//                         message: `You don't have enough ${tradeType} quantity to SELL`
//                     });
//                 }

//                 if (tradeType === "YES") {
//                     await prisma.event.update({
//                         where: { id: eventId },
//                         data: {
//                             yesLiquidity: event.yesLiquidity - price * quantity,

//                         }
//                     });
//                 } else {
//                     await prisma.event.update({
//                         where: { id: eventId },
//                         data: {
//                             noLiquidity: event.noLiquidity - price * quantity,

//                         }
//                     });
//                 }

//                 // 🧠 NEW: Check opposite pool liquidity
//                 const oppositeType = tradeType === "YES" ? "NO" : "YES";
//                 const oppositeBuys = await prisma.trade.findMany({
//                     where: {
//                         orderType: "BUY",
//                         tradeType: oppositeType,
//                         eventId
//                     }
//                 });

//                 const availablePool = oppositeBuys.reduce((sum, t) => sum + t.quantity, 0);

//                 if (availablePool < quantity) {
//                     return res.status(400).json({
//                         message: `Not enough liquidity in ${oppositeType} pool to execute SELL order`
//                     });
//                 }

//                 // Create SELL trade
//                 const trade = await prisma.trade.create({
//                     data: {
//                         category: event.categary,
//                         tradeTitle: event.eventTitle,
//                         price,
//                         quantity,
//                         tradeLogo: event.eventLogo,
//                         orderType,   // SELL
//                         tradeType,   // YES or NO
//                         userId,
//                         eventId
//                     }
//                 });


//                 // Credit balance
//                 await prisma.user.update({
//                     where: { id: userId },
//                     data: {
//                         balance: user.balance + price * quantity
//                     }
//                 });

//                 // Predict updated price
//                 const prices = await prisma.trade.findMany({
//                     where: { eventId },
//                     orderBy: { createdAt: 'desc' },
//                 });

//                 const result = await PredictPrice(prices, eventId);
//                 //update yes price and no price
//                 const up = await prisma.event.update({
//                     where: {
//                         id: eventId, // ID of the event you want to update
//                     },
//                     data: {
//                         yesPrice: result.YesPrice, // new value for yesPrice
//                         noPrice: result.NoPrice,   // new value for noPrice
//                     },
//                 });
//                 return res.status(200).json({ message: "Trade success", trade, result });
//             }

//         } else if (currentTime < startTime) {
//             return res.status(403).json({ message: "Trade window is not started yet" });
//         } else {
//             return res.status(403).json({ message: "Trade window is closed" });
//         }

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Something went wrong", error: error.message });
//     }
// };


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

//tested

export const addTrade = async (req, res) => {
    try {
        const { price, quantity, orderType, tradeType, eventId } = req.body;
        const userId = req.user;

        // Input validation
        if (!price || !quantity || !orderType || !tradeType || !eventId || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (price <= 0 || price > 10 || quantity <= 0) {
            return res.status(400).json({ message: "Invalid price or quantity" });
        }

        if (!["BUY", "SELL"].includes(orderType)) {
            return res.status(400).json({ message: "Invalid order type" });
        }

        if (!["YES", "NO"].includes(tradeType)) {
            return res.status(400).json({ message: "Invalid trade type" });
        }

        // Validate event exists and is still open
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (new Date(event.endTime) <= new Date()) {
            return res.status(400).json({ message: "Event is closed" });
        }

        // Check user balance for BUY orders
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const totalCost = price * quantity;
        if (orderType === "BUY" && user.balance < totalCost) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const incomingOrder = {
            price,
            quantity,
            orderType,
            tradeType,
            eventId,
            userId,
        };

        // Execute order matching within a transaction
        const result = await prisma.$transaction(async (tx) => {
            const matchResult = await matchOrder(incomingOrder, tx);
            const { matches, remainingQty } = matchResult;
            const filledQty = quantity - remainingQty;

            // Create leftover order if any quantity remains unfilled
            if (remainingQty > 0) {
                await tx.order.create({
                    data: {
                        price,
                        quantity: remainingQty,
                        filledQty: 0,
                        orderType,
                        tradeType,
                        status: "OPEN", // Changed from PENDING to OPEN for consistency
                        eventId,
                        userId,
                    },
                });

                // For BUY orders, reserve the funds
                if (orderType === "BUY") {
                    await tx.user.update({
                        where: { id: userId },
                        data: { balance: { decrement: price * remainingQty } },
                    });
                }
            }

            // Create trade records for all matches
            for (const match of matches) {
                const trade = await tx.trade.create({
                    data: {
                        tradeTitle: `${tradeType} ${orderType} on Event ${eventId}`,
                        price: match.tradePrice,
                        quantity: match.fillQty,
                        tradeLogo: event.eventLogo || "",
                        orderType,
                        tradeType,
                        category: event.categary || event.category || "Unknown", // Handle possible typo
                        userId,
                        eventId,
                    },
                });

                // Create prediction records for both parties
                await tx.prediction.createMany({
                    data: [
                        {
                            userId: match.takerId,
                            tradeId: trade.id,
                            eventId,
                            price: match.tradePrice,
                            quantity: match.fillQty,
                            orderType,
                            prediction: tradeType,
                        },
                        {
                            userId: match.makerId,
                            tradeId: trade.id,
                            eventId,
                            price: match.tradePrice,
                            quantity: match.fillQty,
                            orderType: orderType === "BUY" ? "SELL" : "BUY",
                            prediction: tradeType,
                        },
                    ],
                });
            }

            return matchResult;
        });

        // Update predicted prices after transaction completes
        const updatedPrices = await updatePredictedPrices(eventId);

        return res.status(200).json({
            message: "Order processed successfully",
            matchResult: result,
            updatedPrices,
        });
    } catch (error) {
        console.error("Error processing order:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

