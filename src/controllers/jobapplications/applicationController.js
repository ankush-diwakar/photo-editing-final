const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

const applicationController = {
    // Get all applications with job details
    getAllApplications: async (req, res) => {
        try {
            const { page = 1, limit = 10, jobId, status } = req.query;
            const skip = (page - 1) * limit;

            const where = {};
            if (jobId) where.jobOpeningId = parseInt(jobId);

            const applications = await prisma.jobApplication.findMany({
                where,
                include: {
                    jobOpening: {
                        select: {
                            id: true,
                            title: true,
                            // Remove department and location as they don't exist
                            // Add fields that actually exist in your JobOpening model
                            description: true,
                            postedDate: true,
                            isActive: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: parseInt(skip),
                take: parseInt(limit)
            });

            const total = await prisma.jobApplication.count({ where });

            res.json({
                success: true,
                data: applications,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Error fetching applications:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching applications',
                error: error.message
            });
        }
    },

    // Get application by ID
    getApplicationById: async (req, res) => {
        try {
            const { id } = req.params;

            const application = await prisma.jobApplication.findUnique({
                where: { id: parseInt(id) },
                include: {
                    jobOpening: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            postedDate: true,
                            isActive: true
                        }
                    }
                }
            });

            if (!application) {
                return res.status(404).json({
                    success: false,
                    message: 'Application not found'
                });
            }

            res.json({
                success: true,
                data: application
            });
        } catch (error) {
            console.error('Error fetching application:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching application',
                error: error.message
            });
        }
    },

    // Download resume
    downloadResume: async (req, res) => {
        try {
            const { id } = req.params;

            const application = await prisma.jobApplication.findUnique({
                where: { id: parseInt(id) },
                select: { resumePath: true, fullName: true }
            });

            if (!application || !application.resumePath) {
                return res.status(404).json({
                    success: false,
                    message: 'Resume not found'
                });
            }

            // Construct the full file path
            const uploadsDir = path.join(process.cwd(), 'uploads', 'applications');
            const filePath = path.join(uploadsDir, application.resumePath);

            console.log('File path:', filePath);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Resume file not found on server'
                });
            }

            const fileName = `${application.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', 'application/pdf');

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);

            fileStream.on('error', (error) => {
                console.error('Error streaming file:', error);
                res.status(500).end();
            });

        } catch (error) {
            console.error('Error downloading resume:', error);
            res.status(500).json({
                success: false,
                message: 'Error downloading resume',
                error: error.message
            });
        }
    },

    // Download cover letter
    downloadCoverLetter: async (req, res) => {
          try {
        const { id } = req.params;

        // 1. Get application data
        const application = await prisma.jobApplication.findUnique({
            where: { id: parseInt(id) },
            select: { coverLetterPath: true, fullName: true }
        });

        // 2. Check if application and cover letter exist
        if (!application || !application.coverLetterPath) {
            return res.status(404).json({
                success: false,
                message: 'Cover letter not found in database records'
            });
        }

        // 3. Construct the correct file path
        const uploadsDir = path.join(process.cwd(), 'uploads', 'applications');
        const filePath = path.join(uploadsDir, application.coverLetterPath);
        
        console.log('Attempting to access:', filePath);  // Debug log

        // 4. Verify file exists
        if (!fs.existsSync(filePath)) {
            console.error('File not found at:', filePath);  // Debug log
            return res.status(404).json({
                success: false,
                message: 'Cover letter file not found in storage'
            });
        }

        // 5. Set download headers
        const sanitizedName = application.fullName.replace(/[^a-zA-Z0-9_-]/g, '_');
        const fileName = `${sanitizedName}_CoverLetter.pdf`;
        
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/pdf');

        // 6. Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (error) => {
            console.error('Stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Error streaming file'
                });
            }
        });

    } catch (error) {
        console.error('Endpoint error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Internal server error while downloading cover letter',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
    },

    // Get applications by job opening
    getApplicationsByJob: async (req, res) => {
        try {
            const { jobId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;

            const applications = await prisma.jobApplication.findMany({
                where: { jobOpeningId: parseInt(jobId) },
                include: {
                    jobOpening: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            postedDate: true,
                            isActive: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: parseInt(skip),
                take: parseInt(limit)
            });

            const total = await prisma.jobApplication.count({
                where: { jobOpeningId: parseInt(jobId) }
            });

            res.json({
                success: true,
                data: applications,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Error fetching applications by job:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching applications',
                error: error.message
            });
        }
    }
};

module.exports = applicationController;