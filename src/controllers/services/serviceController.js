const { Prisma } = require('@prisma/client');
const prisma = require('../../prisma');


const serviceController = {
    creatService: async (req, res) => {
        try {
            const { name, description } = req.body;
            // const adminRole = req.user.role;
            // if(adminRole != 'SUPER_ADMIN') return res.status(403).json({"message":"You don't have privilages to create services"})
            if (!req.files['beforeImage'] || !req.files['afterImage']) {
                return res.status(400).json({ error: 'Both before and after images are required' });
            }

            const beforeImagePath = `images/${req.files['beforeImage'][0].filename}`;
            const afterImagePath = `images/${req.files['afterImage'][0].filename}`;



            const service = await prisma.service.create({
                data: {
                    name: name,
                    description: description,
                    beforeImage: beforeImagePath,
                    afterImage: afterImagePath
                }
            })
            if (!service) return res.status(404).json({ "message": "Error while adding service" })
            res.status(201).json({ "message": "service created successfully", service });
        } catch (error) {
            handlePrismaError(error, res);
        }

    },
    createService2: async (req, res) => {
        try {
            const { name, description } = req.body;

            if (!req.files['beforeImage'] || !req.files['afterImage']) {
                return res.status(400).json({ error: 'Both before and after images are required' });
            }

            const beforeImagePath = `images/${req.files['beforeImage'][0].filename}`;
            const afterImagePath = `images/${req.files['afterImage'][0].filename}`;

            // Get the current maximum order value
            const maxOrderService = await prisma.service.findFirst({
                orderBy: {
                    order: 'desc'
                },
                select: {
                    order: true
                }
            });

            // Calculate the new order (max + 1 or 1 if no services exist)
            const newOrder = maxOrderService ? maxOrderService.order + 1 : 1;

            const service = await prisma.service.create({
                data: {
                    name: name,
                    description: description,
                    beforeImage: beforeImagePath,
                    afterImage: afterImagePath,
                    order: newOrder  // Set the calculated order
                }
            });

            if (!service) {
                return res.status(404).json({ "message": "Error while adding service" });
            }

            res.status(201).json({
                "message": "Service created successfully",
                service
            });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },
    // getAllServices: async (req, res) => {
    //     try {
    //         const services = await prisma.service.findMany({
    //             include: { subServices: true }
    //         });
    //         if (!services) return res.status(401).json({ "message": "No services found" })
    //         res.status(201).json({ services });
    //     } catch (error) {
    //         handlePrismaError(error, res);
    //     }

    // },
    getAllServices: async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            include: { 
                subServices: {
                    orderBy: {
                        order: 'asc' // Also sort subservices by order
                    }
                } 
            },
            orderBy: {
                order: 'asc' // Sort services by order in ascending order
            }
        });
        
        if (!services || services.length === 0) {
            return res.status(404).json({ "message": "No services found" });
        }
        
        res.status(200).json({ services });
    } catch (error) {
        handlePrismaError(error, res);
    }
},
    getAllFullServices: async (req, res) => {
        try {
            const services = await prisma.service.findMany({
                include: {
                    subServices: {
                        include: {
                            prices: true
                        }
                    }
                }
            });
            if (!services) return res.status(401).json({ "message": "No services found" })
            res.status(201).json({ services });
        } catch (error) {
            handlePrismaError(error, res);
        }

    },
    getService: async (req, res) => {
        try {
            const { id } = req.params;
            const service = await prisma.service.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    subServices: true
                }
            })
            if (!service) return res.status(404).json({ "message": "Service not found!!" });
            res.status(201).json({ service });

        } catch (error) {
            handlePrismaError(error, res);
        }
    },
    updateService: async (req, res) => {
        const { id } = req.params;
        const { name, description } = req.body;
        try {
            let updateData = { name, description };

            if (req.files) {
                if (req.files['beforeImage']) {
                    updateData.beforeImage = `images/${req.files['beforeImage'][0].filename}`;
                }
                if (req.files['afterImage']) {
                    updateData.afterImage = `images/${req.files['afterImage'][0].filename}`;
                }
            }

            const service = await prisma.service.update({
                where: { id: Number(id) },
                data: updateData
            });

            res.json(service);
        } catch (error) {
            handlePrismaError(error, res);
        }
    },



    updateService2: async (req, res) => {
        const { id } = req.params;
        const { name, description, order } = req.body;
        const numOrder = Number(order);
        try {
            // Get the current service to check its existing order
            const currentService = await prisma.service.findUnique({
                where: { id: Number(id) }
            });

            let updateData = { name, description };

            if (req.files) {
                if (req.files['beforeImage']) {
                    updateData.beforeImage = `images/${req.files['beforeImage'][0].filename}`;
                }
                if (req.files['afterImage']) {
                    updateData.afterImage = `images/${req.files['afterImage'][0].filename}`;
                }
            }

            // Only process order shifting if order is provided and different from current
            if (numOrder !== undefined && numOrder !== currentService.order) {
                // Start a transaction to ensure data consistency
                await prisma.$transaction(async (prisma) => {
                    // Shift services down if the new order is occupied
                    if (numOrder < currentService.order) {
                        // Moving up in order - increment orders between new and old
                        await prisma.service.updateMany({
                            where: {
                                order: {
                                    gte: numOrder,
                                    lt: currentService.order
                                },
                                id: { not: Number(id) } // Exclude current service
                            },
                            data: {
                                order: { increment: 1 }
                            }
                        });
                    } else if (numOrder > currentService.order) {
                        // Moving down in order - decrement orders between old and new
                        await prisma.service.updateMany({
                            where: {
                                order: {
                                    gt: currentService.order,
                                    lte: numOrder
                                },
                                id: { not: Number(id) } // Exclude current service
                            },
                            data: {
                                order: { decrement: 1 }
                            }
                        });
                    }

                    // Update the current service's order
                    updateData.order = numOrder;
                });
            }

            const service = await prisma.service.update({
                where: { id: Number(id) },
                data: updateData
            });

            res.json(service);
        } catch (error) {
            handlePrismaError(error, res);
        }
    },





    deleteService: async (req, res) => {
        const { id } = req.params;
        try {
            await prisma.service.delete({
                where: { id: Number(id) }
            });
            res.json({ message: 'Service deleted successfully' });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },
    testService: async (req, res) => {
        if (!req.files['beforeImage'] || !req.files['afterImage']) {
            return res.status(400).json({ error: 'Both before and after images are required' });
        }

        const beforeImagePath = req.files['beforeImage'][0].path;
        const afterImagePath = req.files['afterImage'][0].path;

        console.log(beforeImagePath, afterImagePath);
    }
}

function handlePrismaError(error, res) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        switch (error.code) {
            case 'P2002':
                return res.status(409).json({ message: "A unique constraint would be violated on Service. Details: " + error.meta.target });
            case 'P2025':
                return res.status(404).json({ message: "Record not found" });
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
module.exports = { serviceController };