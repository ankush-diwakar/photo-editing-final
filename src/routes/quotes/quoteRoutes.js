const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { submitQuote } = require('../../controllers/quotes/quoteController');

const router = express.Router();

// --- Multer Configuration ---
const uploadDir = 'uploads/quotes';
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'quote-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Define the POST route
router.post('/', upload.array('uploadedFiles', 10), submitQuote);

module.exports = router;