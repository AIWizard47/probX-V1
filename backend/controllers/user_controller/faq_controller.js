import { prisma } from "../../db/db.js";


// get all faq which is isActive
export const getActivefaq = async (req, res) => {
    try {
        const faqs = await prisma.fAQ.findMany({ where: { isActive: true } });
        return res.status(200).json({ faqs });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}