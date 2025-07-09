// const { PrismaClient } = require('@prisma/client');
// const path = require('path');
// const fs = require('fs');
// const prisma = new PrismaClient();

// const serviceImageController = {
//   // Get all services for dropdown
//   getAllServices: async (req, res) => {
//     try {
//       const services = await prisma.service.findMany({
//         select: {
//           id: true,
//           name: true
//         },
//         orderBy: {
//           order: 'asc'
//         }
//       });
//       res.json(services);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

//   // Get images for a specific service
//   getServiceImages: async (req, res) => {
//     try {
//       const { serviceId } = req.params;
//       const { page = 1, limit = 12 } = req.query;
      
//       const skip = (parseInt(page) - 1) * parseInt(limit);
      
//       const [images, total] = await Promise.all([
//         prisma.serviceImageCarousel.findMany({
//           where: { serviceId: parseInt(serviceId) },
//           orderBy: { order: 'asc' },
//           skip,
//           take: parseInt(limit)
//         }),
//         prisma.serviceImageCarousel.count({
//           where: { serviceId: parseInt(serviceId) }
//         })
//       ]);

//       // Add full image URLs
//       const imagesWithUrls = images.map(image => ({
//         ...image,
//         imageUrl: `/uploads/service-images/${image.imageName}`
//       }));

//       res.json({
//         images: imagesWithUrls,
//         total,
//         hasMore: skip + images.length < total,
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(total / parseInt(limit))
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

//   // Helper function to get next available order
//   getNextAvailableOrder: async (serviceId, startingOrder = 1) => {
//     const existingOrders = await prisma.serviceImageCarousel.findMany({
//       where: { serviceId },
//       select: { order: true },
//       orderBy: { order: 'asc' }
//     });

//     const ordersSet = new Set(existingOrders.map(img => img.order));
//     let currentOrder = startingOrder;
    
//     while (ordersSet.has(currentOrder)) {
//       currentOrder++;
//     }
    
//     return currentOrder;
//   },

//   // Bulk insert images with file upload
//   bulkInsertWithFiles: async (req, res) => {
//     try {
//       const { serviceId } = req.body;
//       const files = req.files;
      
//       if (!serviceId) {
//         return res.status(400).json({ error: 'Service ID is required' });
//       }

//       if (!files || files.length === 0) {
//         return res.status(400).json({ error: 'At least one image file is required' });
//       }

//       // Validate service exists
//       const service = await prisma.service.findUnique({
//         where: { id: parseInt(serviceId) }
//       });

//       if (!service) {
//         return res.status(404).json({ error: 'Service not found' });
//       }

//       // Use transaction for atomic operation
//       const result = await prisma.$transaction(async (tx) => {
//         const createdImages = [];
        
//         for (let i = 0; i < files.length; i++) {
//           const file = files[i];
//           const targetOrder = await serviceImageController.getNextAvailableOrder(parseInt(serviceId));

//           const createdImage = await tx.serviceImageCarousel.create({
//             data: {
//               imageName: file.filename,
//               order: targetOrder,
//               serviceId: parseInt(serviceId)
//             }
//           });
          
//           createdImages.push(createdImage);
//         }
        
//         return createdImages;
//       });

//       res.json({ 
//         message: `${result.length} images uploaded successfully`,
//         insertedCount: result.length,
//         images: result
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

//   // Reorder images
//   reorderImages: async (req, res) => {
//     try {
//       const { serviceId, imageOrders } = req.body;
      
//       if (!serviceId || !Array.isArray(imageOrders)) {
//         return res.status(400).json({ error: 'Service ID and image orders array are required' });
//       }

//       const result = await prisma.$transaction(async (tx) => {
//         const updates = [];
        
//         for (const { id, order } of imageOrders) {
//           const updated = await tx.serviceImageCarousel.update({
//             where: { id: parseInt(id) },
//             data: { order: parseInt(order) }
//           });
//           updates.push(updated);
//         }
        
//         return updates;
//       });

//       res.json({
//         message: 'Images reordered successfully',
//         images: result
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

//   // Bulk delete images
//   bulkDelete: async (req, res) => {
//     try {
//       const { imageIds } = req.body;
      
//       if (!Array.isArray(imageIds) || imageIds.length === 0) {
//         return res.status(400).json({ error: 'Image IDs array is required' });
//       }

//       // Get image details before deletion for file cleanup
//       const imagesToDelete = await prisma.serviceImageCarousel.findMany({
//         where: {
//           id: { in: imageIds.map(id => parseInt(id)) }
//         }
//       });

//       // Delete from database
//       const result = await prisma.serviceImageCarousel.deleteMany({
//         where: {
//           id: { in: imageIds.map(id => parseInt(id)) }
//         }
//       });

//       // Delete files from server
//       imagesToDelete.forEach(image => {
//         const filePath = path.join(__dirname, '../uploads/service-images/', image.imageName);
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//         }
//       });

//       res.json({ 
//         message: `${result.count} images deleted successfully`,
//         deletedCount: result.count 
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   },

//   // Delete single image
//   deleteImage: async (req, res) => {
//     try {
//       const { id } = req.params;

//       // Get image details before deletion
//       const image = await prisma.serviceImageCarousel.findUnique({
//         where: { id: parseInt(id) }
//       });

//       if (!image) {
//         return res.status(404).json({ error: 'Image not found' });
//       }

//       // Delete from database
//       await prisma.serviceImageCarousel.delete({
//         where: { id: parseInt(id) }
//       });

//       // Delete file from server
//       const filePath = path.join(__dirname, '../uploads/service-images/', image.imageName);
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }

//       res.json({ message: 'Image deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// };

// module.exports = serviceImageController;

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const prisma = new PrismaClient();

const serviceImageController = {
  // Get all services for dropdown
  getAllServices: async (req, res) => {
    try {
      const services = await prisma.service.findMany({
        select: {
          id: true,
          name: true
        },
        orderBy: {
          order: 'asc'
        }
      });
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get images for a specific service
  getServiceImages: async (req, res) => {
    try {
      const { serviceId } = req.params;
      const { page = 1, limit = 12 } = req.query;
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [images, total] = await Promise.all([
        prisma.serviceImageCarousel.findMany({
          where: { serviceId: parseInt(serviceId) },
          orderBy: { order: 'asc' },
          skip,
          take: parseInt(limit)
        }),
        prisma.serviceImageCarousel.count({
          where: { serviceId: parseInt(serviceId) }
        })
      ]);

      // Add full image URLs
      const imagesWithUrls = images.map(image => ({
        ...image,
        imageUrl: `/uploads/service-images/${image.imageName}`
      }));

      res.json({
        images: imagesWithUrls,
        total,
        hasMore: skip + images.length < total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Helper function to get next available order within transaction
  getNextAvailableOrderInTransaction: async (tx, serviceId, startingOrder = 1) => {
    const existingOrders = await tx.serviceImageCarousel.findMany({
      where: { serviceId },
      select: { order: true },
      orderBy: { order: 'asc' }
    });

    const ordersSet = new Set(existingOrders.map(img => img.order));
    let currentOrder = startingOrder;
    
    while (ordersSet.has(currentOrder)) {
      currentOrder++;
    }
    
    return currentOrder;
  },

  // FIXED: Bulk insert images with file upload
  bulkInsertWithFiles: async (req, res) => {
    try {
      const { serviceId } = req.body;
      const files = req.files;
      
      if (!serviceId) {
        return res.status(400).json({ error: 'Service ID is required' });
      }

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'At least one image file is required' });
      }

      // Validate service exists
      const service = await prisma.service.findUnique({
        where: { id: parseInt(serviceId) }
      });

      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      // Use transaction for atomic operation
      const result = await prisma.$transaction(async (tx) => {
        const createdImages = [];
        
        // Get the current maximum order for this service within the transaction
        const maxOrderResult = await tx.serviceImageCarousel.aggregate({
          where: { serviceId: parseInt(serviceId) },
          _max: { order: true }
        });
        
        let currentMaxOrder = maxOrderResult._max.order || 0;
        
        // Process files sequentially to avoid race conditions
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const targetOrder = currentMaxOrder + i + 1; // Sequential ordering
          
          const createdImage = await tx.serviceImageCarousel.create({
            data: {
              imageName: file.filename,
              order: targetOrder,
              serviceId: parseInt(serviceId)
            }
          });
          
          createdImages.push(createdImage);
        }
        
        return createdImages;
      });

      res.json({ 
        message: `${result.length} images uploaded successfully`,
        insertedCount: result.length,
        images: result
      });
    } catch (error) {
      // Clean up uploaded files if database operation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const filePath = path.join(__dirname, '../uploads/service-images/', file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // FIXED: Bulk update images with order management
  bulkUpdate: async (req, res) => {
    try {
      const { updates } = req.body;
      
      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ error: 'Updates array is required' });
      }

      const result = await prisma.$transaction(async (tx) => {
        const updatedImages = [];
        
        // Sort updates by new order to process them in sequence
        const sortedUpdates = updates.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        for (const update of sortedUpdates) {
          const { id, order: newOrder, ...otherData } = update;
          const imageId = parseInt(id);
          
          // Get current image data
          const currentImage = await tx.serviceImageCarousel.findUnique({
            where: { id: imageId }
          });
          
          if (!currentImage) {
            throw new Error(`Image with ID ${imageId} not found`);
          }
          
          let finalOrder = currentImage.order;
          
          // If order is being changed
          if (newOrder !== undefined && newOrder !== currentImage.order) {
            // Find if the target order is already taken
            const conflictingImage = await tx.serviceImageCarousel.findFirst({
              where: {
                serviceId: currentImage.serviceId,
                order: newOrder,
                id: { not: imageId }
              }
            });
            
            if (conflictingImage) {
              // Temporarily set the conflicting image to a high order value
              const tempOrder = 999999 + Date.now();
              await tx.serviceImageCarousel.update({
                where: { id: conflictingImage.id },
                data: { order: tempOrder }
              });
              
              // Update our image to the desired order
              finalOrder = newOrder;
              
              // Set the conflicting image to our old order
              await tx.serviceImageCarousel.update({
                where: { id: conflictingImage.id },
                data: { order: currentImage.order }
              });
            } else {
              finalOrder = newOrder;
            }
          }
          
          // Update the image with new data
          const updatedImage = await tx.serviceImageCarousel.update({
            where: { id: imageId },
            data: { 
              ...otherData, 
              order: finalOrder
            }
          });
          
          updatedImages.push(updatedImage);
        }
        
        return updatedImages;
      });

      res.json({ 
        message: `${result.length} images updated successfully`,
        updatedCount: result.length,
        images: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // FIXED: Reorder images
  reorderImages: async (req, res) => {
    try {
      const { serviceId, imageOrders } = req.body;
      
      if (!serviceId || !Array.isArray(imageOrders)) {
        return res.status(400).json({ error: 'Service ID and image orders array are required' });
      }

      const result = await prisma.$transaction(async (tx) => {
        // First, set all images to temporary high order values to avoid conflicts
        const tempOrderStart = 999999;
        await tx.serviceImageCarousel.updateMany({
          where: { 
            serviceId: parseInt(serviceId),
            id: { in: imageOrders.map(item => parseInt(item.id)) }
          },
          data: { order: { increment: tempOrderStart } }
        });
        
        // Then update each image to its final order
        const updates = [];
        for (const { id, order } of imageOrders) {
          const updated = await tx.serviceImageCarousel.update({
            where: { id: parseInt(id) },
            data: { order: parseInt(order) }
          });
          updates.push(updated);
        }
        
        return updates;
      });

      res.json({
        message: 'Images reordered successfully',
        images: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Bulk delete images
  bulkDelete: async (req, res) => {
    try {
      const { imageIds } = req.body;
      
      if (!Array.isArray(imageIds) || imageIds.length === 0) {
        return res.status(400).json({ error: 'Image IDs array is required' });
      }

      // Get image details before deletion for file cleanup
      const imagesToDelete = await prisma.serviceImageCarousel.findMany({
        where: {
          id: { in: imageIds.map(id => parseInt(id)) }
        }
      });

      // Delete from database
      const result = await prisma.serviceImageCarousel.deleteMany({
        where: {
          id: { in: imageIds.map(id => parseInt(id)) }
        }
      });

      // Delete files from server
      imagesToDelete.forEach(image => {
        const filePath = path.join(__dirname, '../uploads/service-images/', image.imageName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      res.json({ 
        message: `${result.count} images deleted successfully`,
        deletedCount: result.count 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create single image
  createImage: async (req, res) => {
    try {
      const { serviceId, imageName, imageUrl, order } = req.body;
      
      const result = await prisma.$transaction(async (tx) => {
        let targetOrder = order;
        
        if (!targetOrder) {
          // Get next available order within transaction
          const maxOrderResult = await tx.serviceImageCarousel.aggregate({
            where: { serviceId: parseInt(serviceId) },
            _max: { order: true }
          });
          targetOrder = (maxOrderResult._max.order || 0) + 1;
        } else {
          // Check if order already exists and handle conflict
          const existingImage = await tx.serviceImageCarousel.findFirst({
            where: {
              serviceId: parseInt(serviceId),
              order: targetOrder
            }
          });
          
          if (existingImage) {
            // Shift existing images to make room
            await tx.serviceImageCarousel.updateMany({
              where: {
                serviceId: parseInt(serviceId),
                order: { gte: targetOrder }
              },
              data: {
                order: { increment: 1 }
              }
            });
          }
        }

        const image = await tx.serviceImageCarousel.create({
          data: {
            imageName,
            imageUrl: imageUrl || null,
            order: targetOrder,
            serviceId: parseInt(serviceId)
          }
        });
        
        return image;
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update single image
  updateImage: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const image = await prisma.serviceImageCarousel.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      res.json(image);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete single image
  deleteImage: async (req, res) => {
    try {
      const { id } = req.params;

      // Get image details before deletion
      const image = await prisma.serviceImageCarousel.findUnique({
        where: { id: parseInt(id) }
      });

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // Delete from database
      await prisma.serviceImageCarousel.delete({
        where: { id: parseInt(id) }
      });

      // Delete file from server
      const filePath = path.join(__dirname, '../uploads/service-images/', image.imageName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = serviceImageController;