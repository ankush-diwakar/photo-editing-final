const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/free-trial-images/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/tiff',
    'image/tif', 
    'image/bmp', 
    'image/gif', 
    'image/webp', 
    'image/vnd.adobe.photoshop'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Please upload a valid image file.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware for handling file upload
exports.uploadImage = upload.single('imageFile');

// exports.createFreeTrialLead = async (req, res) => {
//   try {
//     const { serviceId, service, brief, name, email, format, imageLink } = req.body;
    
//     const newLead = await prisma.freeTrialLead.create({
//       data: {
//         serviceId,
//         service,
//         brief,
//         name,
//         email,
//         format,
//         imageLink
//       }
//     });
    
//     res.status(201).json(newLead);
//   } catch (error) {
//     console.error('Error creating free trial lead:', error);
//     res.status(500).json({ error: 'Failed to create free trial lead' });
//   }
// };



exports.createFreeTrialLead = async (req, res) => {
  try {
    const { serviceId, service, brief, name, email, format } = req.body;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Image file is required' 
      });
    }

    // Store the file path in imageLink field
    const imagePath = req.file.path;

    const newLead = await prisma.freeTrialLead.create({
      data: {
        serviceId: parseInt(serviceId),
        service,
        brief: brief || '',
        name,
        email,
        format,
        imageLink: imagePath // Store file path in existing imageLink field
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Free trial lead created successfully',
      data: newLead
    });

  } catch (error) {
    // If there's an error and a file was uploaded, delete it
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('Error creating free trial lead:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create free trial lead' 
    });
  }
};

exports.getAllFreeTrialLeads = async (req, res) => {
  try {
    const leads = await prisma.freeTrialLead.findMany();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch free trial leads' });
  }
};