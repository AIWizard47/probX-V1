import { prisma } from "../../db/db.js";

export const getAllPridiction = async (req, res) => {
    try {
        const predictions = await prisma.prediction.findMany();
        return res.status(200).json({
            predictions
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}
