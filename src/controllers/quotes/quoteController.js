const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller function to handle the quote submission
exports.submitQuote = async (req, res) => {
  try {
    const {
      selectedServiceId,
      name,
      email,
      address,
      country,
      company,
      phone,
      webAddress,
      jobType,
      quantity,
      deliveryTime,
      returnFileFormat,
      linkType,
      dropboxLink,
      selectedSubServices,
      numberOfPhotos,
      instructions,
    } = req.body;

    const uploadedFilePaths = req.files ? req.files.map(file => file.path) : [];
    const subServiceIds = JSON.parse(selectedSubServices || '[]').map(id => parseInt(id, 10));

    const newQuoteRequest = await prisma.quoteRequest.create({
      data: {
        serviceId: parseInt(selectedServiceId, 10),
        subServiceIds: subServiceIds,
        name,
        email,
        address,
        country,
        company,
        phone,
        webAddress,
        jobType,
        quantity: parseInt(quantity, 10),
        deliveryTime,
        returnFileFormat,
        linkType,
        dropboxLink,
        uploadedFilePaths: uploadedFilePaths,
        numberOfPhotos: parseInt(numberOfPhotos, 10),
        instructions,
      },
    });

    res.status(201).json({ message: 'Quote request submitted successfully!', data: newQuoteRequest });
  } catch (error) {
    console.error('Error submitting quote request:', error);
    res.status(500).json({ message: 'An error occurred while submitting the request.' });
  }
};