import { prisma } from '../../db/db.js'; // Ensure path is correct

export const getUserNameAndBalance = async (req, res) => {
    const userId = req.user; // Make sure middleware sets this correctly

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { username: true, balance: true }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            username: user.username,
            balance: user.balance
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
