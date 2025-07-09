
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const testimonialController = {
    getTestimonials: async (req, res) => {
        try {
            const testimonials = await prisma.testimonial.findMany({
                orderBy: { createdAt: 'desc' },
            });
            res.json(testimonials);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching testimonials' });
        }
    }
}

module.exports = { testimonialController };