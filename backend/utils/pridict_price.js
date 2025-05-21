// import { prisma } from "../db/db.js";

// async function getevent(eventId) {
//     const event = await prisma.event.findFirst({
//         where: {
//             id: eventId,
//         }
//     })
//     return event;
// }

// export const PredictPrice = async (prices = [], eventId) => {
//     if (!Array.isArray(prices) || prices.length === 0) {
//         return { message: "Price array is required and cannot be empty" };
//     }

//     const event = await getevent(eventId)
//     console.log(event)
//     if (event.yesLiquidity > 100 && event.noLiquidity > 100) {
//         let YESPOT = event.yesLiquidity;
//         let NOPOT = event.noLiquidity;
//         let TOTALPOT = event.noLiquidity + event.yesLiquidity;

//         for (let i = 0; i < prices.length; i++) {
//             const trade = prices[i];
//             const amount = trade.quantity * trade.price;

//             if (trade.tradeType === "YES") {
//                 YESPOT += trade.orderType === "BUY" ? amount : -amount;
//                 TOTALPOT += trade.orderType === "BUY" ? amount : -amount;
//             } else if (trade.tradeType === "NO") {
//                 NOPOT += trade.orderType === "BUY" ? amount : -amount;
//                 TOTALPOT += trade.orderType === "BUY" ? amount : -amount;
//             }
//         }

//         if (TOTALPOT === 0) {
//             return { message: "Total pot is zero, can't calculate price" };
//         }

//         const CurrentYesPrice = parseFloat(((YESPOT / TOTALPOT) * 10).toFixed(2));
//         const CurrentNoPrice = parseFloat((10 - CurrentYesPrice).toFixed(2));

//         return { YesPrice: CurrentYesPrice, NoPrice: CurrentNoPrice };

//     } else {
//         return { YesPrice: event.yesPrice, NoPrice: event.noPrice };

//     }

// };





