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
        console.log('Access token is valid. Account info:', JSON.stringify(response.data, null, 2));
        return true;
    } catch (error) {
        console.error('Error checking access token:', error.response?.data || error.message);
        return false;
    }
};

const getDropboxLink = async (req, res) => {
    try {
        // Check if the access token is valid
        const isTokenValid = await checkAccessToken();
        if (!isTokenValid) {
            throw new Error('Invalid access token');
        }

        console.log('Attempting to create file request...');
        const response = await dbx.fileRequestsCreate({
            title: "Upload Your files",
            destination: "/uploads",
            open: true
        });

        console.log('File request created successfully:', response.result);
        res.status(201).json({ "uploadurl": response.result });
    } catch (error) {
        console.error('Error in getDropboxLink:', error);

        if (error.message === 'Invalid access token') {
            res.status(401).json({ 
                error: 'Authentication failed', 
                details: 'The Dropbox access token is invalid or has expired. Please check your token and try again.'
            });
        } else if (error.status === 403) {
            res.status(403).json({ 
                error: 'Insufficient permissions', 
                details: 'The app may be missing required scopes. Please check your app permissions in the Dropbox App Console.'
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to create file request', 
                details: error.message,
                fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
            });
        }
    }
};

// Fallback function using axios if dbx.fileRequestsCreate fails
const getDropboxLinkFallback = async (req, res) => {
    try {
        console.log('Attempting to create file request using axios...');
        const response = await axios.post('https://api.dropboxapi.com/2/file_requests/create', {
            title: "Upload Your files",
            destination: "/uploads",
            open: true
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('File request created successfully:', response.data);
        res.status(201).json({ "uploadurl": response.data.url });
    } catch (error) {
        console.error('Error in getDropboxLinkFallback:', error.response?.data || error.message);
        console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        res.status(500).json({ 
            error: 'Failed to create file request', 
            details: error.response?.data || error.message,
            fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
        });
    }
};

router.get("/get-upload-link", getDropboxLink);
router.get("/get-upload-link-fallback", getDropboxLinkFallback);

module.exports = router;