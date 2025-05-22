import { prisma } from "../../db/db.js";

export const getOrderbookOfYES = async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required'
            });
        }

        // Validate eventId is a number
        const eventIdInt = parseInt(eventId);
        if (isNaN(eventIdInt)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Event ID'
            });
        }

        // Fetch all pending orders for the event
        const orders = await prisma.order.findMany({
            where: {
                eventId: eventIdInt,
                status: {
                    in: ["OPEN", "PARTIAL"],
                },
                tradeType: "YES"
            },
            orderBy: {
                price: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        // Add other user fields you might need
                    }
                }
            }
        });

        // Group orders by price and trade type
        const orderBook = processOrderBookData(orders);

        res.status(200).json({
            success: true,
            data: orderBook,
            meta: {
                totalOrders: orders.length,
                eventId: eventIdInt,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error fetching order book:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const getOrderbookOfNO = async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required'
            });
        }

        // Validate eventId is a number
        const eventIdInt = parseInt(eventId);
        if (isNaN(eventIdInt)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Event ID'
            });
        }

        // Fetch all pending orders for the event
        const orders = await prisma.order.findMany({
            where: {
                eventId: eventIdInt,
                status: {
                    in: ["OPEN", "PARTIAL"],
                },
                tradeType: "NO",
            },
            orderBy: {
                price: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        // Add other user fields you might need
                    },
                },
            },
        });


        // Group orders by price and trade type
        const orderBook = processOrderBookData(orders);

        res.status(200).json({
            success: true,
            data: orderBook,
            meta: {
                totalOrders: orders.length,
                eventId: eventIdInt,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error fetching order book:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const getOrderbookSummery = async (req, res) => {
    try {
        const { eventId } = req.params;
        const eventIdInt = parseInt(eventId);

        if (isNaN(eventIdInt)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Event ID'
            });
        }

        const orders = await prisma.order.findMany({
            where: {
                eventId: eventIdInt,
                status: 'OPEN'
            }
        });

        const summary = getOrderBookSummary(orders);

        res.status(200).json({
            success: true,
            data: summary
        });

    } catch (error) {
        console.error('Error fetching order book summary:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const getProbability = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { period = 'All' } = req.query;

        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: 'Missing event ID'
            });
        }

        const event = await prisma.event.findUnique({
            where: { id: parseInt(eventId) },
            include: {
                trades: {
                    orderBy: { createdAt: 'desc' },
                    take: 15
                }
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const currentProbability = calculateProbability(event.yesPrice, event.noPrice);
        const status = currentProbability >= 50 ? 'YES' : 'NO';

        const chartData = await generateChartData(eventId, period);

        const probabilityBars = event.trades.map(trade => ({
            type: trade.outcome?.toLowerCase() || 'yes',
            height: Math.min(Math.max((trade.amount || 10) / 10, 5), 50)
        }));

        res.json({
            success: true,
            data: {
                eventId: event.id,
                eventTitle: event.eventTitle,
                currentProbability,
                status,
                yesPrice: event.yesPrice,
                noPrice: event.noPrice,
                yesLiquidity: event.yesLiquidity,
                noLiquidity: event.noLiquidity,
                chartData,
                probabilityBars: probabilityBars.length > 0 ? probabilityBars : [
                    { type: 'yes', height: 20 },
                    { type: 'no', height: 15 },
                    { type: 'yes', height: 25 }
                ],
                period: period,
                startTime: event.startTime,
                endTime: event.endTime
            }
        });
    } catch (error) {
        console.error('Error fetching probability data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch probability data'
        });
    }
}


function processOrderBookData(orders) {
    // Group orders by price and trade type
    const groupedOrders = {};

    orders.forEach(order => {
        const key = `${order.price}_${order.tradeType}`;

        if (!groupedOrders[key]) {
            groupedOrders[key] = {
                price: order.price,
                tradeType: order.tradeType,
                totalQuantity: 0,
                availableQuantity: 0,
                orderCount: 0,
                orders: []
            };
        }

        const availableQty = order.quantity - order.filledQty;
        groupedOrders[key].totalQuantity += order.quantity;
        groupedOrders[key].availableQuantity += availableQty;
        groupedOrders[key].orderCount += 1;
        groupedOrders[key].orders.push({
            id: order.id,
            userId: order.userId,
            quantity: order.quantity,
            filledQty: order.filledQty,
            availableQty: availableQty,
            createdAt: order.createdAt
        });
    });

    // Separate YES and NO orders
    const yesOrders = {};
    const noOrders = {};

    Object.values(groupedOrders).forEach(order => {
        if (order.tradeType === 'YES') {
            yesOrders[order.price] = order;
        } else if (order.tradeType === 'NO') {
            noOrders[order.price] = order;
        }
    });

    // Get all unique prices and sort them (highest to lowest)
    const allPrices = new Set([
        ...Object.keys(yesOrders).map(Number),
        ...Object.keys(noOrders).map(Number)
    ]);

    const sortedPrices = Array.from(allPrices).sort((a, b) => b - a);

    // Create the order book structure
    const orderBook = sortedPrices.map(price => {
        const yesOrder = yesOrders[price];
        const noOrder = noOrders[price];

        return {
            price: price,
            yesPrice: yesOrder ? price : null,
            yesQty: yesOrder ? yesOrder.availableQuantity : 0,
            yesTotalQty: yesOrder ? yesOrder.totalQuantity : 0,
            yesOrderCount: yesOrder ? yesOrder.orderCount : 0,
            noPrice: noOrder ? price : null,
            noQty: noOrder ? noOrder.availableQuantity : 0,
            noTotalQty: noOrder ? noOrder.totalQuantity : 0,
            noOrderCount: noOrder ? noOrder.orderCount : 0
        };
    }).filter(item => item.yesQty > 0 || item.noQty > 0);

    return orderBook;
}

function getOrderBookSummary(orders) {
    const yesOrders = orders.filter(order => order.tradeType === 'YES');
    const noOrders = orders.filter(order => order.tradeType === 'NO');

    const yesTotalQty = yesOrders.reduce((sum, order) => sum + (order.quantity - order.filledQty), 0);
    const noTotalQty = noOrders.reduce((sum, order) => sum + (order.quantity - order.filledQty), 0);

    const yesAvgPrice = yesOrders.length > 0
        ? yesOrders.reduce((sum, order) => sum + order.price, 0) / yesOrders.length
        : 0;

    const noAvgPrice = noOrders.length > 0
        ? noOrders.reduce((sum, order) => sum + order.price, 0) / noOrders.length
        : 0;

    return {
        yes: {
            totalQuantity: yesTotalQty,
            orderCount: yesOrders.length,
            averagePrice: parseFloat(yesAvgPrice.toFixed(2)),
            highestPrice: yesOrders.length > 0 ? Math.max(...yesOrders.map(o => o.price)) : 0,
            lowestPrice: yesOrders.length > 0 ? Math.min(...yesOrders.map(o => o.price)) : 0
        },
        no: {
            totalQuantity: noTotalQty,
            orderCount: noOrders.length,
            averagePrice: parseFloat(noAvgPrice.toFixed(2)),
            highestPrice: noOrders.length > 0 ? Math.max(...noOrders.map(o => o.price)) : 0,
            lowestPrice: noOrders.length > 0 ? Math.min(...noOrders.map(o => o.price)) : 0
        },
        total: {
            quantity: yesTotalQty + noTotalQty,
            orderCount: orders.length
        }
    };
}

// Helper function to calculate probability based on price
function calculateProbability(yesPrice, noPrice) {
    const totalPrice = yesPrice + noPrice;
    return totalPrice > 0 ? Math.round((yesPrice / totalPrice) * 100) : 50;
}

// Helper function to filter data by time period
function filterDataByTimePeriod(data, period) {
    const now = new Date();
    let cutoffTime;

    switch (period) {
        case '1 h':
            cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
            break;
        case '3 h':
            cutoffTime = new Date(now.getTime() - 3 * 60 * 60 * 1000);
            break;
        case '6 h':
            cutoffTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
            break;
        case '12 h':
            cutoffTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
            break;
        case 'All':
        default:
            return data;
    }

    return data.filter(point => new Date(point.timestamp) >= cutoffTime);
}

// Helper function to generate chart data from event history
async function generateChartData(eventId, period = 'All') {
    try {
        // Get trades for this event to track price changes over time
        const trades = await prisma.trade.findMany({
            where: { eventId: parseInt(eventId) },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                yesPrice: true,
                noPrice: true,
                createdAt: true,

            }
        });

        // Get the current event data
        const event = await prisma.event.findUnique({
            where: { id: parseInt(eventId) },
            select: {
                yesPrice: true,
                noPrice: true,
                cratedTime: true
            }
        });

        if (!event) {
            return [];
        }

        let chartData = [];
        let currentYesPrice = 5; // Starting price
        let currentNoPrice = 5;  // Starting price

        // Add initial data point
        chartData.push({
            x: 0,
            y: calculateProbability(currentYesPrice, currentNoPrice),
            timestamp: event.cratedTime.toISOString(),
            yesPrice: currentYesPrice,
            noPrice: currentNoPrice
        });

        // Process trades to build price history
        trades.forEach((trade, index) => {
            // Update prices based on trade (this is simplified - you might have different logic)
            if (trade.outcome === 'YES') {
                currentYesPrice = trade.yesPrice || currentYesPrice;
            } else if (trade.outcome === 'NO') {
                currentNoPrice = trade.noPrice || currentNoPrice;
            }

            chartData.push({
                x: (index + 1) * 8,
                y: calculateProbability(currentYesPrice, currentNoPrice),
                timestamp: trade.createdAt.toISOString(),
                yesPrice: currentYesPrice,
                noPrice: currentNoPrice,
                tradeId: trade.id
            });
        });

        // Add current event prices as the latest point
        if (chartData.length === 1 ||
            (event.yesPrice !== currentYesPrice || event.noPrice !== currentNoPrice)) {
            chartData.push({
                x: chartData.length * 8,
                y: calculateProbability(event.yesPrice, event.noPrice),
                timestamp: new Date().toISOString(),
                yesPrice: event.yesPrice,
                noPrice: event.noPrice
            });
        }

        return filterDataByTimePeriod(chartData, period);
    } catch (error) {
        console.error('Error generating chart data:', error);
        return [];
    }
}
