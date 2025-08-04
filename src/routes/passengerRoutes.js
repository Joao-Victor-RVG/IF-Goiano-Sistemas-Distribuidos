const express = require('express');
const passengerController = require('../controllers/passengerController');
const router = express.Router();
const Passenger = require('../models/Passenger');

// Rota para deletar todos os passageiros (deve vir antes da rota /:id)
router.delete('/all', passengerController.deleteAllPassengers);

// Rotas CRUD básicas
router.post('/', passengerController.createPassenger);
router.get('/', passengerController.getAllPassengers);
router.get('/:id', passengerController.getPassengerById);
router.put('/:id', passengerController.updatePassenger);
router.delete('/:id', passengerController.deletePassenger);

// Atualizar o status de check-in de um passageiro
router.put('/:id/checkin', async (req, res) => {
    try {
        const passenger = await Passenger.findById(req.params.id);
        if (!passenger) {
            return res.status(404).json({ error: 'Passageiro não encontrado.' });
        }

        const Flight = require('../models/Flight');
        const flight = await Flight.findById(passenger.vooId);
        if (!flight) {
            return res.status(404).json({ error: 'Voo não encontrado para este passageiro.' });
        }
        if (flight.status !== 'embarque') {
            return res.status(400).json({ error: 'O check-in só pode ser realizado se o voo estiver com status "embarque".' });
        }

        passenger.statusCheckin = 'realizado';
        await passenger.save();

        res.status(200).json(passenger);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;