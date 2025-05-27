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


// export const addTrade = async (req, res) => {
//     try {
//         const { price, quantity, orderType, tradeType, eventId } = req.body;
//         const userId = req.user;

//         // Input validation
//         if (!price || !quantity || !orderType || !tradeType || !eventId || !userId) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         if (price <= 0 || price > 10 || quantity <= 0) {
//             return res.status(400).json({ message: "Invalid price or quantity" });
//         }

//         if (!["BUY", "SELL"].includes(orderType)) {
//             return res.status(400).json({ message: "Invalid order type" });
//         }

//         if (!["YES", "NO"].includes(tradeType)) {
//             return res.status(400).json({ message: "Invalid trade type" });
//         }

//         // Validate event exists and is still open
//         const event = await prisma.event.findUnique({ where: { id: eventId } });
//         if (!event) {
//             return res.status(404).json({ message: "Event not found" });
//         }

//         if (new Date(event.endTime) <= new Date()) {
//             return res.status(400).json({ message: "Event is closed" });
//         }

//         // Check user balance for BUY orders
//         const user = await prisma.user.findUnique({ where: { id: userId } });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const totalCost = price * quantity;
//         if (orderType === "BUY" && user.balance < totalCost) {
//             return res.status(400).json({ message: "Insufficient balance" });
//         }

//         const incomingOrder = {
//             price,
//             quantity,
//             orderType,
//             tradeType,
//             eventId,
//             userId,
//         };

//         // Execute order matching within a transaction
//         const result = await prisma.$transaction(async (tx) => {
//             const matchResult = await matchOrder(incomingOrder, tx);
//             const { matches, remainingQty } = matchResult;
//             const filledQty = quantity - remainingQty;

//             let createdOrderId = null;
//             let associatedTradeId = null;

//             // Create leftover order if any quantity remains unfilled
//             if (remainingQty > 0) {
//                 const createdOrder = await tx.order.create({
//                     data: {
//                         price,
//                         quantity: remainingQty,
//                         filledQty,
//                         orderType,
//                         tradeType,
//                         status: "OPEN",
//                         eventId,
//                         userId,
//                         // tradeId will be set later if this order gets completely filled by a single trade
//                     },
//                 });
//                 createdOrderId = createdOrder.id;

//                 // For BUY orders, reserve the funds
//                 if (orderType === "BUY") {
//                     await tx.user.update({
//                         where: { id: userId },
//                         data: { balance: { decrement: price * remainingQty } },
//                     });
//                 }
//             }

//             // Create trade records for all matches
//             for (const match of matches) {
//                 const trade = await tx.trade.create({
//                     data: {
//                         tradeTitle: `${tradeType} ${orderType} on Event ${eventId}`,
//                         price: match.tradePrice,
//                         quantity: match.fillQty,
//                         tradeLogo: event.eventLogo || "",
//                         orderType,
//                         yesPrice: event.yesPrice,
//                         noPrice: event.noPrice,
//                         tradeType,
//                         category: event.categary || event.category || "Unknown",
//                         userId,
//                         eventId,
//                     },
//                 });

//                 // If this order was completely filled and only has one trade, associate them
//                 if (remainingQty === 0 && matches.length === 1) {
//                     associatedTradeId = trade.id;
//                 }

//                 // Create prediction records for both parties
//                 await tx.prediction.createMany({
//                     data: [
//                         {
//                             userId: match.takerId,
//                             tradeId: trade.id,
//                             eventId,
//                             price: match.tradePrice,
//                             quantity: match.fillQty,
//                             orderType,
//                             prediction: tradeType,
//                         },
//                         {
//                             userId: match.makerId,
//                             tradeId: trade.id,
//                             eventId,
//                             price: match.tradePrice,
//                             quantity: match.fillQty,
//                             orderType: orderType === "BUY" ? "SELL" : "BUY",
//                             prediction: tradeType,
//                         },
//                     ],
//                 });
//             }

//             // If order was completely filled by a single trade, create an order record with tradeId
//             if (remainingQty === 0 && matches.length === 1 && associatedTradeId) {
//                 await tx.order.create({
//                     data: {
//                         price,
//                         quantity: filledQty,
//                         filledQty,
//                         orderType,
//                         tradeType,
//                         status: "FULFILLED",
//                         eventId,
//                         userId,
//                         tradeId: associatedTradeId, // Set the tradeId here
//                     },
//                 });
//             } else if (remainingQty > 0 && matches.length === 1 && associatedTradeId) {
//                 await tx.order.create({
//                     data: {
//                         price,
//                         quantity: filledQty,
//                         filledQty,
//                         orderType,
//                         tradeType,
//                         status: "PARTIAL",
//                         eventId,
//                         userId,
//                         tradeId: associatedTradeId, // Set the tradeId here
//                     },
//                 });
//             }

//             return matchResult;
//         });

//         // Update predicted prices after transaction completes
//         const updatedPrices = await updatePredictedPrices(eventId);

//         return res.status(200).json({
//             message: "Order processed successfully",
//             matchResult: result,
//             updatedPrices,
//         });
//     } catch (error) {
//         console.error("Error processing order:", error);
//         return res.status(500).json({
//             message: "Internal Server Error",
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };

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

            let createdTradeId = null;

            // For BUY orders and remaining quantity, reserve the funds
            if (remainingQty > 0 && orderType === "BUY") {
                await tx.user.update({
                    where: { id: userId },
                    data: { balance: { decrement: price * remainingQty } },
                });
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
                        yesPrice: event.yesPrice,
                        noPrice: event.noPrice,
                        tradeType,
                        category: event.categary || event.category || "Unknown",
                        userId,
                        eventId,
                    },
                });

                // Store the trade ID if this is the only match (for potential order association)
                if (matches.length === 1) {
                    createdTradeId = trade.id;
                }

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

            // Create order record(s) based on fill status
            if (remainingQty === 0) {
                // Order completely filled
                if (matches.length === 1 && createdTradeId) {
                    // Single trade filled the entire order - create one order with tradeId
                    await tx.order.create({
                        data: {
                            price,
                            quantity,
                            filledQty: quantity,
                            orderType,
                            tradeType,
                            status: "FULFILLED",
                            eventId,
                            userId,
                            tradeId: createdTradeId,
                        },
                    });
                } else {
                    // Multiple trades filled the order - create order without specific tradeId
                    await tx.order.create({
                        data: {
                            price,
                            quantity,
                            filledQty: quantity,
                            orderType,
                            tradeType,
                            status: "FULFILLED",
                            eventId,
                            userId,
                            // tradeId remains null for multi-trade fills
                        },
                    });
                }
            } else {
                // Order partially filled - create unfilled portion
                await tx.order.create({
                    data: {
                        price,
                        quantity: remainingQty,
                        filledQty: 0, // This represents the unfilled portion
                        orderType,
                        tradeType,
                        status: "OPEN",
                        eventId,
                        userId,
                        // tradeId remains null for unfilled orders
                    },
                });

                // If there were matches, also create a record for the filled portion
                if (filledQty > 0) {
                    const orderData = {
                        price,
                        quantity: filledQty,
                        filledQty: filledQty,
                        orderType,
                        tradeType,
                        status: "PARTIAL",
                        eventId,
                        userId,
                    };

                    // Only set tradeId if single trade filled this portion
                    if (matches.length === 1 && createdTradeId) {
                        orderData.tradeId = createdTradeId;
                    }

                    await tx.order.create({
                        data: orderData,
                    });
                }
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

export const getOpenOrdersOfUser = async (req, res) => {
    try {
        const userId = req.user;
        const orders = await prisma.order.findMany({
            where: {
                status: "OPEN",
                userId: userId,
            },
        });

        return res.status(200).json({ orders, cnt: orders.length });
    } catch (error) {
        console.error("Error fetching user open orders:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user;

        // Input validation
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        if (!userId) {
            return res.status(401).json({ message: "User authentication required" });
        }

        let order = null
        // Execute cancellation within a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Find the order to cancel
            order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    user: true,
                    event: true
                }
            });

            if (!order) {
                throw new Error("Order not found");
            }

            // Verify order belongs to the user
            if (order.userId !== userId) {
                throw new Error("Unauthorized: Order does not belong to user");
            }

            // Check if order can be cancelled
            if (order.status === "FULFILLED") {
                throw new Error("Cannot cancel fulfilled order");
            }

            if (order.status === "PARTIAL") {
                throw new Error("Cannot cancel partially filled order");
            }

            if (order.status !== "OPEN") {
                throw new Error("Order cannot be cancelled");
            }

            // Check if event is still active
            if (new Date(order.event.endTime) <= new Date()) {
                throw new Error("Cannot cancel order for closed event");
            }

            // Calculate refund amount for BUY orders
            let refundAmount = 0;
            if (order.orderType === "BUY") {
                // Refund = (original quantity - filled quantity) * price
                const unfilledQuantity = order.quantity - order.filledQty;
                refundAmount = unfilledQuantity * order.price;
            } else {
                // push in pridiction arry on exact sell price from trade table

                await tx.prediction.create({
                    data: {
                        user: { connect: { id: order.userId } },
                        event: { connect: { id: order.eventId } },
                        prediction: order.tradeType,
                        orderType: order.orderType,
                        price: order.price,
                        quantity: order.quantity,
                        trade: { connect: { id: 445 } }

                    },
                });
            }

            // Update order status to cancelled (you might want to add CANCELLED to your enum)
            // For now, we'll delete the order or you can add a CANCELLED status
            await tx.order.delete({
                where: { id: orderId }
            });

            // Refund user balance for BUY orders
            if (refundAmount > 0) {
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        balance: {
                            increment: refundAmount
                        }
                    }
                });
            }

            return {
                orderId: order.id,
                orderType: order.orderType,
                tradeType: order.tradeType,
                price: order.price,
                quantity: order.quantity,
                filledQty: order.filledQty,
                refundAmount,
                eventId: order.eventId
            };
        });

        const updatedPrices = await updatePredictedPrices(order.eventId);

        return res.status(200).json({
            message: "Order cancelled successfully",
            cancelledOrder: result,
            updatedPrices
        });

    } catch (error) {
        console.error("Error cancelling order:", error);

        // Handle specific error messages
        if (error.message === "Order not found") {
            return res.status(404).json({ message: error.message });
        }

        if (error.message.includes("Unauthorized")) {
            return res.status(403).json({ message: error.message });
        }

        if (error.message.includes("Cannot cancel")) {
            return res.status(400).json({ message: error.message });
        }

        return res.status(500).json({
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};