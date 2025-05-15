import express from 'express';
import cors from 'cors'
import authRoutes from './routes/user_routes/auth_routes.js'; // Import the router
import userEventRoutes from './routes/user_routes/events_routes.js';
import adminEventRoutes from './routes/admin_routes/events.routes.js'
import userTradeRoutes from './routes/user_routes/trade_routes.js';
import adminTradeRoutes from './routes/admin_routes/trade_routes.js'
import UserMiddleware from './middleware/user_middleware.js';
import userDetailRoutes from './routes/user_routes/details_routee.js'
import adminauthRoutes from './routes/admin_routes/auth_routes.js'
import adminFaqRoutes from './routes/admin_routes/faq_routes.js'
import userFaqRoutes from './routes/user_routes/faq_routes.js'
import { prisma } from './db/db.js'; // Make sure the path is correct


const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON
app.use('/api/user/auth', authRoutes); // Use the imported router

app.use('/api/admin/auth', adminauthRoutes);

app.use('/api/user/event', userEventRoutes)

app.use('/api/admin/event', adminEventRoutes);

app.use('/api/user/trade', userTradeRoutes);

app.use('/api/admin/trade', adminTradeRoutes);

app.use('/api/user/userdata', UserMiddleware, userDetailRoutes)

app.use('/api/admin/faq', adminFaqRoutes);

app.use('/api/user/faq', userFaqRoutes);

// app.get('/getb', UserMiddleware, async (req, res) => {
//     const userId = req.user;
//     const user = await prisma.user.findFirst({ where: { id: userId } })
//     return res.json({ user })
// })

app.listen(3000, () => console.log("server start"));