import { prisma } from '../../db/db.js';

export const getAllEvents = async (req, res) => {
    try {
        const allEvents = await prisma.event.findMany();
        return res.status(200).json({ events: allEvents });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
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
        return res.status(500).json({ message: "Something went wrong" });
    }
};


// create event
export const addEvent = async (req, res) => {
    const { eventTitle, cratedTime, startTime, endTime, eventLogo, details, categary, description } = req.body;
    if (!eventLogo || !eventTitle || !cratedTime || !startTime || !details || !endTime || !eventLogo || !categary) {
        return res.status(400).json({ message: "All field required" });
    }
    try {
        const event = await prisma.event.create({
            data: {
                eventTitle,
                cratedTime,
                startTime,
                endTime,
                eventLogo,
                categary,
                description,
                details
            }

        })

        return res.status(200).json({ message: "event created", event });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}


// Update event
export const updateEvent = async (req, res) => {
    const id = parseInt(req.params.id);
    const { eventTitle, createdTime, startTime, endTime, details, eventLogo, categary, description } = req.body;

    try {
        const isExitevent = await prisma.event.findUnique({ where: { id } });

        if (!isExitevent) {
            return res.status(404).json({ message: "Event not found" });
        }

        const event = await prisma.event.update({
            where: { id: parseInt(id) },
            data: {
                eventTitle,
                cratedTime: createdTime,
                startTime,
                endTime,
                eventLogo,
                categary,
                description,
                details
            }
        });

        return res.status(200).json({ message: "Event updated", event });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Update failed or event not found" });
    }
};


// Delete event
export const deleteEvent = async (req, res) => {
    const id = parseInt(req.params.id); // ✅ Correct extraction and parsing

    try {
        const isExitevent = await prisma.event.findUnique({ where: { id } });

        if (!isExitevent) {
            return res.status(404).json({ message: "Event not found" });
        }

        await prisma.event.delete({ where: { id } });

        return res.status(200).json({ message: "Event deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const getEventsByCategory = async (req, res) => {
    const { category } = req.params; // Access category from URL parameter

    try {
        const events = await prisma.event.findMany({ where: { categary: category } });

        // if (events.length === 0) {
        //     return res.status(404).json({ message: "No events found for this category" });
        // }

        return res.status(200).json({ events });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


export const searchEvents = async (req, res) => {
    const { query } = req.params;  // Assuming you pass search text as a param

    try {
        const events = await prisma.event.findMany({
            where: {
                OR: [
                    {
                        eventTitle: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        details: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
        });

        // if (events.length === 0) {
        //   return res.status(404).json({ message: "No events found matching your search" });
        // }

        return res.status(200).json({ events });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
