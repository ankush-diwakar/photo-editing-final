const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createFreeTrialLead = async (req, res) => {
  try {
    const { serviceId, service, brief, name, email, format, imageLink } = req.body;
    
    const newLead = await prisma.freeTrialLead.create({
      data: {
        serviceId,
        service,
        brief,
        name,
        email,
        format,
        imageLink
      }
    });
    
    res.status(201).json(newLead);
  } catch (error) {
    console.error('Error creating free trial lead:', error);
    res.status(500).json({ error: 'Failed to create free trial lead' });
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