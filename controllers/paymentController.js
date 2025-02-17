const Payment = require('../models/PaymentModel');


exports.createPayment = async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('userId reservationId');
        res.status(200).json(payments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('userId reservationId');
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
        res.status(200).json({ message: 'Payment deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};