const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllQuoteRequests = async (req, res) => {
    try {
        const quoteRequests = await prisma.quoteRequest.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                serviceId: true,
                subServiceIds: true,
                name: true,
                email: true,
                address: true,
                country: true,
                company: true,
                phone: true,
                webAddress: true,
                jobType: true,
                quantity: true,
                deliveryTime: true,
                returnFileFormat: true,
                linkType: true,
                dropboxLink: true,
                uploadedFilePaths: true,
                numberOfPhotos: true,
                instructions: true
            }
        });

        return res.status(200).json({
            success: true,
            data: quoteRequests
        });
    } catch (error) {
        console.error('Error fetching quote requests:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

module.exports = {
    getAllQuoteRequests
};
