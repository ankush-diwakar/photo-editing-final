
// // const { PrismaClient } = require("@prisma/client");
// // const prisma = new PrismaClient();

// // // ---------- Public Controllers ----------
// // exports.getAllSlides = async (req, res) => {
// //   try {
// //     const slides = await prisma.heroSlide.findMany({
// //       where: { isActive: true },
// //       orderBy: { displayOrder: "asc" },
// //     });
// //     res.json(slides);
// //   } catch (error) {
// //     console.error("Error fetching slides:", error);
// //     res.status(500).json({ error: "Failed to fetch slides" });
// //   }
// // };

// // exports.getAllVideos = async (req, res) => {
// //   try {
// //     const videos = await prisma.heroVideo.findMany({
// //       where: { isActive: true },
// //     });
// //     res.json(videos);
// //   } catch (error) {
// //     console.error("Error fetching videos:", error);
// //     res.status(500).json({ error: "Failed to fetch videos" });
// //   }
// // };

// // // ---------- Admin Controllers ----------
// // exports.addSlide = async (req, res) => {
// //   try {
// //     const { title, description, imageUrl, showButton, displayOrder, isActive } = req.body;

// //     const newSlide = await prisma.heroSlide.create({
// //       data: {
// //         title,
// //         description,
// //         imageUrl,
// //         showButton: showButton ?? false,
// //         displayOrder: displayOrder ?? 0,
// //         isActive: isActive ?? true,
// //       },
// //     });

// //     res.status(201).json(newSlide);
// //   } catch (error) {
// //     console.error("Error adding slide:", error);
// //     res.status(500).json({ error: "Failed to add slide" });
// //   }
// // };

// // exports.deleteSlide = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     await prisma.heroSlide.delete({
// //       where: { id: parseInt(id) },
// //     });

// //     res.json({ message: "Slide deleted successfully" });
// //   } catch (error) {
// //     console.error("Error deleting slide:", error);
// //     res.status(500).json({ error: "Failed to delete slide" });
// //   }
// // };

// //   // Create new hero slide
// //   exports.createSlide = async (req, res) => {
// //     try {
// //       const { title, description, showButton, displayOrder } = req.body;
// //       const imageUrl = req.file ? `/uploads/hero-images/${req.file.filename}` : null;

// //       if (!imageUrl) {
// //         return res.status(400).json({ error: 'Image is required' });
// //       }

// //       const slide = await prisma.heroSlide.create({
// //         data: {
// //           title: title || null,
// //           description: description || null,
// //           imageUrl,
// //           showButton: showButton === 'true',
// //           displayOrder: parseInt(displayOrder) || 1
// //         }
// //       });

// //       res.status(201).json({ 
// //         message: 'Hero slide created successfully', 
// //         slide 
// //       });
// //     } catch (error) {
// //       console.error('Error creating hero slide:', error);
// //       res.status(500).json({ error: 'Failed to create hero slide' });
// //     }
// //   }


// //   exports.updateSlide = async (req, res) => {
// //     try {
// //       const { id } = req.params;
// //       const { title, description, showButton, displayOrder } = req.body;
      
// //       // Check if slide exists
// //       const existingSlide = await prisma.heroSlide.findUnique({
// //         where: { id: parseInt(id) }
// //       });

// //       if (!existingSlide) {
// //         return res.status(404).json({ error: 'Hero slide not found' });
// //       }

// //       const updateData = {
// //         title: title || null,
// //         description: description || null,
// //         showButton: showButton === 'true',
// //         displayOrder: parseInt(displayOrder) || existingSlide.displayOrder
// //       };

// //       // If new image is uploaded, update image URL and delete old image
// //       if (req.file) {
// //         updateData.imageUrl = `/uploads/hero-images/${req.file.filename}`;
        
// //         // Delete old image file
// //         if (existingSlide.imageUrl) {
// //           const oldImagePath = path.join(__dirname, '../../', existingSlide.imageUrl);
// //           if (fs.existsSync(oldImagePath)) {
// //             fs.unlinkSync(oldImagePath);
// //           }
// //         }
// //       }

// //       const slide = await prisma.heroSlide.update({
// //         where: { id: parseInt(id) },
// //         data: updateData
// //       });

// //       res.json({ 
// //         message: 'Hero slide updated successfully', 
// //         slide 
// //       });
// //     } catch (error) {
// //       console.error('Error updating hero slide:', error);
// //       res.status(500).json({ error: 'Failed to update hero slide' });
// //     }
// //   }


// //   exports.permanentDeleteSlide = async (req, res) => {
// //     try {
// //       const { id } = req.params;

// //       const existingSlide = await prisma.heroSlide.findUnique({
// //         where: { id: parseInt(id) }
// //       });

// //       if (!existingSlide) {
// //         return res.status(404).json({ error: 'Hero slide not found' });
// //       }

// //       // Delete image file
// //       if (existingSlide.imageUrl) {
// //         const imagePath = path.join(__dirname, '../../', existingSlide.imageUrl);
// //         if (fs.existsSync(imagePath)) {
// //           fs.unlinkSync(imagePath);
// //         }
// //       }

// //       await prisma.heroSlide.delete({
// //         where: { id: parseInt(id) }
// //       });

// //       res.json({ message: 'Hero slide permanently deleted' });
// //     } catch (error) {
// //       console.error('Error permanently deleting hero slide:', error);
// //       res.status(500).json({ error: 'Failed to permanently delete hero slide' });
// //     }
// //   },

// //   // Upload hero video
// //     exports.uploadVideo = async (req, res) => {
// //     try {
// //       const videoUrl = req.file ? `/uploads/hero-videos/${req.file.filename}` : null;

// //       if (!videoUrl) {
// //         return res.status(400).json({ error: 'Video file is required' });
// //       }

// //       // Deactivate all previous videos
// //       await prisma.heroVideo.updateMany({
// //         data: { isActive: false }
// //       });

// //       const video = await prisma.heroVideo.create({
// //         data: { videoUrl }
// //       });

// //       res.status(201).json({ 
// //         message: 'Hero video uploaded successfully', 
// //         video 
// //       });
// //     } catch (error) {
// //       console.error('Error uploading hero video:', error);
// //       res.status(500).json({ error: 'Failed to upload hero video' });
// //     }
// //   },


// //   // Admin: Get all videos
// //     exports.getAllVideosAdmin = async (req, res) => {
// //     try {
// //       const videos = await prisma.heroVideo.findMany({
// //         orderBy: { createdAt: 'desc' }
// //       });
// //       res.json(videos);
// //     } catch (error) {
// //       console.error('Error fetching hero videos:', error);
// //       res.status(500).json({ error: 'Failed to fetch hero videos' });
// //     }
// //   }


// //   exports.deleteVideo = async (req, res) => {
// //     try {
// //       const { id } = req.params;

// //       const existingVideo = await prisma.heroVideo.findUnique({
// //         where: { id: parseInt(id) }
// //       });

// //       if (!existingVideo) {
// //         return res.status(404).json({ error: 'Hero video not found' });
// //       }

// //       // Delete video file
// //       if (existingVideo.videoUrl) {
// //         const videoPath = path.join(__dirname, '../../', existingVideo.videoUrl);
// //         if (fs.existsSync(videoPath)) {
// //           fs.unlinkSync(videoPath);
// //         }
// //       }

// //       await prisma.heroVideo.delete({
// //         where: { id: parseInt(id) }
// //       });

// //       res.json({ message: 'Hero video deleted successfully' });
// //     } catch (error) {
// //       console.error('Error deleting hero video:', error);
// //       res.status(500).json({ error: 'Failed to delete hero video' });
// //     }
// //   }

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
// const fs = require("fs");
// const path = require("path");
// require("dotenv").config();

// // Helper: prepend base URL
// const addBaseUrl = (filePath) => {
//   if (!filePath) return null;
//   return `${process.env.PRODUCT_EDITING_URL}${filePath}`;
// };

// // ---------- Public Controllers ----------
// exports.getAllSlides = async (req, res) => {
//   try {
//     const slides = await prisma.heroSlide.findMany({
//       where: { isActive: true },
//       orderBy: { displayOrder: "asc" },
//     });

//     const slidesWithBaseUrl = slides.map((s) => ({
//       ...s,
//       imageUrl: addBaseUrl(s.imageUrl),
//     }));

//     res.json(slidesWithBaseUrl);
//   } catch (error) {
//     console.error("Error fetching slides:", error);
//     res.status(500).json({ error: "Failed to fetch slides" });
//   }
// };

// exports.getAllVideos = async (req, res) => {
//   try {
//     const videos = await prisma.heroVideo.findMany({
//       where: { isActive: true },
//     });

//     const videosWithBaseUrl = videos.map((v) => ({
//       ...v,
//       videoUrl: addBaseUrl(v.videoUrl),
//     }));

//     res.json(videosWithBaseUrl);
//   } catch (error) {
//     console.error("Error fetching videos:", error);
//     res.status(500).json({ error: "Failed to fetch videos" });
//   }
// };

// // ---------- Admin Controllers ----------
// exports.addSlide = async (req, res) => {
//   try {
//     const { title, description, imageUrl, showButton, displayOrder, isActive } = req.body;

//     const newSlide = await prisma.heroSlide.create({
//       data: {
//         title,
//         description,
//         imageUrl,
//         showButton: showButton ?? false,
//         displayOrder: displayOrder ?? 0,
//         isActive: isActive ?? true,
//       },
//     });

//     res.status(201).json({
//       ...newSlide,
//       imageUrl: addBaseUrl(newSlide.imageUrl),
//     });
//   } catch (error) {
//     console.error("Error adding slide:", error);
//     res.status(500).json({ error: "Failed to add slide" });
//   }
// };

// exports.deleteSlide = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await prisma.heroSlide.delete({
//       where: { id: parseInt(id) },
//     });

//     res.json({ message: "Slide deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting slide:", error);
//     res.status(500).json({ error: "Failed to delete slide" });
//   }
// };

// // Upload hero slide with file
// exports.createSlide = async (req, res) => {
//   try {
//     const { title, description, showButton, displayOrder } = req.body;
//     const imageUrl = req.file ? `/uploads/hero-images/${req.file.filename}` : null;

//     if (!imageUrl) {
//       return res.status(400).json({ error: "Image is required" });
//     }

//     const slide = await prisma.heroSlide.create({
//       data: {
//         title: title || null,
//         description: description || null,
//         imageUrl,
//         showButton: showButton === "true",
//         displayOrder: parseInt(displayOrder) || 1,
//       },
//     });

//     res.status(201).json({
//       message: "Hero slide created successfully",
//       slide: {
//         ...slide,
//         imageUrl: addBaseUrl(slide.imageUrl),
//       },
//     });
//   } catch (error) {
//     console.error("Error creating hero slide:", error);
//     res.status(500).json({ error: "Failed to create hero slide" });
//   }
// };

// // Update hero slide
// exports.updateSlide = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, showButton, displayOrder } = req.body;

//     const existingSlide = await prisma.heroSlide.findUnique({
//       where: { id: parseInt(id) },
//     });

//     if (!existingSlide) {
//       return res.status(404).json({ error: "Hero slide not found" });
//     }

//     const updateData = {
//       title: title || null,
//       description: description || null,
//       showButton: showButton === "true",
//       displayOrder: parseInt(displayOrder) || existingSlide.displayOrder,
//     };

//     if (req.file) {
//       updateData.imageUrl = `/uploads/hero-images/${req.file.filename}`;

//       // delete old image
//       if (existingSlide.imageUrl) {
//         const oldImagePath = path.join(__dirname, "../../", existingSlide.imageUrl);
//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//         }
//       }
//     }

//     const slide = await prisma.heroSlide.update({
//       where: { id: parseInt(id) },
//       data: updateData,
//     });

//     res.json({
//       message: "Hero slide updated successfully",
//       slide: {
//         ...slide,
//         imageUrl: addBaseUrl(slide.imageUrl),
//       },
//     });
//   } catch (error) {
//     console.error("Error updating hero slide:", error);
//     res.status(500).json({ error: "Failed to update hero slide" });
//   }
// };

// // Permanently delete slide
// exports.permanentDeleteSlide = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const existingSlide = await prisma.heroSlide.findUnique({
//       where: { id: parseInt(id) },
//     });

//     if (!existingSlide) {
//       return res.status(404).json({ error: "Hero slide not found" });
//     }

//     if (existingSlide.imageUrl) {
//       const imagePath = path.join(__dirname, "../../", existingSlide.imageUrl);
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }

//     await prisma.heroSlide.delete({
//       where: { id: parseInt(id) },
//     });

//     res.json({ message: "Hero slide permanently deleted" });
//   } catch (error) {
//     console.error("Error permanently deleting hero slide:", error);
//     res.status(500).json({ error: "Failed to permanently delete hero slide" });
//   }
// };

// // Upload hero video
// exports.uploadVideo = async (req, res) => {
//   try {
//     const videoUrl = req.file ? `/uploads/hero-videos/${req.file.filename}` : null;

//     if (!videoUrl) {
//       return res.status(400).json({ error: "Video file is required" });
//     }

//     await prisma.heroVideo.updateMany({
//       data: { isActive: false },
//     });

//     const video = await prisma.heroVideo.create({
//       data: { videoUrl },
//     });

//     res.status(201).json({
//       message: "Hero video uploaded successfully",
//       video: {
//         ...video,
//         videoUrl: addBaseUrl(video.videoUrl),
//       },
//     });
//   } catch (error) {
//     console.error("Error uploading hero video:", error);
//     res.status(500).json({ error: "Failed to upload hero video" });
//   }
// };

// // Admin: Get all videos
// exports.getAllVideosAdmin = async (req, res) => {
//   try {
//     const videos = await prisma.heroVideo.findMany({
//       orderBy: { createdAt: "desc" },
//     });

//     const videosWithBaseUrl = videos.map((v) => ({
//       ...v,
//       videoUrl: addBaseUrl(v.videoUrl),
//     }));

//     res.json(videosWithBaseUrl);
//   } catch (error) {
//     console.error("Error fetching hero videos:", error);
//     res.status(500).json({ error: "Failed to fetch hero videos" });
//   }
// };

// // Delete video
// exports.deleteVideo = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const existingVideo = await prisma.heroVideo.findUnique({
//       where: { id: parseInt(id) },
//     });

//     if (!existingVideo) {
//       return res.status(404).json({ error: "Hero video not found" });
//     }

//     if (existingVideo.videoUrl) {
//       const videoPath = path.join(__dirname, "../../", existingVideo.videoUrl);
//       if (fs.existsSync(videoPath)) {
//         fs.unlinkSync(videoPath);
//       }
//     }

//     await prisma.heroVideo.delete({
//       where: { id: parseInt(id) },
//     });

//     res.json({ message: "Hero video deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting hero video:", error);
//     res.status(500).json({ error: "Failed to delete hero video" });
//   }
// };



const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Helper: prepend base URL
const addBaseUrl = (filePath) => {
  if (!filePath) return null;
  return `${process.env.PRODUCT_EDITING_URL}${filePath}`;
};

// ---------- Public Controllers ----------
exports.getAllSlides = async (req, res) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    const slidesWithBaseUrl = slides.map((s) => ({
      ...s,
      imageUrl: addBaseUrl(s.imageUrl),
    }));

    res.json(slidesWithBaseUrl);
  } catch (error) {
    console.error("Error fetching slides:", error);
    res.status(500).json({ error: "Failed to fetch slides" });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await prisma.heroVideo.findMany({
      where: { isActive: true },
    });

    const videosWithBaseUrl = videos.map((v) => ({
      ...v,
      videoUrl: addBaseUrl(v.videoUrl),
    }));

    res.json(videosWithBaseUrl);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

// ---------- Admin Controllers ----------
exports.addSlide = async (req, res) => {
  try {
    const { title, description, imageUrl, showButton, displayOrder, isActive } = req.body;

    const newSlide = await prisma.heroSlide.create({
      data: {
        title,
        description,
        imageUrl,
        showButton: showButton ?? false,
        displayOrder: displayOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    res.status(201).json({
      ...newSlide,
      imageUrl: addBaseUrl(newSlide.imageUrl),
    });
  } catch (error) {
    console.error("Error adding slide:", error);
    res.status(500).json({ error: "Failed to add slide" });
  }
};

exports.deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.heroSlide.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Slide deleted successfully" });
  } catch (error) {
    console.error("Error deleting slide:", error);
    res.status(500).json({ error: "Failed to delete slide" });
  }
};

// Upload hero slide with file
exports.createSlide = async (req, res) => {
  try {
    const { title, description, showButton, displayOrder } = req.body;
    const imageUrl = req.file ? `/uploads/hero-images/${req.file.filename}` : null;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image is required" });
    }

    const slide = await prisma.heroSlide.create({
      data: {
        title: title || null,
        description: description || null,
        imageUrl,
        showButton: showButton === "true",
        displayOrder: parseInt(displayOrder) || 1,
      },
    });

    res.status(201).json({
      message: "Hero slide created successfully",
      slide: {
        ...slide,
        imageUrl: addBaseUrl(slide.imageUrl),
      },
    });
  } catch (error) {
    console.error("Error creating hero slide:", error);
    res.status(500).json({ error: "Failed to create hero slide" });
  }
};

// Update hero slide
exports.updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, showButton, displayOrder } = req.body;

    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingSlide) {
      return res.status(404).json({ error: "Hero slide not found" });
    }

    const updateData = {
      title: title || null,
      description: description || null,
      showButton: showButton === "true",
      displayOrder: parseInt(displayOrder) || existingSlide.displayOrder,
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/hero-images/${req.file.filename}`;

      // delete old image
      if (existingSlide.imageUrl) {
        const oldImagePath = path.join(__dirname, "../../", existingSlide.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const slide = await prisma.heroSlide.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      message: "Hero slide updated successfully",
      slide: {
        ...slide,
        imageUrl: addBaseUrl(slide.imageUrl),
      },
    });
  } catch (error) {
    console.error("Error updating hero slide:", error);
    res.status(500).json({ error: "Failed to update hero slide" });
  }
};

// Permanently delete slide
exports.permanentDeleteSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingSlide) {
      return res.status(404).json({ error: "Hero slide not found" });
    }

    if (existingSlide.imageUrl) {
      const imagePath = path.join(__dirname, "../../", existingSlide.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.heroSlide.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Hero slide permanently deleted" });
  } catch (error) {
    console.error("Error permanently deleting hero slide:", error);
    res.status(500).json({ error: "Failed to permanently delete hero slide" });
  }
};

// Upload hero video
exports.uploadVideo = async (req, res) => {
  try {
    const videoUrl = req.file ? `/uploads/hero-videos/${req.file.filename}` : null;

    if (!videoUrl) {
      return res.status(400).json({ error: "Video file is required" });
    }

    await prisma.heroVideo.updateMany({
      data: { isActive: false },
    });

    const video = await prisma.heroVideo.create({
      data: { videoUrl },
    });

    res.status(201).json({
      message: "Hero video uploaded successfully",
      video: {
        ...video,
        videoUrl: addBaseUrl(video.videoUrl),
      },
    });
  } catch (error) {
    console.error("Error uploading hero video:", error);
    res.status(500).json({ error: "Failed to upload hero video" });
  }
};

// Admin: Get all videos
exports.getAllVideosAdmin = async (req, res) => {
  try {
    const videos = await prisma.heroVideo.findMany({
      orderBy: { createdAt: "desc" },
    });

    const videosWithBaseUrl = videos.map((v) => ({
      ...v,
      videoUrl: addBaseUrl(v.videoUrl),
    }));

    res.json(videosWithBaseUrl);
  } catch (error) {
    console.error("Error fetching hero videos:", error);
    res.status(500).json({ error: "Failed to fetch hero videos" });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const existingVideo = await prisma.heroVideo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingVideo) {
      return res.status(404).json({ error: "Hero video not found" });
    }

    if (existingVideo.videoUrl) {
      const videoPath = path.join(__dirname, "../../", existingVideo.videoUrl);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    await prisma.heroVideo.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Hero video deleted successfully" });
  } catch (error) {
    console.error("Error deleting hero video:", error);
    res.status(500).json({ error: "Failed to delete hero video" });
  }
};
