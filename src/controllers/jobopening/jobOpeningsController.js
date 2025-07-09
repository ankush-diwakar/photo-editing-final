const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllJobOpenings = async (req, res) => {
  try {
    const jobOpenings = await prisma.jobOpening.findMany({
      where: { isActive: true },
      orderBy: { postedDate: 'desc' }
    });
    res.json(jobOpenings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job openings' });
  }
};

exports.createJobOpening = async (req, res) => {
  const { title, description, imageUrl, isActive } = req.body;
  try {
    const newJob = await prisma.jobOpening.create({
      data: {
        title,
        description,
        imageUrl,
        isActive: isActive !== false
      }
    });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create job opening' }); 
  }
};

exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl, isActive } = req.body;

  try {
    const updatedJob = await prisma.jobOpening.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        imageUrl,
        isActive
      }
    });
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update job opening' });
  }
};

exports.deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.jobOpening.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Job opening deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete job opening' });
  }
};

//--------

exports.getJobOpenings = async (req, res) => {
  try {
    const jobOpenings = await prisma.jobOpening.findMany({
      where: { isActive: true },
      orderBy: { postedDate: 'desc' }
    });
    res.json(jobOpenings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job openings' });
  }
};

// POST: Submit job application
exports.submitJobApplication = async (req, res) => {
  try {
    const {
      email,
      fullName,
      contactNo,
      currentCompany,
      currentDesignation,
      currentCTC,
      expectedCTC,
      currentLocation,
      overallExperience,
      jobType,
      noticePeriod,
      portfolioLink,
      jobOpeningId
    } = req.body;

    const jobOpening = await prisma.jobOpening.findFirst({
      where: {
        id: parseInt(jobOpeningId),
        isActive: true
      }
    });

    if (!jobOpening) {
      return res.status(404).json({ error: 'Job opening not found or inactive' });
    }

    const coverLetterPath = req.files['coverLetter'] ? req.files['coverLetter'][0].filename : null;
    const resumePath = req.files['resume'] ? req.files['resume'][0].filename : null;

    const application = await prisma.jobApplication.create({
      data: {
        email,
        fullName,
        contactNo,
        currentCompany,
        currentDesignation,
        currentCTC,
        expectedCTC,
        currentLocation,
        overallExperience,
        jobType,
        noticePeriod,
        coverLetterPath,
        resumePath,
        portfolioLink,
        jobOpeningId: parseInt(jobOpeningId)
      }
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};