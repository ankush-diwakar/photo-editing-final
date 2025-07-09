const { Prisma } = require('@prisma/client');
const prisma = require('../../prisma');
const multer = require('multer')

const gallaryController = {


// // Add this new function for bulk updating display orders
updateDisplayOrders: async (req, res) => {
    try {
        const { items } = req.body; // Array of {id, displayOrder}
        
        // Use transaction to update all items
        await prisma.$transaction(
            items.map(item => 
                prisma.galleryShowcase.update({
                    where: { id: parseInt(item.id) },
                    data: { displayOrder: parseInt(item.displayOrder) }
                })
            )
        );

        res.json({ message: 'Display orders updated successfully' });
    } catch (error) {
        console.error('Error updating display orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
},

// // Update the getAllGallaryItems function to include proper ordering
// getAllGallaryItems: async (req, res) => {
//     try {
//         const galleryItems = await prisma.galleryShowcase.findMany({
//             include: {
//                 service: true
//             },
//             orderBy: { displayOrder: 'asc' }
//         });
//         res.json(galleryItems);
//     } catch (error) {
//         console.error('Error fetching gallery items:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// },

//new new new 
// Update the addNewGallaryItem function
// addNewGallaryItem: async (req, res) => {
//     try {
//         const { title, description, serviceId, displayOrder } = req.body;
       
//         if (!req.uploadedFiles || !req.uploadedFiles.beforeImage || !req.uploadedFiles.afterImage) {
//             return res.status(400).json({ error: 'Both before and after images are required' });
//         }

//         let finalDisplayOrder;
        
//         if (displayOrder !== undefined && displayOrder !== null) {
//             // Use the provided displayOrder
//             finalDisplayOrder = parseInt(displayOrder);
//         } else {
//             // Get current max displayOrder for this specific service to place new item at the end
//             const maxOrderItem = await prisma.galleryShowcase.findFirst({
//                 where: { serviceId: parseInt(serviceId) },
//                 orderBy: { displayOrder: 'desc' },
//                 select: { displayOrder: true }
//             });
//             finalDisplayOrder = maxOrderItem ? maxOrderItem.displayOrder + 1 : 1;
//         }

//         const galleryEntry = await prisma.galleryShowcase.create({
//             data: {
//                 title,
//                 description: description || null,
//                 beforeImage: req.uploadedFiles.beforeImage,
//                 afterImage: req.uploadedFiles.afterImage,
//                 serviceId: parseInt(serviceId),
//                 displayOrder: finalDisplayOrder
//             },
//             include: {
//                 service: true
//             }
//         });

//         res.status(201).json(galleryEntry);
//     } catch (error) {
//         console.error('Error creating gallery entry:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// },

// // Update the updateGallaryItem function
// updateGallaryItem: async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { title, description, serviceId, displayOrder } = req.body;
        
//         const updateData = {
//             title,
//             description: description || null,
//             serviceId: parseInt(serviceId),
//         };

//         // Add displayOrder if provided
//         if (displayOrder !== undefined && displayOrder !== null) {
//             updateData.displayOrder = parseInt(displayOrder);
//         }

//         // Add images if uploaded
//         if (req.uploadedFiles) {
//             if (req.uploadedFiles.beforeImage) {
//                 updateData.beforeImage = req.uploadedFiles.beforeImage;
//             }
//             if (req.uploadedFiles.afterImage) {
//                 updateData.afterImage = req.uploadedFiles.afterImage;
//             }
//         }

//         const updatedGalleryEntry = await prisma.galleryShowcase.update({
//             where: { id: parseInt(id) },
//             data: updateData,
//             include: {
//                 service: true
//             }
//         });

//         res.json(updatedGalleryEntry);
//     } catch (error) {
//         console.error('Error updating gallery entry:', error);
//         // res.status(500).json({ error: 'Internal server error' });
//     }
// },

// // Update the getAllGallaryItems function to include proper ordering by service and then by displayOrder
// getAllGallaryItems: async (req, res) => {
//     try {
//         const galleryItems = await prisma.galleryShowcase.findMany({
//             include: {
//                 service: true
//             },
//             orderBy: [
//                 { serviceId: 'asc' },
//                 { displayOrder: 'asc' }
//             ]
//         });
//         res.json(galleryItems);
//     } catch (error) {
//         console.error('Error fetching gallery items:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// },


// Update the updateGallaryItem function with order shifting logic
updateGallaryItem: async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, serviceId, displayOrder } = req.body;
        
        const currentItem = await prisma.galleryShowcase.findUnique({
            where: { id: parseInt(id) },
            select: { serviceId: true, displayOrder: true }
        });

        if (!currentItem) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        const newServiceId = parseInt(serviceId);
        const newDisplayOrder = parseInt(displayOrder);
        const oldServiceId = currentItem.serviceId;
        const oldDisplayOrder = currentItem.displayOrder;

        // Start a transaction to handle order shifting
        await prisma.$transaction(async (prisma) => {
            // If service changed or order changed, we need to handle shifting
            if (newServiceId !== oldServiceId || newDisplayOrder !== oldDisplayOrder) {
                
                // If service changed, handle old service orders
                if (newServiceId !== oldServiceId) {
                    // Shift down items in old service that were after the old position
                    await prisma.galleryShowcase.updateMany({
                        where: {
                            serviceId: oldServiceId,
                            displayOrder: { gt: oldDisplayOrder }
                        },
                        data: {
                            displayOrder: { decrement: 1 }
                        }
                    });
                }

                // Handle new service orders
                if (newServiceId !== oldServiceId) {
                    // Shift up items in new service that are at or after the new position
                    await prisma.galleryShowcase.updateMany({
                        where: {
                            serviceId: newServiceId,
                            displayOrder: { gte: newDisplayOrder }
                        },
                        data: {
                            displayOrder: { increment: 1 }
                        }
                    });
                } else {
                    // Same service, different order
                    if (newDisplayOrder < oldDisplayOrder) {
                        // Moving up: shift down items between new and old position
                        await prisma.galleryShowcase.updateMany({
                            where: {
                                serviceId: newServiceId,
                                displayOrder: { gte: newDisplayOrder, lt: oldDisplayOrder },
                                id: { not: parseInt(id) }
                            },
                            data: {
                                displayOrder: { increment: 1 }
                            }
                        });
                    } else if (newDisplayOrder > oldDisplayOrder) {
                        // Moving down: shift up items between old and new position
                        await prisma.galleryShowcase.updateMany({
                            where: {
                                serviceId: newServiceId,
                                displayOrder: { gt: oldDisplayOrder, lte: newDisplayOrder },
                                id: { not: parseInt(id) }
                            },
                            data: {
                                displayOrder: { decrement: 1 }
                            }
                        });
                    }
                }
            }

            // Update the main item
            const updateData = {
                title,
                description: description || null,
                serviceId: newServiceId,
                displayOrder: newDisplayOrder
            };

            // Add images if uploaded
            if (req.uploadedFiles) {
                if (req.uploadedFiles.beforeImage) {
                    updateData.beforeImage = req.uploadedFiles.beforeImage;
                }
                if (req.uploadedFiles.afterImage) {
                    updateData.afterImage = req.uploadedFiles.afterImage;
                }
            }

            await prisma.galleryShowcase.update({
                where: { id: parseInt(id) },
                data: updateData
            });
        });

        // Fetch the updated item with service info
        const updatedGalleryEntry = await prisma.galleryShowcase.findUnique({
            where: { id: parseInt(id) },
            include: {
                service: true
            }
        });

        res.json(updatedGalleryEntry);
    } catch (error) {
        console.error('Error updating gallery entry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
},

// Update addNewGallaryItem to handle order shifting when adding
addNewGallaryItem: async (req, res) => {
    try {
        const { title, description, serviceId, displayOrder } = req.body;
       
        if (!req.uploadedFiles || !req.uploadedFiles.beforeImage || !req.uploadedFiles.afterImage) {
            return res.status(400).json({ error: 'Both before and after images are required' });
        }

        const newServiceId = parseInt(serviceId);
        let finalDisplayOrder;
        
        if (displayOrder !== undefined && displayOrder !== null && displayOrder !== '') {
            finalDisplayOrder = parseInt(displayOrder);
            
            // Shift existing items in the service that are at or after this position
            await prisma.galleryShowcase.updateMany({
                where: {
                    serviceId: newServiceId,
                    displayOrder: { gte: finalDisplayOrder }
                },
                data: {
                    displayOrder: { increment: 1 }
                }
            });
        } else {
            // Get current max displayOrder for this specific service
            const maxOrderItem = await prisma.galleryShowcase.findFirst({
                where: { serviceId: newServiceId },
                orderBy: { displayOrder: 'desc' },
                select: { displayOrder: true }
            });
            finalDisplayOrder = maxOrderItem ? maxOrderItem.displayOrder + 1 : 1;
        }

        const galleryEntry = await prisma.galleryShowcase.create({
            data: {
                title,
                description: description || null,
                beforeImage: req.uploadedFiles.beforeImage,
                afterImage: req.uploadedFiles.afterImage,
                serviceId: newServiceId,
                displayOrder: finalDisplayOrder
            },
            include: {
                service: true
            }
        });

        res.status(201).json(galleryEntry);
    } catch (error) {
        console.error('Error creating gallery entry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
},













    // addNewGallaryItem: async (req, res) => {
    //     try {
    //         const { title, description, serviceId } = req.body;
           
    //         if (!req.uploadedFiles || !req.uploadedFiles.beforeImage || !req.uploadedFiles.afterImage) {
    //             return res.status(400).json({ error: 'Both before and after images are required' });
    //         }

    //         // Get current max displayOrder to place new item at the end
    //         const maxOrderItem = await prisma.galleryShowcase.findFirst({
    //             orderBy: { displayOrder: 'desc' },
    //             select: { displayOrder: true }
    //         });

    //         const galleryEntry = await prisma.galleryShowcase.create({
    //             data: {
    //                 title,
    //                 description: description || null,
    //                 beforeImage: req.uploadedFiles.beforeImage,
    //                 afterImage: req.uploadedFiles.afterImage,
    //                 serviceId: parseInt(serviceId),
    //                 displayOrder: maxOrderItem ? maxOrderItem.displayOrder + 1 : 0
    //             }
    //         });

    //         res.status(201).json(galleryEntry);
    //     } catch (error) {
    //         console.error('Error creating gallery entry:', error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // },

    getAllGallayItems: async (req, res) => {
        try {
            const items = await prisma.galleryShowcase.findMany({
                include: { service: true },
                orderBy: { displayOrder: 'asc' }
            });
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch gallery items' });
        }
    },

    getGroupedGalleryItems: async (req, res) => {
        try {
            const galleryEntries = await prisma.galleryShowcase.findMany({
                include: {
                    service: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: [
                    { displayOrder: 'asc' },
                    { createdAt: 'desc' }
                ]
            });

            const grouped = galleryEntries.reduce((acc, item) => {
                const serviceId = item.service.id;
                if (!acc[serviceId]) {
                    acc[serviceId] = {
                        service: item.service,
                        items: []
                    };
                }
                acc[serviceId].items.push(item);
                return acc;
            }, {});

            res.json(Object.values(grouped));
        } catch (error) {
            console.error('Error fetching gallery entries:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // updateGallaryItem: async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const { title, description, serviceId, displayOrder } = req.body;

    //         const updateData = {
    //             title,
    //             description: description || null,
    //             serviceId: parseInt(serviceId),
    //             displayOrder: parseInt(displayOrder)
    //         };

    //         if (req.uploadedFiles?.beforeImage) {
    //             updateData.beforeImage = req.uploadedFiles.beforeImage;
    //         }
    //         if (req.uploadedFiles?.afterImage) {
    //             updateData.afterImage = req.uploadedFiles.afterImage;
    //         }

    //         const updatedItem = await prisma.galleryShowcase.update({
    //             where: { id: parseInt(id) },
    //             data: updateData,
    //             include: {
    //                 service: {
    //                     select: {
    //                         id: true,
    //                         name: true
    //                     }
    //                 }
    //             }
    //         });

    //         res.json(updatedItem);
    //     } catch (error) {
    //         console.error('Error updating gallery item:', error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // },

    reorderGalleryItems: async (req, res) => {
        try {
            const { orderedIds } = req.body;
            
            const updatePromises = orderedIds.map((id, index) => 
                prisma.galleryShowcase.update({
                    where: { id },
                    data: { displayOrder: index }
                })
            );
            
            await Promise.all(updatePromises);
            res.json({ message: 'Items reordered successfully' });
        } catch (error) {
            console.error('Error reordering items:', error);
            res.status(500).json({ error: 'Failed to reorder items' });
        }
    },

    deleteGallaryItem: async (req, res) => {
        try {
            const { id } = req.params;

            await prisma.galleryShowcase.delete({
                where: { id: parseInt(id) }
            });

            res.json({ message: 'Gallery item deleted successfully' });
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getAllServices: async (req, res) => {
        try {
            const services = await prisma.service.findMany({
                select: {
                    id: true,
                    name: true
                },
                orderBy: {
                    name: 'asc'
                }
            });

            res.json(services);
        } catch (error) {
            console.error('Error fetching services:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = { gallaryController };