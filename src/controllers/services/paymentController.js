const prisma = require("../../prisma");
const { Prisma } = require('@prisma/client');
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_ygTvsqmsNgMBQG',
  key_secret: 'bVBeYmoQnsUtfemhiO3euJU6'
});

const paymentController = {
    createRazorpayOrder: async (req, res) => {
        try {
            const { amount, currency, jobId } = req.body;

            // Validate job exists
            const job = await prisma.job.findUnique({ where: { id: Number(jobId) } });
            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }

            const options = {
                amount: amount * 100, // Razorpay expects amount in paise
                currency: currency,
                receipt: `job_${jobId}`,
                payment_capture: 1
            };

            const order = await razorpay.orders.create(options);

            res.status(200).json({
                id: order.id,
                currency: order.currency,
                amount: order.amount
            });
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            res.status(500).json({ message: "Error creating Razorpay order", error: error.message });
        }
    },

    createPayment: async (req, res) => {
        try {
            const {
                jobId, seriesType, amount, currency, paymentMethod,
                clientName, clientEmail, clientPhone, clientGstin, clientAddress, clientCity,
                clientState, clientCountry, razorpayPaymentId, razorpayOrderId, razorpaySignature
            } = req.body;

            // Validate job exists
            const job = await prisma.job.findUnique({ where: { id: Number(jobId) } });
            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }

            // Generate series number
            const currentDate = new Date();
            const fiscalYear = currentDate.getMonth() >= 3 ? 
                `${currentDate.getFullYear()}-${currentDate.getFullYear() + 1}` : 
                `${currentDate.getFullYear() - 1}-${currentDate.getFullYear()}`;

            const latestPayment = await prisma.payment.findFirst({
                where: { seriesType, fiscalYear },
                orderBy: { seriesNumber: 'desc' }
            });

            let seriesNumber;
            if (latestPayment) {
                const latestNumber = parseInt(latestPayment.seriesNumber.slice(-5));
                seriesNumber = `${seriesType}${fiscalYear.slice(-2)}${(latestNumber + 1).toString().padStart(5, '0')}`;
            } else {
                seriesNumber = `${seriesType}${fiscalYear.slice(-2)}00001`;
            }

            // Calculate taxes
            let cgstAmount = 0;
            let sgstAmount = 0;
            let igstAmount = 0;
            let totalTaxAmount = 0;

            if (clientCountry.toLowerCase() === 'india') {
                if (clientState.toLowerCase() === 'rajasthan') {
                    igstAmount = amount * 0.18;
                } else {
                    cgstAmount = amount * 0.09;
                    sgstAmount = amount * 0.09;
                }
            }

            totalTaxAmount = cgstAmount + sgstAmount + igstAmount;
            const totalAmount = amount + totalTaxAmount;

            // Generate invoice number
            const invoiceNumber = `INV-${seriesNumber}`;

            // Create payment
            const payment = await prisma.payment.create({
                data: {
                    jobId: Number(jobId),
                    seriesType,
                    seriesNumber,
                    fiscalYear,
                    amount,
                    currency,
                    paymentMethod,
                    invoiceNumber,
                    invoiceDate: new Date(),
                    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Due date 30 days from now
                    clientName,
                    clientEmail,
                    clientPhone,
                    clientGstin,
                    clientAddress,
                    clientCity,
                    clientState,
                    clientCountry,
                    cgstAmount,
                    sgstAmount,
                    igstAmount,
                    totalTaxAmount,
                    totalAmount,
                    status: 'PAID'
                },
                include: { job: true }
            });

            res.status(201).json({ message: "Payment created successfully", payment });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    getAllPayments: async (req, res) => {
        try {
            const payments = await prisma.payment.findMany({
                include: { job: true }
            });
            if (payments.length === 0) {
                return res.status(404).json({ message: "No payments found" });
            }
            res.status(200).json({ payments });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    getPayment: async (req, res) => {
        try {
            const { id } = req.params;
            const payment = await prisma.payment.findUnique({
                where: { id },
                include: { job: true }
            });
            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }
            res.status(200).json({ payment });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    updatePayment: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, paymentMethod } = req.body;
            const payment = await prisma.payment.update({
                where: { id },
                data: {
                    status,
                    paymentMethod
                },
                include: { job: true }
            });
            res.status(200).json({ message: "Payment updated successfully", payment });
        } catch (error) {
            handlePrismaError(error, res);
        }
    },

    deletePayment: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.payment.delete({
                where: { id }
            });
            res.status(200).json({ message: 'Payment deleted successfully' });
        } catch (error) {
            handlePrismaError(error, res);
        }
    }
};

function handlePrismaError(error, res) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return res.status(409).json({ message: "A unique constraint would be violated on Payment. Details: " + error.meta.target });
            case 'P2025':
                return res.status(404).json({ message: "Record not found" });
            case 'P2003':
                return res.status(400).json({ message: "Foreign key constraint failed on the field: " + error.meta.field_name });
            default:
                return res.status(400).json({ message: "Database error", error: error.message });
        }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({ message: "Validation error", error: error.message });
    } else {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = { paymentController };