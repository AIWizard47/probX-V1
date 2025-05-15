import { prisma } from "../../db/db.js";

// Add FAQ
export const addFaq = async (req, res) => {
    const { question, answer } = req.body;
    try {
        const faq = await prisma.fAQ.create({
            data: {
                question,
                answer,
                isActive: false
            }
        });

        return res.status(200).json({ message: "FAQ Added", faq });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Update FAQ
export const updateFaq = async (req, res) => {
    const { question, answer } = req.body;
    const id = Number(req.params.id); // convert id to number

    try {
        const existingFaq = await prisma.fAQ.findUnique({
            where: { id }
        });

        if (!existingFaq) {
            return res.status(404).json({ message: "FAQ not found" });
        }
        const faq = await prisma.fAQ.update({
            where: { id },
            data: { question, answer }
        });

        return res.status(200).json({ message: "FAQ Updated", faq });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Delete FAQ
export const deleteFaq = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const existingFaq = await prisma.fAQ.findUnique({
            where: { id }
        });

        if (!existingFaq) {
            return res.status(404).json({ message: "FAQ not found" });
        }
        const faq = await prisma.fAQ.delete({
            where: { id }
        });

        return res.status(200).json({ message: "FAQ Deleted", faq });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Get All FAQs
export const getAllFaq = async (req, res) => {
    try {
        const faqs = await prisma.fAQ.findMany();
        return res.status(200).json({ faqs });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Toggle isActive
export const toggleIsActiveFaq = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const existingFaq = await prisma.fAQ.findUnique({
            where: { id }
        });

        if (!existingFaq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        const faq = await prisma.fAQ.update({
            where: { id },
            data: { isActive: !existingFaq.isActive }
        });

        return res.status(200).json({ message: "FAQ isActive toggled", faq });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
