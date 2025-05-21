
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const updatePredictedPrices = async (eventId) => {
    // Use a transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
        const orders = await tx.order.findMany({
            where: {
                eventId,
                status: { in: ["OPEN", "PARTIAL"] }
            }
        });

        let yesLiquidity = 0;
        let noLiquidity = 0;

        for (const order of orders) {
            const remainingQty = order.quantity - order.filledQty;

            // Calculate liquidity based on order type and prediction
            if (order.tradeType === "YES") {
                if (order.orderType === "BUY") {
                    yesLiquidity += remainingQty * order.price;
                } else { // SELL
                    noLiquidity += remainingQty * (10 - order.price); // Represent as opposite bet
                }
            } else { // NO
                if (order.orderType === "BUY") {
                    noLiquidity += remainingQty * order.price;
                } else { // SELL
                    yesLiquidity += remainingQty * (10 - order.price); // Represent as opposite bet
                }
            }
        }

        // Calculate meaningful prices with safety checks
        const totalLiquidity = yesLiquidity + noLiquidity;

        // Default to 50/50 if no liquidity, otherwise calculate proper ratio
        // Bounded between 0.5 and 9.5 to avoid extreme prices
        const yesPrice = totalLiquidity === 0
            ? 5
            : Math.max(0.5, Math.min(9.5, (yesLiquidity / totalLiquidity) * 10));

        const noPrice = totalLiquidity === 0
            ? 5
            : Math.max(0.5, Math.min(9.5, (noLiquidity / totalLiquidity) * 10));

        // Update the event with new prices and liquidity
        const updated = await tx.event.update({
            where: { id: eventId },
            data: {
                yesLiquidity,
                noLiquidity,
                yesPrice,
                noPrice
            }
        });

        return {
            yesLiquidity,
            noLiquidity,
            yesPrice,
            noPrice
        };
    });
};