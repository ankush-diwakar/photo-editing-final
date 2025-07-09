const prisma = require("../../prisma");
const { Prisma } = require('@prisma/client');

const priceController = {
    addPrice: async (req, res) => {
        try {
            const { amount, currency, subServiceId } = req.body;
            const price = await prisma.priceByCountry.create({
                data: {
                    price:parseFloat(amount),
                    currency,
                    subService: { connect: { id: Number(subServiceId) } }
                }
            });
            res.status(201).json({ message: "Price created successfully", price });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },
    getAllCurrencies: async (req, res) => {
        try {
            const currencies = await prisma.priceByCountry.findMany({
                select: {
                    currency: true
                },
                distinct: ['currency']
            });
            
            const uniqueCurrencies = currencies.map(c => c.currency);
            res.status(200).json({ currencies: uniqueCurrencies });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    addMultiplePrices: async (req, res) => {
        try {
            const { prices } = req.body;
            if (!Array.isArray(prices) || prices.length === 0) {
                return res.status(400).json({ message: "Invalid input. Expected an array of prices." });
            }
    
            const createdPrices = await prisma.$transaction(
                prices.map(price => 
                    prisma.priceByCountry.create({
                        data: {
                            price: parseFloat(price.price), // Changed from 'amount' to 'price.amount'
                            currency: price.currency,
                            subService: { connect: { id: Number(price.subServiceId) } }
                        }
                    })
                )
            );
    
            res.status(201).json({ message: "Prices created successfully", prices: createdPrices });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },
    getAllPrices: async (req, res) => {
        try {
            const prices = await prisma.priceByCountry.findMany({
                include: { subService: true }
            });
            if (prices.length === 0) {
                return res.status(404).json({ message: "No prices found" });
            }
            res.status(200).json({ prices });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    getPrice: async (req, res) => {
        try {
            const { id } = req.params;
            const price = await prisma.priceByCountry.findUnique({
                where: { id: Number(id) },
                include: { subService: true }
            });
            if (!price) {
                return res.status(404).json({ message: "Price not found" });
            }
            res.status(200).json({ price });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    updatePrice: async (req, res) => {
        try {
            const { id } = req.params;
            const { amount, currency, subServiceId } = req.body;
            const price = await prisma.priceByCountry.update({
                where: { id: Number(id) },
                data: {
                    price: amount ? parseFloat(amount) : undefined,
                    currency, 
                    subService: subServiceId ? { connect: { id: Number(subServiceId) } } : undefined
                }
            });
            res.status(200).json({ message: "Price updated successfully", price });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    deletePrice: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.priceByCountry.delete({
                where: { id: Number(id) }
            });
            res.status(200).json({ message: 'Price deleted successfully' });
        } catch (error) {
            handlePrismaError(error, res);
        }
    }
};

function handlePrismaError(error, res) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return res.status(409).json({ message: "A unique constraint would be violated on Price. Details: " + error.meta.target });
            case 'P2025':
                return res.status(404).json({ message: "Record not found" });
            case 'P2003':
                return res.status(400).json({ message: "Foreign key constraint failed on the field: " + error.meta.field_name });
            default:
                return res.status(400).json({ message: "Database error", error: error.message });
        }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({ message: "Validation error", error: error.message });
    } else {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { priceController };