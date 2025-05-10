import { prisma } from '../../db/db.js'; // Make sure the path is correct

// get all event
export const getAllEvents = async (req, res) => {
    try {
        const allEvents = await prisma.event.findMany();
        return res.status(200).json({ events: allEvents });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong1" });
    }
};

// Get event by ID
export const getEventById = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const event = await prisma.event.findUnique({ where: { id } });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json({ event });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong3" });
    }
};

//get event by categary
export const getEventsByCategory = async (req, res) => {
    const { category } = req.params; // Access category from URL parameter

    try {
        const events = await prisma.event.findMany({ where: { categary: category } });

        if (events.length === 0) {
            return res.status(404).json({ message: "No events found for this category" });
        }

        return res.status(200).json({ events });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
