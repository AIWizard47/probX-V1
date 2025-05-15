import jwt from 'jsonwebtoken';
const jwt_secret = "xxxxxx";

export default async function AdminMiddleware(req, res, next) {
    // Access the token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        // Verify the token using the secret
        const decoded = await jwt.verify(token, jwt_secret);

        // Store the decoded user information in req.user (or another custom property)
        req.admin = decoded.userId;

        // Pass control to the next middleware/route handler
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized admin" });
    }
}
