import { prisma } from "../../db/db.js";

export const getAllPridiction = async (req, res) => {
    const userId = req.user;
    try {
        const predictions = await prisma.prediction.findMany({
            where: {
                userId
            }
        });
        return res.status(200).json({
            predictions
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

export const deletePredictionById = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.prediction.delete({
            where: { id: parseInt(id) },
        });

        return res.status(200).json({ message: "Deleted" });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};
