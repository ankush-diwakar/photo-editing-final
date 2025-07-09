const prisma = require("../../prisma");
const { Prisma } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const subServicesController = {
    createSubService: async (req, res) => {
        try {
            const { name, description, serviceId } = req.body;
            const subService = await prisma.subService.create({
                data: {
                    name,
                    description,
                    service: { connect: { id: Number(serviceId) } }
                }
            });
            res.status(201).json({ message: "SubService created successfully", subService });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },
    getSubServicesByServiceId: async (req, res) => {
        try {
            const { serviceId } = req.query;
            console.log('Fetching subservices for serviceId:', serviceId);

            if (!serviceId) {
                return res.status(400).json({ message: "serviceId is required" });
            }

            const subServices = await prisma.subService.findMany({
                where: {
                    serviceId: Number(serviceId)
                },
                include: { prices: true }
            });

            console.log(`Found ${subServices.length} subservices for serviceId ${serviceId}`);
            res.status(200).json({ subServices });
        } catch (error) {
            console.error('Error in getSubServicesByServiceId:', error);
            handlePrismaError(error, res);
        }
    },
    createManySubServices: async (req, res) => {
        try {
            const { subServices } = req.body;
            if (!Array.isArray(subServices) || subServices.length === 0) {
                return res.status(400).json({ message: "Invalid input: subServices must be a non-empty array" });
            }

            const createdSubServices = await prisma.subService.createMany({
                data: subServices.map(subService => ({
                    name: subService.name,
                    description: subService.description,
                    serviceId: Number(subService.serviceId)
                })),
                skipDuplicates: true
            });

            res.status(201).json({
                message: "SubServices created successfully",
                count: createdSubServices.count
            });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    createSubServiceWithPrices: async (req, res) => {
        try {
            const { name, description, serviceId, prices } = req.body;

            // Validate input
            if (!name || !description || !serviceId || !Array.isArray(prices) || prices.length === 0) {
                return res.status(400).json({ message: "Invalid input. Please provide name, description, serviceId, and an array of prices." });
            }

            // Use a transaction to ensure both subservice and prices are created or neither is
            const result = await prisma.$transaction(async (prisma) => {
                // Create SubService
                const subService = await prisma.subService.create({
                    data: {
                        name,
                        description,
                        service: { connect: { id: Number(serviceId) } }
                    }
                });

                // Create Prices
                const createdPrices = await Promise.all(
                    prices.map(price =>
                        prisma.priceByCountry.create({
                            data: {
                                price: parseFloat(price.price),
                                currency: price.currency,
                                subService: { connect: { id: subService.id } }
                            }
                        })
                    )
                );

                return { subService, prices: createdPrices };
            });

            res.status(201).json({
                message: "SubService and prices created successfully",
                subService: result.subService,
                prices: result.prices
            });

        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    createSubServiceWithPricesAndImages: async (req, res) => {
        try {
            const { name, description, serviceId } = req.body;
            let prices = req.body.prices;

            // Parse the prices string into an array
            try {
                prices = JSON.parse(prices);
            } catch (e) {
                return res.status(400).json({
                    message: "Invalid prices format. Must be valid JSON array. Example: [{\"price\":\"100\",\"currency\":\"USD\"}]",
                    error: e.message
                });
            }

            // Validate input
            if (!name || !description || !serviceId || !Array.isArray(prices) || prices.length === 0) {
                return res.status(400).json({
                    message: "Invalid input. Please provide name, description, serviceId, and an array of prices.",
                    received: {
                        name: !!name,
                        description: !!description,
                        serviceId: !!serviceId,
                        pricesIsArray: Array.isArray(prices),
                        pricesLength: prices?.length
                    }
                });
            }

            // Check if files were uploaded
            if (!req.files?.beforeImage?.[0] || !req.files?.afterImage?.[0]) {
                return res.status(400).json({
                    message: "Both beforeImage and afterImage files are required.",
                    filesReceived: {
                        beforeImage: !!req.files?.beforeImage,
                        afterImage: !!req.files?.afterImage
                    }
                });
            }

            // Use a transaction
            const result = await prisma.$transaction(async (prisma) => {
                // Create SubService
                const subService = await prisma.subService.create({
                    data: {
                        name,
                        description,
                        beforeImage: `images/${req.files.beforeImage[0].filename}`,
                        afterImage: `images/${req.files.afterImage[0].filename}`,
                        service: { connect: { id: Number(serviceId) } }
                    }
                });

                // Create Prices
                const createdPrices = await Promise.all(
                    prices.map(price =>
                        prisma.priceByCountry.create({
                            data: {
                                price: parseFloat(price.price),
                                currency: price.currency,
                                subService: { connect: { id: subService.id } }
                            }
                        })
                    )
                );

                return { subService, prices: createdPrices };
            });

            res.status(201).json({
                message: "SubService and prices created successfully",
                data: result
            });

        } catch (error) {
            // Cleanup uploaded files if error occurred
            if (req.files?.beforeImage?.[0]) {
                fs.unlinkSync(req.files.beforeImage[0].path);
            }
            if (req.files?.afterImage?.[0]) {
                fs.unlinkSync(req.files.afterImage[0].path);
            }

            handlePrismaError(error, res);
        }
    },
    createSubServiceWithPricesAndImages2: async (req, res) => {
    try {
        const { name, description, serviceId } = req.body;
        let prices = req.body.prices;

        // Parse the prices string into an array
        try {
            prices = JSON.parse(prices);
        } catch (e) {
            return res.status(400).json({
                message: "Invalid prices format. Must be valid JSON array. Example: [{\"price\":\"100\",\"currency\":\"USD\"}]",
                error: e.message
            });
        }

        // Validate input
        if (!name || !description || !serviceId || !Array.isArray(prices) || prices.length === 0) {
            return res.status(400).json({
                message: "Invalid input. Please provide name, description, serviceId, and an array of prices.",
                received: {
                    name: !!name,
                    description: !!description,
                    serviceId: !!serviceId,
                    pricesIsArray: Array.isArray(prices),
                    pricesLength: prices?.length
                }
            });
        }

        // Check if files were uploaded
        if (!req.files?.beforeImage?.[0] || !req.files?.afterImage?.[0]) {
            return res.status(400).json({
                message: "Both beforeImage and afterImage files are required.",
                filesReceived: {
                    beforeImage: !!req.files?.beforeImage,
                    afterImage: !!req.files?.afterImage
                }
            });
        }

        // Use a transaction
        const result = await prisma.$transaction(async (prisma) => {
            // Get the current maximum order value for subservices of this service
            const maxOrderSubService = await prisma.subService.findFirst({
                where: { serviceId: Number(serviceId) },
                orderBy: { order: 'desc' },
                select: { order: true }
            });

            // Calculate the new order (max + 1 or 1 if no subservices exist for this service)
            const newOrder = maxOrderSubService ? maxOrderSubService.order + 1 : 1;

            // Create SubService with automatic order assignment
            const subService = await prisma.subService.create({
                data: {
                    name,
                    description,
                    beforeImage: `images/${req.files.beforeImage[0].filename}`,
                    afterImage: `images/${req.files.afterImage[0].filename}`,
                    order: newOrder, // Set the calculated order
                    service: { connect: { id: Number(serviceId) } }
                }
            });

            // Create Prices
            const createdPrices = await Promise.all(
                prices.map(price =>
                    prisma.priceByCountry.create({
                        data: {
                            price: parseFloat(price.price),
                            currency: price.currency,
                            subService: { connect: { id: subService.id } }
                        }
                    })
                )
            );

            return { subService, prices: createdPrices };
        });

        res.status(201).json({
            message: "SubService and prices created successfully",
            data: result
        });

    } catch (error) {
        // Cleanup uploaded files if error occurred
        if (req.files?.beforeImage?.[0]) {
            fs.unlinkSync(req.files.beforeImage[0].path);
        }
        if (req.files?.afterImage?.[0]) {
            fs.unlinkSync(req.files.afterImage[0].path);
        }

        handlePrismaError(error, res);
    }
},

    updateSubServiceWithPrices: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, serviceId, prices } = req.body;

            // Parse prices if sent as string
            let parsedPrices = [];
            if (prices) {
                try {
                    parsedPrices = typeof prices === 'string' ? JSON.parse(prices) : prices;
                } catch (e) {
                    return res.status(400).json({
                        message: "Invalid prices format. Must be valid JSON array.",
                        example: '[{"price":"100","currency":"USD"}]'
                    });
                }
            }

            // Validate input
            if (!name && !description && !serviceId && !parsedPrices.length) {
                return res.status(400).json({
                    message: "Provide at least one field to update (name, description, serviceId, or prices)"
                });
            }

            // Transaction for atomic updates
            const result = await prisma.$transaction(async (prisma) => {
                // Update SubService
                const updatedSubService = await prisma.subService.update({
                    where: { id: Number(id) },
                    data: {
                        ...(name && { name }),
                        ...(description && { description }),
                        ...(serviceId && { serviceId: Number(serviceId) }),
                        ...(req.files?.beforeImage?.[0] && {
                            beforeImage: `images/${req.files.beforeImage[0].filename}`
                        }),
                        ...(req.files?.afterImage?.[0] && {
                            afterImage: `images/${req.files.afterImage[0].filename}`
                        })
                    }
                });

                // Update Prices (delete existing and create new)
                if (parsedPrices.length > 0) {
                    await prisma.priceByCountry.deleteMany({
                        where: { subServiceId: Number(id) }
                    });

                    const createdPrices = await Promise.all(
                        parsedPrices.map(price =>
                            prisma.priceByCountry.create({
                                data: {
                                    price: parseFloat(price.price),
                                    currency: price.currency,
                                    subService: { connect: { id: Number(id) } }
                                }
                            })
                        )
                    );
                    return { subService: updatedSubService, prices: createdPrices };
                }

                return { subService: updatedSubService };
            });

            res.status(200).json({
                message: "SubService updated successfully",
                data: result
            });

        } catch (error) {
            // Cleanup uploaded files if error occurred
            if (req.files?.beforeImage?.[0]) fs.unlinkSync(req.files.beforeImage[0].path);
            if (req.files?.afterImage?.[0]) fs.unlinkSync(req.files.afterImage[0].path);

            handlePrismaError(error, res);
        }
    },



    updateSubServiceWithPrices2: async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, serviceId, prices, order } = req.body;

        // Parse prices if sent as string
        let parsedPrices = [];
        if (prices) {
            try {
                parsedPrices = typeof prices === 'string' ? JSON.parse(prices) : prices;
            } catch (e) {
                return res.status(400).json({
                    message: "Invalid prices format. Must be valid JSON array.",
                    example: '[{"price":"100","currency":"USD"}]'
                });
            }
        }

        // Validate input
        if (!name && !description && !serviceId && !parsedPrices.length && order === undefined) {
            return res.status(400).json({
                message: "Provide at least one field to update (name, description, serviceId, prices, or order)"
            });
        }

        // Get current subservice data
        const currentSubService = await prisma.subService.findUnique({
            where: { id: Number(id) }
        });

        // Transaction for atomic updates
        const result = await prisma.$transaction(async (prisma) => {
            // Handle order update if provided
            if (order !== undefined && order !== currentSubService.order) {
                const numericOrder = Number(order);
                const numericId = Number(id);
                const currentServiceId = serviceId ? Number(serviceId) : currentSubService.serviceId;

                if (numericOrder < currentSubService.order) {
                    // Moving up in order - increment orders between new and old
                    await prisma.subService.updateMany({
                        where: {
                            order: {
                                gte: numericOrder,
                                lt: currentSubService.order
                            },
                            serviceId: currentServiceId,
                            id: { not: numericId }
                        },
                        data: {
                            order: { increment: 1 }
                        }
                    });
                } else if (numericOrder > currentSubService.order) {
                    // Moving down in order - decrement orders between old and new
                    await prisma.subService.updateMany({
                        where: {
                            order: {
                                gt: currentSubService.order,
                                lte: numericOrder
                            },
                            serviceId: currentServiceId,
                            id: { not: numericId }
                        },
                        data: {
                            order: { decrement: 1 }
                        }
                    });
                }
            }

            // Update SubService
            const updatedSubService = await prisma.subService.update({
                where: { id: Number(id) },
                data: {
                    ...(name && { name }),
                    ...(description && { description }),
                    ...(serviceId && { serviceId: Number(serviceId) }),
                    ...(order !== undefined && { order: Number(order) }),
                    ...(req.files?.beforeImage?.[0] && {
                        beforeImage: `images/${req.files.beforeImage[0].filename}`
                    }),
                    ...(req.files?.afterImage?.[0] && {
                        afterImage: `images/${req.files.afterImage[0].filename}`
                    })
                }
            });

            // Update Prices (delete existing and create new)
            if (parsedPrices.length > 0) {
                await prisma.priceByCountry.deleteMany({
                    where: { subServiceId: Number(id) }
                });

                const createdPrices = await Promise.all(
                    parsedPrices.map(price =>
                        prisma.priceByCountry.create({
                            data: {
                                price: parseFloat(price.price),
                                currency: price.currency,
                                subService: { connect: { id: Number(id) } }
                            }
                        })
                    )
                );
                return { subService: updatedSubService, prices: createdPrices };
            }

            return { subService: updatedSubService };
        });

        res.status(200).json({
            message: "SubService updated successfully",
            data: result
        });

    } catch (error) {
        // Cleanup uploaded files if error occurred
        if (req.files?.beforeImage?.[0]) fs.unlinkSync(req.files.beforeImage[0].path);
        if (req.files?.afterImage?.[0]) fs.unlinkSync(req.files.afterImage[0].path);

        handlePrismaError(error, res);
    }
},


    deleteSubServiceUpdated: async (req, res) => {
        try {
            const { id } = req.params;

            // First fetch to get image paths for cleanup
            const subService = await prisma.subService.findUnique({
                where: { id: Number(id) },
                select: { beforeImage: true, afterImage: true }
            });

            if (!subService) {
                return res.status(404).json({ message: "SubService not found" });
            }

            // Transaction for atomic deletion
            await prisma.$transaction(async (prisma) => {
                // Delete prices first (due to foreign key)
                await prisma.priceByCountry.deleteMany({
                    where: { subServiceId: Number(id) }
                });

                // Delete subservice
                await prisma.subService.delete({
                    where: { id: Number(id) }
                });
            });

            res.status(200).json({ message: "SubService deleted successfully" });

        } catch (error) {
            handlePrismaError(error, res);
        }
    },


    getAllSubServicesWithId: async (req, res) => {
    try {
         const id = parseInt(req.params.id, 10); // Convert string to integer

        const subServices = await prisma.subService.findMany({
            where: {
                serviceId: id, // filter by serviceId
            },
            include: {
                service: true,
                prices: true,
            },
        });

        if (subServices.length === 0) {
            return res.status(404).json({ message: "No SubServices found for this serviceId" });
        }

        res.status(200).json({ subServices });
    } catch (error) {
        handlePrismaError(error, res);
    }
},

    updateMissingPricesForAllSubServices: async (req, res) => {
        try {
            const allSubServices = await prisma.subService.findMany();

            const pricesToAdd = [
                { currency: "USD", price: 49.99 },
                { currency: "INR", price: 7499.25 }
            ];

            await prisma.$transaction(async (tx) => {
                for (const subService of allSubServices) {
                    for (const price of pricesToAdd) {
                        // Check if price already exists for the same currency
                        const existing = await tx.priceByCountry.findFirst({
                            where: {
                                subServiceId: subService.id,
                                currency: price.currency
                            }
                        });

                        if (!existing) {
                            await tx.priceByCountry.create({
                                data: {
                                    subServiceId: subService.id,
                                    currency: price.currency,
                                    price: price.price
                                }
                            });
                        } else {
                            await tx.priceByCountry.update({
                                where: { id: existing.id },
                                data: { price: price.price }
                            });
                        }
                    }
                }
            });

            res.status(200).json({ message: "Prices updated for all subservices successfully." });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating prices for subservices", error });
        }
    },



    getAllSubServices: async (req, res) => {
        try {
            const subServices = await prisma.subService.findMany({
                include: { service: true, prices: true }
            });
            if (subServices.length === 0) {
                return res.status(404).json({ message: "No SubServices found" });
            }
            res.status(200).json({ subServices });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    getSubService: async (req, res) => {
        try {
            const { id } = req.params;
            const subService = await prisma.subService.findUnique({
                where: { id: Number(id) },
                include: { service: true, prices: true }
            });
            if (!subService) {
                return res.status(404).json({ message: "SubService not found" });
            }
            res.status(200).json({ subService });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    getServiceWithSubServices: async (req, res) => {
        try {
        const { id } = req.params;
        const service = await prisma.service.findUnique({
            where: { id: Number(id) },
            include: { 
                subServices: {
                    include: { prices: true }
                }
            }
        });
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        console.log("---------",service.subServices);
        // Sort subservices by order field
        service.subServices.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        res.status(200).json({ service });
    } catch (error) {
        handlePrismaError(error, res);
    }
},

    updateSubService: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, serviceId } = req.body;
            const subService = await prisma.subService.update({
                where: { id: Number(id) },
                data: {
                    name,
                    description,
                    service: serviceId ? { connect: { id: Number(serviceId) } } : undefined
                }
            });
            res.status(200).json({ message: "SubService updated successfully", subService });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    deleteSubService: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.subService.delete({
                where: { id: Number(id) }
            });
            res.status(200).json({ message: 'SubService deleted successfully' });
        } catch (error) {
            handlePrismaError(error, res);
        }
    }
};

function handlePrismaError(error, res) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        switch (error.code) {
            case 'P2002':
                return res.status(409).json({ message: "A unique constraint would be violated on SubService. Details: " + error.meta.target });
            case 'P2025':
                return res.status(404).json({ message: "Record not found" });
            case 'P2003':
                return res.status(400).json({ message: "Foreign key constraint failed on the field: " + error.meta.field_name });
            default:
                return res.status(400).json({ message: "Database error", error: error.message });
        }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
        // Handle validation errors
        return res.status(400).json({ message: "Validation error", error: error.message });
    } else {
        // Handle other types of errors
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { subServicesController };