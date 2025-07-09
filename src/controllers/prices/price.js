const { PrismaClient, Currency } = require("@prisma/client");
const prisma = require('../../prisma');


const PriceController = {
    getServicesWithPrices: async (req, res) => {
           const preferredCurrency = 'USD';
        try {
            const services = await prisma.service.findMany({
                include: {
                    subServices: {
                        include: {
                            prices: true,
                        },
                    },
                },
            });

            const formatted = services.map((service) => ({
                title: service.name,
                beforeImage: service.beforeImage,
                afterImage: service.afterImage,
                features: service.subServices.map((sub) => {
                    const priceObj =
                        sub.prices.find((p) => p.currency === preferredCurrency) ||
                        sub.prices[0]; // fallback to first available
                    const priceText = priceObj
                        ? ` - ${priceObj.price.toString()} ${priceObj.currency}`
                        : "";
                    return `${sub.name}${priceText}`;
                }),
            }));

            res.json({ services: formatted });
        } catch (err) {
            console.error("Error fetching services with prices:", err);
            res.status(500).json({ error: "Failed to fetch service data" });
        }
    },
}

module.exports = PriceController;