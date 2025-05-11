import express from 'express';
import cors from 'cors'
import authRoutes from './routes/user_routes/auth_routes.js'; // Import the router
import userEventRoutes from './routes/user_routes/events_routes.js';
import adminEventRoutes from './routes/admin_routes/events.routes.js'
import UserMiddleware from './middleware/user_middleware.js';
import { prisma } from './db/db.js'; // Make sure the path is correct


const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON
app.use('/api/user/auth', authRoutes); // Use the imported router

app.use('/api/user/event', userEventRoutes)

app.use('/api/admin/event', adminEventRoutes);

// app.get('/getb', UserMiddleware, async (req, res) => {
//     const userId = req.user;
//     const user = await prisma.user.findFirst({ where: { id: userId } })
//     return res.json({ user })
// })

app.listen(3000, () => console.log("server start"));
