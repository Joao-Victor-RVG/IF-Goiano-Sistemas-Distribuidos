const Passenger = require('../models/Passenger');

exports.createPassenger = async (req, res) => {
    try {
        const passenger = new Passenger(req.body);
        await passenger.save();
        res.status(201).json(passenger);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllPassengers = async (req, res) => {
    try {
        const passengers = await Passenger.find();
        res.status(200).json(passengers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPassengerById = async (req, res) => {
    try {
        const passenger = await Passenger.findById(req.params.id);
        if (!passenger) return res.status(404).json({ error: 'Passageiro não encontrado' });
        res.status(200).json(passenger);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePassenger = async (req, res) => {
    try {
        const passenger = await Passenger.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!passenger) return res.status(404).json({ error: 'Passageiro não encontrado' });
        res.status(200).json(passenger);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePassenger = async (req, res) => {
    try {
        const passenger = await Passenger.findByIdAndDelete(req.params.id);
        if (!passenger) return res.status(404).json({ error: 'Passageiro não encontrado' });
        res.status(200).json({ message: 'Passageiro deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAllPassengers = async (req, res) => {
    try {
        await Passenger.deleteMany({});
        res.status(200).json({ message: 'Todos os passageiros foram deletados com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};