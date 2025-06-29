import { prisma } from '../../db/db.js';
import { matchOrder } from '../../utils/matchOrder.js';

export const getAllEvents = async (req, res) => {
    try {
        const allEvents = await prisma.event.findMany();
        return res.status(200).json({ events: allEvents });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// Get event by ID
export const getEventById = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const event = await prisma.event.findUnique({ where: { id } });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json({ event });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


// create event
// export const addEvent = async (req, res) => {
//     const { eventTitle, cratedTime, startTime, endTime, eventLogo, details, categary, description } = req.body;
//     if (!eventLogo || !eventTitle || !cratedTime || !startTime || !details || !endTime || !eventLogo || !categary) {
//         return res.status(400).json({ message: "All field required" });
//     }
//     try {
//         const event = await prisma.event.create({
//             data: {
//                 eventTitle,
//                 cratedTime,
//                 startTime,
//                 endTime,
//                 eventLogo,
//                 categary,
//                 description,
//                 details
//             }

//         })
//         console.log(event.id);

//         return res.status(200).json({ message: "event created", event });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Something went wrong" });
//     }
// }

export const addEvent = async (req, res) => {
    const {
        eventTitle, cratedTime, startTime, endTime,
        eventLogo, details, categary, description
    } = req.body;

    if (!eventLogo || !eventTitle || !cratedTime || !startTime || !details || !endTime || !categary) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        const event = await prisma.event.create({
            data: {
                eventTitle,
                cratedTime,
                startTime,
                endTime,
                eventLogo,
                categary,
                description,
                details
            }
        });

        console.log("Created Event ID:", event.id);

        // ✅ SYSTEM USER ID (should be constant or env variable)
        const SYSTEM_USER_ID = 10;

        // Auto-seed SELL orders for both "YES" and "NO"
        const seedOrders = [
            { price: 5, quantity: 10, orderType: "SELL", tradeType: "YES", eventId: event.id },
            { price: 5, quantity: 10, orderType: "SELL", tradeType: "NO", eventId: event.id },
        ];

        for (const order of seedOrders) {
            // Call the existing matchOrder logic inside a transaction manually
            await prisma.$transaction(async (tx) => {
                const incomingOrder = { ...order, userId: SYSTEM_USER_ID };

                const matchResult = await matchOrder(incomingOrder, tx);
                const { matches, remainingQty } = matchResult;
                const filledQty = order.quantity - remainingQty;

                let createdTradeId = null;

                // Create trade records
                for (const match of matches) {
                    const trade = await tx.trade.create({
                        data: {
                            tradeTitle: `${order.tradeType} ${order.orderType} on Event ${order.eventId}`,
                            price: match.tradePrice,
                            quantity: match.fillQty,
                            tradeLogo: event.eventLogo || "",
                            orderType: order.orderType,
                            yesPrice: event.yesPrice,
                            noPrice: event.noPrice,
                            tradeType: order.tradeType,
                            category: event.categary || event.category || "Unknown",
                            userId: SYSTEM_USER_ID,
                            eventId: order.eventId,
                        }
                    });

                    if (matches.length === 1) createdTradeId = trade.id;

                    await tx.prediction.createMany({
                        data: [
                            {
                                userId: match.takerId,
                                tradeId: trade.id,
                                eventId: order.eventId,
                                price: match.tradePrice,
                                quantity: match.fillQty,
                                orderType: order.orderType,
                                prediction: order.tradeType,
                            },
                            {
                                userId: match.makerId,
                                tradeId: trade.id,
                                eventId: order.eventId,
                                price: match.tradePrice,
                                quantity: match.fillQty,
                                orderType: order.orderType === "BUY" ? "SELL" : "BUY",
                                prediction: order.tradeType,
                            },
                        ]
                    });
                }

                // Create order(s) based on match
                if (remainingQty === 0) {
                    await tx.order.create({
                        data: {
                            price: order.price,
                            quantity: order.quantity,
                            filledQty: order.quantity,
                            orderType: order.orderType,
                            tradeType: order.tradeType,
                            status: "FULFILLED",
                            eventId: order.eventId,
                            userId: SYSTEM_USER_ID,
                            tradeId: createdTradeId
                        }
                    });
                } else {
                    await tx.order.create({
                        data: {
                            price: order.price,
                            quantity: remainingQty,
                            filledQty: 0,
                            orderType: order.orderType,
                            tradeType: order.tradeType,
                            status: "OPEN",
                            eventId: order.eventId,
                            userId: SYSTEM_USER_ID
                        }
                    });

                    if (filledQty > 0) {
                        const partialData = {
                            price: order.price,
                            quantity: filledQty,
                            filledQty: filledQty,
                            orderType: order.orderType,
                            tradeType: order.tradeType,
                            status: "PARTIAL",
                            eventId: order.eventId,
                            userId: SYSTEM_USER_ID,
                        };

                        if (createdTradeId) partialData.tradeId = createdTradeId;

                        await tx.order.create({ data: partialData });
                    }
                }
            });
        }

        return res.status(200).json({ message: "Event created and seeded with initial trades", event });

    } catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


// Update event
export const updateEvent = async (req, res) => {
    const id = parseInt(req.params.id);
    const { eventTitle, createdTime, startTime, endTime, details, eventLogo, categary, description } = req.body;

    try {
        const isExitevent = await prisma.event.findUnique({ where: { id } });

        if (!isExitevent) {
            return res.status(404).json({ message: "Event not found" });
        }

        const event = await prisma.event.update({
            where: { id: parseInt(id) },
            data: {
                eventTitle,
                cratedTime: createdTime,
                startTime,
                endTime,
                eventLogo,
                categary,
                description,
                details
            }
        });

        return res.status(200).json({ message: "Event updated", event });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Update failed or event not found" });
    }
};


// Delete event
export const deleteEvent = async (req, res) => {
    const id = parseInt(req.params.id); // ✅ Correct extraction and parsing

    try {
        const isExitevent = await prisma.event.findUnique({ where: { id } });

        if (!isExitevent) {
            return res.status(404).json({ message: "Event not found" });
        }

        await prisma.event.delete({ where: { id } });

        return res.status(200).json({ message: "Event deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const getEventsByCategory = async (req, res) => {
    const { category } = req.params; // Access category from URL parameter

    try {
        const events = await prisma.event.findMany({ where: { categary: category } });

        // if (events.length === 0) {
        //     return res.status(404).json({ message: "No events found for this category" });
        // }

        return res.status(200).json({ events });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


export const searchEvents = async (req, res) => {
    const { query } = req.params;  // Assuming you pass search text as a param

    try {
        const events = await prisma.event.findMany({
            where: {
                OR: [
                    {
                        eventTitle: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        details: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
        });

        // if (events.length === 0) {
        //   return res.status(404).json({ message: "No events found matching your search" });
        // }

        return res.status(200).json({ events });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
