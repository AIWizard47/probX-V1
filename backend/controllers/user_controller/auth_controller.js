import { prisma } from '../../db/db.js'; // Make sure the path is correct
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const jwt_secret = "xxxxxx";

// Signup
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
        const existingUserByUsername = await prisma.user.findUnique({ where: { username } });

        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword, // In production, hash this!
            },
        });

        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Signup failed' });
    }
}

// Login
export const login = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Initialize a variable to hold the user
        let user;

        // Check if email or username is provided, then query the database
        if (email) {
            user = await prisma.user.findUnique({ where: { email } });
        } else if (username) {
            user = await prisma.user.findUnique({ where: { username } });
        }

        // If no user found (either by email or username)
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password (hash) with the stored password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If password doesn't match
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        //provide expiry
        const token = await jwt.sign({
            userId: user.id
        }, jwt_secret);

        // Respond with success and user data if login is successful
        res.json({ message: 'Login successful', token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};