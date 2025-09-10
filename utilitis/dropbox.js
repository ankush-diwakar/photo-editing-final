// const { Dropbox } = require('dropbox');
// const router = require('express').Router();
// const axios = require('axios');

// const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

// const checkAccessToken = async () => {
//     try {
//         console.log('Checking access token...');
//         const response = await axios.post('https://api.dropboxapi.com/2/users/get_current_account', null, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log('Access token is valid. Account info:', JSON.stringify(response.data, null, 2));
//         return true;
//     } catch (error) {
//         console.error('Error checking access token:', error.response?.data || error.message);
//         return false;
//     }
// };

// const getDropboxLink = async (req, res) => {
//     try {
//         // Check if the access token is valid
//         const isTokenValid = await checkAccessToken();
//         if (!isTokenValid) {
//             throw new Error('Invalid access token');
//         }

//         console.log('Attempting to create file request...');
//         const response = await dbx.fileRequestsCreate({
//             title: "Upload Your files",
//             destination: "/uploads",
//             open: true
//         });

//         console.log('File request created successfully:', response.result);
//         res.status(201).json({ "uploadurl": response.result });
//     } catch (error) {
//         console.error('Error in getDropboxLink:', error);

//         if (error.message === 'Invalid access token') {
//             res.status(401).json({ 
//                 error: 'Authentication failed', 
//                 details: 'The Dropbox access token is invalid or has expired. Please check your token and try again.'
//             });
//         } else if (error.status === 403) {
//             res.status(403).json({ 
//                 error: 'Insufficient permissions', 
//                 details: 'The app may be missing required scopes. Please check your app permissions in the Dropbox App Console.'
//             });
//         } else {
//             res.status(500).json({ 
//                 error: 'Failed to create file request', 
//                 details: error.message,
//                 fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
//             });
//         }
//     }
// };

// // Fallback function using axios if dbx.fileRequestsCreate fails
// const getDropboxLinkFallback = async (req, res) => {
//     try {
//         console.log('Attempting to create file request using axios...');
//         const response = await axios.post('https://api.dropboxapi.com/2/file_requests/create', {
//             title: "Upload Your files",
//             destination: "/uploads",
//             open: true
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log('File request created successfully:', response.data);
//         res.status(201).json({ "uploadurl": response.data.url });
//     } catch (error) {
//         console.error('Error in getDropboxLinkFallback:', error.response?.data || error.message);
//         console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
//         res.status(500).json({ 
//             error: 'Failed to create file request', 
//             details: error.response?.data || error.message,
//             fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
//         });
//     }
// };

// router.get("/get-upload-link", getDropboxLink);
// router.get("/get-upload-link-fallback", getDropboxLinkFallback);

// module.exports = router;



// utilitis\dropbox.js
const { Dropbox } = require('dropbox');
const router = require('express').Router();
const axios = require('axios');

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

const checkAccessToken = async () => {
    try {
        console.log('Checking access token...');
        const response = await axios.post('https://api.dropboxapi.com/2/users/get_current_account', null, {
            headers: {
                'Authorization': `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Access token is valid.');
        return true;
    } catch (error) {
        console.error('Error checking access token:', error.response?.data || error.message);
        return false;
    }
};

// Function to create folder for a user
const createUserFolder = async (userId) => {
    try {
        const userFolderPath = `/user_uploads/user_${userId}`;
        console.log(`Creating user folder: ${userFolderPath}`);
        
        const response = await dbx.filesCreateFolderV2({ 
            path: userFolderPath,
            autorename: false
        });
        
        console.log('User folder created successfully:', userFolderPath);
        return userFolderPath;
        
    } catch (error) {
        if (error.status === 409) {
            // Folder already exists - that's fine, we can use it
            console.log(`User folder already exists: /user_uploads/user_${userId}`);
            return `/user_uploads/user_${userId}`;
        } else {
            throw error;
        }
    }
};

// Function to create session folder inside user folder
const createSessionFolder = async (userFolderPath) => {
    try {
        const sessionFolderPath = `${userFolderPath}/session_${Date.now()}`;
        console.log(`Creating session folder: ${sessionFolderPath}`);
        
        const response = await dbx.filesCreateFolderV2({ 
            path: sessionFolderPath,
            autorename: false
        });
        
        console.log('Session folder created successfully:', sessionFolderPath);
        return sessionFolderPath;
        
    } catch (error) {
        if (error.status === 409) {
            // Session folder already exists (unlikely with timestamp)
            const fallbackPath = `${userFolderPath}/session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            const response = await dbx.filesCreateFolderV2({ 
                path: fallbackPath,
                autorename: false
            });
            return fallbackPath;
        } else {
            throw error;
        }
    }
};

// Main function to generate upload link for a user
const getDropboxUploadLink = async (req, res) => {
    try {
        // Validate token
        const isTokenValid = await checkAccessToken();
        if (!isTokenValid) {
            throw new Error('Invalid access token');
        }

        // Get user ID from request (you can get this from auth token, session, or request params)
        const userId = req.query.userId || req.body.userId || 'anonymous';
        console.log(`Generating upload link for user: ${userId}`);

        // 1. Create user folder (if doesn't exist)
        const userFolderPath = await createUserFolder(userId);

        // 2. Create session folder inside user folder
        const sessionFolderPath = await createSessionFolder(userFolderPath);

        // 3. Create file request for the session folder
        console.log(`Creating file request for folder: ${sessionFolderPath}`);
        const response = await dbx.fileRequestsCreate({
            title: `Upload Images - User ${userId}`,
            destination: sessionFolderPath,
            open: true,
            deadline: {
                deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hour expiry
                allow_late_uploads: 'extend_only'
            }
        });

        console.log('File request created successfully for user:', userId);
        
        res.status(201).json({ 
            success: true,
            uploadUrl: response.result.url,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            userFolder: userFolderPath,
            sessionFolder: sessionFolderPath,
            userId: userId
        });

    } catch (error) {
        console.error('Error in getDropboxUploadLink:', error);

        if (error.message === 'Invalid access token') {
            res.status(401).json({ 
                error: 'Authentication failed', 
                details: 'The Dropbox access token is invalid or has expired.'
            });
        } else if (error.status === 403) {
            res.status(403).json({ 
                error: 'Insufficient permissions', 
                details: 'Check your Dropbox app permissions.'
            });
        } else if (error.status === 409) {
            res.status(409).json({ 
                error: 'Folder conflict', 
                details: 'Please try again with a different user ID.'
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to create upload link', 
                details: error.message
            });
        }
    }
};

// Get user's upload history (optional)
const getUserUploads = async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        const userFolderPath = `/user_uploads/user_${userId}`;
        
        const response = await dbx.filesListFolder({
            path: userFolderPath,
            recursive: true
        });

        res.json({
            userId: userId,
            totalFolders: response.result.entries.filter(entry => entry['.tag'] === 'folder').length,
            totalFiles: response.result.entries.filter(entry => entry['.tag'] === 'file').length,
            entries: response.result.entries
        });

    } catch (error) {
        console.error('Error getting user uploads:', error);
        res.status(500).json({ error: 'Failed to get user uploads', details: error.message });
    }
};

// Routes
router.get("/get-upload-link", getDropboxUploadLink);
router.get("/user-uploads", getUserUploads);

module.exports = router;