
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let uploadPath = 'uploads/';
    
//     // Different paths for different file types
//     if (file.fieldname === 'coverLetter' || file.fieldname === 'resume') {
//       uploadPath += 'applications/';
//     } else if (file.fieldname === 'beforeImage' || file.fieldname === 'afterImage') {
//       uploadPath += 'images/';
//     }
    
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.fieldname === 'coverLetter' || file.fieldname === 'resume') {
//     // Allow PDF and DOC files for documents
//     const filetypes = /pdf|doc|docx/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
    
//     if (mimetype && extname) {
//       return cb(null, true);
//     }
//     cb(new Error('Error: Only PDF and DOC files are allowed!'));
//   } else {
//     // Existing image filter logic
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (mimetype && extname) {
//       return cb(null, true);
//     }
//     cb(new Error('Error: Images Only! (jpeg, jpg, png, gif)'));
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
// });

// module.exports = {
//   upload,
//   uploadSubServiceImages: upload.fields([
//     { name: 'beforeImage', maxCount: 1 },
//     { name: 'afterImage', maxCount: 1 }
//   ])
// };


const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    // Different paths for different file types
    if (file.fieldname === 'coverLetter' || file.fieldname === 'resume') {
      uploadPath += 'applications/';
    } else if (file.fieldname === 'beforeImage' || file.fieldname === 'afterImage') {
      uploadPath += 'images/';
    } else if (file.fieldname === 'serviceImages') {
      uploadPath += 'service-images/'; // New path for service carousel images
    } else {
      uploadPath += 'images/';
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'coverLetter' || file.fieldname === 'resume') {
    // Allow PDF and DOC files for documents
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: Only PDF and DOC files are allowed!'));
  } else {
    // Existing image filter logic
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: Images Only! (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = {
  upload,
  uploadSubServiceImages: upload.fields([
    { name: 'beforeImage', maxCount: 1 },
    { name: 'afterImage', maxCount: 1 }
  ]),
  uploadServiceImages: upload.array('serviceImages', 20) // New middleware for service images
};