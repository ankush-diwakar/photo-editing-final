const { Prisma } = require('@prisma/client');
const prisma = require('../../prisma');
const multer = require('multer')

const imageController = {
    addImage: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Image is required' });
            }

            const imagePath = `images/${req.file.filename}`;

            const image = await prisma.image.create({
                data: {
                    imagePath
                }
            });

            if (!image) return res.status(404).json({ "message": "Error while adding image" });
            res.status(201).json({ "message": "Image added successfully", image });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    getAllImages: async (req, res) => {
        try {
            const images = await prisma.image.findMany();
            if (!images || images.length === 0) return res.status(404).json({ "message": "No images found" });
            res.status(200).json({ images });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    getImage: async (req, res) => {
        try {
            const { id } = req.params;
            const image = await prisma.image.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!image) return res.status(404).json({ "message": "Image not found" });
            res.status(200).json({ image });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    updateImage: async (req, res) => {
        try {
            const { id } = req.params;

            if (!req.file) {
                return res.status(400).json({ error: 'New image is required for update' });
            }

            const imagePath = `images/${req.file.filename}`;

            const image = await prisma.image.update({
                where: { id: Number(id) },
                data: { imagePath }
            });

            res.status(200).json({ "message": "Image updated successfully", image });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    deleteImage: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.image.delete({
                where: { id: Number(id) }
            });
            res.status(200).json({ message: 'Image deleted successfully' });
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
                return res.status(409).json({ message: "A unique constraint would be violated on Service. Details: " + error.meta.target });
            case 'P2025':
                return res.status(404).json({ message: "Record not found" });
            default:
                return res.status(400).json({ message: "Database error", error: error.message });
        }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
        // Handle validation errors
        return res.status(400).json({ message: "Validation error", error: error.message });
    }
    else if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).send('File size exceeds the maximum limit.');
        }
    }
    
    else {
        // Handle other types of errors
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
const sliderImageController = {
    addImages: async (req, res) => {
        try {
            // Check if any files are uploaded
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'At least one image is required' });
            }
    
            // Prepare an array to store image records to be inserted into the database
            const imagePaths = req.files.map(file => ({
                imagePath: `images/${file.filename}`
            }));
    
            // Insert all image paths into the database using Prisma's createMany
            const images = await prisma.sliderimage.createMany({
                data: imagePaths
            });
    
            // If no images are added, send an error response
            if (!images || images.count === 0) {
                return res.status(404).json({ message: 'Error while adding images' });
            }
    
            // If successful, send a response with the number of images added
            res.status(201).json({ message: 'Images added successfully', count: images.count });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },
    

    getAllImages: async (req, res) => {
        try {
            const images = await prisma.sliderimage.findMany();
            if (!images || images.length === 0) return res.status(404).json({ "message": "No images found" });
            res.status(200).json({ images });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    getImage: async (req, res) => {
        try {
            const { id } = req.params;
            const image = await prisma.sliderimage.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!image) return res.status(404).json({ "message": "Image not found" });
            res.status(200).json({ image });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    updateImage: async (req, res) => {
        try {
            const { id } = req.params;

            if (!req.file) {
                return res.status(400).json({ error: 'New image is required for update' });
            }

            const imagePath = `images/${req.file.filename}`;

            const image = await prisma.sliderimage.update({
                where: { id: Number(id) },
                data: { imagePath }
            });

            res.status(200).json({ "message": "Image updated successfully", image });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    deleteImage: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.sliderimage.delete({
                where: { id: Number(id) }
            });
            res.status(200).json({ message: 'Image deleted successfully' });
        } catch (error) {
            handlePrismaError(error, res);
        }
    }
};

module.exports = { imageController,sliderImageController };