import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const matchOrder = async (incomingOrder, tx) => {
    const { price, quantity, orderType, tradeType, eventId, userId } = incomingOrder;
    let remainingQty = quantity;
    const matches = [];

    const oppositeOrderType = orderType === "BUY" ? "SELL" : "BUY";

    // Fetch matching orders that are either OPEN or PARTIAL with suitable price
    const matchOrders = await tx.order.findMany({
        where: {
            eventId,
            tradeType,
            orderType: oppositeOrderType,
            status: { in: ["OPEN", "PARTIAL"] },
            price: orderType === "BUY" ? { lte: price } : { gte: price },
            userId: { not: userId } // Exclude user's own orders
        },
        orderBy: {
            // For BUY orders, we want the lowest sell prices first
            // For SELL orders, we want the highest buy prices first
            price: orderType === "BUY" ? "asc" : "desc"
        }
    });

    console.log("Matching orders found:", matchOrders.length);

    for (const order of matchOrders) {
        const availableQty = order.quantity - order.filledQty;
        if (availableQty <= 0) continue;

        const fillQty = Math.min(availableQty, remainingQty);
        const tradePrice = order.price; // Use the existing order's price for the trade

        // Update the matched order's filledQty and status
        await tx.order.update({
            where: { id: order.id },
            data: {
                filledQty: { increment: fillQty },
                status: order.filledQty + fillQty >= order.quantity ? "FULFILLED" : "PARTIAL"
            }
        });

        // Record this match info
        matches.push({
            matchedOrderId: order.id,
            tradePrice,
            fillQty,
            makerId: order.userId,  // The maker is the existing order's user
            takerId: userId         // The taker is the incoming order's user
        });

        // Settlement logic - always transfer from buyer to seller
        // For a YES prediction:
        //   - BUY order: buyer pays, seller receives
        //   - SELL order: seller receives, buyer pays
        const buyerId = orderType === "BUY" ? userId : order.userId;
        const sellerId = orderType === "BUY" ? order.userId : userId;

        // Buyer pays, seller receives
        await tx.user.update({
            where: { id: buyerId },
            data: { balance: { decrement: tradePrice * fillQty } }
        });

        await tx.user.update({
            where: { id: sellerId },
            data: { balance: { increment: tradePrice * fillQty } }
        });

        remainingQty -= fillQty;
        if (remainingQty <= 0) break;
    }

    return { matches, remainingQty };
};