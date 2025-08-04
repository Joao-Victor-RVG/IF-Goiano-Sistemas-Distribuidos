const Flight = require('../models/Flight');

exports.createFlight = async (req, res) => {
    try {
        const flight = new Flight(req.body);
        await flight.save();
        res.status(201).json(flight);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find();
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });
        res.status(200).json(flight);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateFlight = async (req, res) => {
    try {
        const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });
        res.status(200).json(flight);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteFlight = async (req, res) => {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id);
        if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });
        res.status(200).json({ message: 'Voo deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAllFlights = async (req, res) => {
    try {
        await Flight.deleteMany({});
        res.status(200).json({ message: 'Todos os voos foram deletados com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 