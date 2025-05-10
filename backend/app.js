import express from 'express';
import authRoutes from './routes/user_routes/auth_routes.js'; // Import the router
import UserMiddleware from './middleware/user_middleware.js';
import { prisma } from './db/db.js'; // Make sure the path is correct

const app = express();

app.use(express.json()); // Middleware to parse JSON

app.use('/api/user/auth', authRoutes); // Use the imported router

// app.get('/getb', UserMiddleware, async (req, res) => {
//     const userId = req.user;
//     const user = await prisma.user.findFirst({ where: { id: userId } })
//     return res.json({ user })
// })

app.listen(3000, () => console.log("server start"));
