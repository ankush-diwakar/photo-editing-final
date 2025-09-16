const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');


const prisma = new PrismaClient();

const heroController = {
  // Get all active hero slides
  getAllSlides: async (req, res) => {
    try {
      const slides = await prisma.heroSlide.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' }
      });
      res.json(slides);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      res.status(500).json({ error: 'Failed to fetch hero slides' });
    }
  },

  // Get active hero video
  getHeroVideo: async (req, res) => {
    try {
      const video = await prisma.heroVideo.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json(video || null);
    } catch (error) {
      console.error('Error fetching hero video:', error);
      res.status(500).json({ error: 'Failed to fetch hero video' });
    }
  },

  // Create new hero slide
  createSlide: async (req, res) => {
    try {
      const { title, description, showButton, displayOrder } = req.body;
      const imageUrl = req.file ? `/uploads/hero-images/${req.file.filename}` : null;

      if (!imageUrl) {
        return res.status(400).json({ error: 'Image is required' });
      }

      const slide = await prisma.heroSlide.create({
        data: {
          title: title || null,
          description: description || null,
          imageUrl,
          showButton: showButton === 'true',
          displayOrder: parseInt(displayOrder) || 1
        }
      });

      res.status(201).json({ 
        message: 'Hero slide created successfully', 
        slide 
      });
    } catch (error) {
      console.error('Error creating hero slide:', error);
      res.status(500).json({ error: 'Failed to create hero slide' });
    }
  },

  // Update hero slide
  updateSlide: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, showButton, displayOrder } = req.body;
      
      // Check if slide exists
      const existingSlide = await prisma.heroSlide.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingSlide) {
        return res.status(404).json({ error: 'Hero slide not found' });
      }

      const updateData = {
        title: title || null,
        description: description || null,
        showButton: showButton === 'true',
        displayOrder: parseInt(displayOrder) || existingSlide.displayOrder
      };

      // If new image is uploaded, update image URL and delete old image
      if (req.file) {
        updateData.imageUrl = `/uploads/hero-images/${req.file.filename}`;
        
        // Delete old image file
        if (existingSlide.imageUrl) {
          const oldImagePath = path.join(__dirname, '../../', existingSlide.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      const slide = await prisma.heroSlide.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      res.json({ 
        message: 'Hero slide updated successfully', 
        slide 
      });
    } catch (error) {
      console.error('Error updating hero slide:', error);
      res.status(500).json({ error: 'Failed to update hero slide' });
    }
  },

  // Delete hero slide (soft delete)
  deleteSlide: async (req, res) => {
    try {
      const { id } = req.params;

      const existingSlide = await prisma.heroSlide.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingSlide) {
        return res.status(404).json({ error: 'Hero slide not found' });
      }

      await prisma.heroSlide.update({
        where: { id: parseInt(id) },
        data: { isActive: false }
      });

      res.json({ message: 'Hero slide deleted successfully' });
    } catch (error) {
      console.error('Error deleting hero slide:', error);
      res.status(500).json({ error: 'Failed to delete hero slide' });
    }
  },

  // Hard delete hero slide (permanently delete)
  permanentDeleteSlide: async (req, res) => {
    try {
      const { id } = req.params;

      const existingSlide = await prisma.heroSlide.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingSlide) {
        return res.status(404).json({ error: 'Hero slide not found' });
      }

      // Delete image file
      if (existingSlide.imageUrl) {
        const imagePath = path.join(__dirname, '../../', existingSlide.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await prisma.heroSlide.delete({
        where: { id: parseInt(id) }
      });

      res.json({ message: 'Hero slide permanently deleted' });
    } catch (error) {
      console.error('Error permanently deleting hero slide:', error);
      res.status(500).json({ error: 'Failed to permanently delete hero slide' });
    }
  },

  // Upload hero video
  uploadVideo: async (req, res) => {
    try {
      const videoUrl = req.file ? `/uploads/hero-videos/${req.file.filename}` : null;

      if (!videoUrl) {
        return res.status(400).json({ error: 'Video file is required' });
      }

      // Deactivate all previous videos
      await prisma.heroVideo.updateMany({
        data: { isActive: false }
      });

      const video = await prisma.heroVideo.create({
        data: { videoUrl }
      });

      res.status(201).json({ 
        message: 'Hero video uploaded successfully', 
        video 
      });
    } catch (error) {
      console.error('Error uploading hero video:', error);
      res.status(500).json({ error: 'Failed to upload hero video' });
    }
  },

  // Delete hero video
  deleteVideo: async (req, res) => {
    try {
      const { id } = req.params;

      const existingVideo = await prisma.heroVideo.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingVideo) {
        return res.status(404).json({ error: 'Hero video not found' });
      }

      // Delete video file
      if (existingVideo.videoUrl) {
        const videoPath = path.join(__dirname, '../../', existingVideo.videoUrl);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      }

      await prisma.heroVideo.delete({
        where: { id: parseInt(id) }
      });

      res.json({ message: 'Hero video deleted successfully' });
    } catch (error) {
      console.error('Error deleting hero video:', error);
      res.status(500).json({ error: 'Failed to delete hero video' });
    }
  },

  // Admin: Get all slides (including inactive)
  getAllSlidesAdmin: async (req, res) => {
    try {
      const slides = await prisma.heroSlide.findMany({
        orderBy: { displayOrder: 'asc' }
      });
      res.json(slides);
    } catch (error) {
      console.error('Error fetching all hero slides:', error);
      res.status(500).json({ error: 'Failed to fetch hero slides' });
    }
  },

  // Admin: Get all videos
  getAllVideosAdmin: async (req, res) => {
    try {
      const videos = await prisma.heroVideo.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(videos);
    } catch (error) {
      console.error('Error fetching hero videos:', error);
      res.status(500).json({ error: 'Failed to fetch hero videos' });
    }
  }
};

module.exports = heroController;