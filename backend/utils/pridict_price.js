

export const PredictPrice = (prices = []) => {
    if (!Array.isArray(prices) || prices.length === 0) {
        return { message: "Price array is required and cannot be empty" };
    }

    let YESPOT = 0;
    let NOPOT = 0;
    let TOTALPOT = 0;

    for (let i = 0; i < prices.length; i++) {
        const trade = prices[i];
        const amount = trade.quantity * trade.price;

        if (trade.tradeType === "YES") {
            YESPOT += trade.orderType === "BUY" ? amount : -amount;
            TOTALPOT += trade.orderType === "BUY" ? amount : -amount;
        } else if (trade.tradeType === "NO") {
            NOPOT += trade.orderType === "BUY" ? amount : -amount;
            TOTALPOT += trade.orderType === "BUY" ? amount : -amount;
        }
    }

    if (TOTALPOT === 0) {
        return { message: "Total pot is zero, can't calculate price" };
    }

    const CurrentYesPrice = parseFloat(((YESPOT / TOTALPOT) * 10).toFixed(2));
    const CurrentNoPrice = parseFloat((10 - CurrentYesPrice).toFixed(2));

    return { YesPrice: CurrentYesPrice, NoPrice: CurrentNoPrice };
};




let price = [
    {
        "id": 13,
        "tradeTitle": "sam",
        "price": 7,
        "quantity": 10,
        "tradeLogo": "https://example.com/logo.png",
        "orderType": "BUY",
        "tradeType": "YES",
        "category": "STOCKMARKET",
        "userId": 1,
        "eventId": 4,
        "createdAt": "2025-05-11T22:06:25.556Z"
    },
    {
        "id": 12,
        "tradeTitle": "sam",
        "price": 5,
        "quantity": 10,
        "tradeLogo": "https://example.com/logo.png",
        "orderType": "BUY",
        "tradeType": "YES",
        "category": "STOCKMARKET",
        "userId": 1,
        "eventId": 4,
        "createdAt": "2025-05-11T22:04:23.496Z"
    },
    {
        "id": 11,
        "tradeTitle": "sam",
        "price": 7.5,
        "quantity": 10,
        "tradeLogo": "https://example.com/logo.png",
        "orderType": "BUY",
        "tradeType": "NO",
        "category": "STOCKMARKET",
        "userId": 1,
        "eventId": 4,
        "createdAt": "2025-05-11T21:35:29.143Z"
    },
    {
        "id": 8,
        "tradeTitle": "sam",
        "price": 9,
        "quantity": 10,
        "tradeLogo": "https://example.com/logo.png",
        "orderType": "BUY",
        "tradeType": "NO",
        "category": "STOCKMARKET",
        "userId": 1,
        "eventId": 4,
        "createdAt": "2025-05-11T21:35:13.714Z"
    },
    {
        "id": 8,
        "tradeTitle": "sam",
        "price": 4,
        "quantity": 10,
        "tradeLogo": "https://example.com/logo.png",
        "orderType": "SELL",
        "tradeType": "NO",
        "category": "STOCKMARKET",
        "userId": 1,
        "eventId": 4,
        "createdAt": "2025-05-11T21:35:13.714Z"
    },
    {
        "id": 8,
        "tradeTitle": "sam",
        "price": 10,
        "quantity": 10,
        "tradeLogo": "https://example.com/logo.png",
        "orderType": "SELL",
        "tradeType": "YES",
        "category": "STOCKMARKET",
        "userId": 1,
        "eventId": 4,
        "createdAt": "2025-05-11T21:35:13.714Z"
    }, {
        "id": 8,
        "tradeTitle": "sam",
        "price": 2,
        "quantity": 10,
        "tradeLogo": "https://example.com/logo.png",
        "orderType": "SELL",
        "tradeType": "YES",
        "category": "STOCKMARKET",
        "userId": 1,
        "eventId": 4,
        "createdAt": "2025-05-11T21:35:13.714Z"
    }
]


// let result = PredictPrice(price);
// console.log(result);




















