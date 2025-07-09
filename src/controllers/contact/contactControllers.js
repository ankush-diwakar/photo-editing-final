const { Prisma } = require('@prisma/client');
const prisma = require('../../prisma');
const { get } = require('../../routes/contact/contactRoute');

const contactController = {
    addNewContactLead: async (req, res) => {
        try {
            const { name, email, phone, service, description } = req.body;

            const newContact = await prisma.contactLead.create({
                data: { name, email, phone, service, description }
            });

            res.status(201).json(newContact);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create contact' });
        }
    },
    getAllContactLeads: async (req, res) => {
        try {
            const contactLeads = await prisma.contactLead.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            res.json(contactLeads);
        } catch (error) {
            console.error('Error fetching contact leads:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
}

module.exports = { contactController };