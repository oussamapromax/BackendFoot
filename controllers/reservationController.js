const Reservation = require('../models/reservationModel');
const Payment = require('../models/PaymentModel');


exports.createReservation = async (req, res) => {
    try {
      const { userId, terrainId, date, amount } = req.body;
  
      // Créer le paiement
      const payment = new Payment({ amount, status: 'pending' });
      await payment.save();
  
      // Créer la réservation
      const reservation = new Reservation({ userId, terrainId, date, paymentId: payment._id });
      await reservation.save();
  
      // Associer le paiement à la réservation
      payment.reservationId = reservation._id;
      await payment.save();
  
      res.status(201).json({ reservation, payment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('userId terrainId');
        res.status(200).json(reservations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate('userId terrainId');
        if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
        res.status(200).json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
        res.status(200).json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
        res.status(200).json({ message: 'Reservation deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};