const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const Flight = require('../models/Flight');
const Gate = require('../models/Gate');
const { auth, adminOnly } = require('../middleware/auth');

// Rota para deletar todos os voos (apenas admin)
router.delete('/all', auth, adminOnly, flightController.deleteAllFlights);

// Rotas CRUD básicas
router.post('/', auth, flightController.createFlight);
router.get('/', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);
router.put('/:id', flightController.updateFlight);
router.delete('/:id', flightController.deleteFlight);

// Atualizar o status de um voo (apenas admin)
router.put('/:id/status', auth, adminOnly, async (req, res) => {
    try {
        console.log('ID do voo recebido:', req.params.id);
        console.log('Status recebido:', req.body.status);
        console.log('Usuário autenticado:', req.user);

        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'O campo "status" é obrigatório.' });
        }

        if (!['programado', 'embarque', 'concluído'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido. Use: programado, embarque ou concluído.' });
        }

        const flight = await Flight.findById(req.params.id);
        if (!flight) {
            return res.status(404).json({ error: 'Voo não encontrado.' });
        }

        console.log('Voo encontrado:', flight);

        // Regras de negócio
        if (status === 'embarque') {
            // Verifica se o portão está disponível
            const gate = await Gate.findById(flight.portaoId);
            if (!gate) {
                return res.status(400).json({ error: 'O portão não está vinculado a este voo.' });
            }
            if (!gate.disponivel) {
                return res.status(400).json({ error: 'O portão não está disponível.' });
            }
            gate.disponivel = false;
            await gate.save();
            console.log('Portão atualizado para indisponível:', gate);
        } else if (status === 'concluído') {
            // Libera o portão automaticamente
            const gate = await Gate.findById(flight.portaoId);
            if (gate) {
                gate.disponivel = true;
                await gate.save();
                console.log('Portão atualizado para disponível:', gate);
            }
        }

        // Atualizar o status do voo
        flight.status = status;
        await flight.save();
        console.log('Status do voo atualizado:', flight);
        
        res.status(200).json(flight);
    } catch (error) {
        console.error('Erro ao atualizar status do voo:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;