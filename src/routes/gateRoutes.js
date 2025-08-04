// filepath: /Users/joaovictorrochavilelagodoi/sd-atividade/sd-atividade/src/routes/gateRoutes.js
const express = require('express');
const router = express.Router();
const Gate = require('../models/Gate'); // Importa o modelo de portão
const { auth, adminOnly } = require('../middleware/auth');

// Rota para deletar todos os portões (apenas admin)
router.delete('/all', auth, adminOnly, async (req, res) => {
    try {
        await Gate.deleteMany({});
        res.status(200).json({ message: 'Todos os portões foram deletados com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar um novo portão (apenas admin)
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const { codigo, disponivel } = req.body;

        // Validação básica
        if (!codigo) {
            return res.status(400).json({ error: 'O campo "codigo" é obrigatório.' });
        }

        const gate = new Gate({
            codigo,
            disponivel: disponivel !== undefined ? disponivel : true, // Valor padrão
        });

        await gate.save();
        res.status(201).json(gate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar todos os portões (todos podem ver)
router.get('/', async (req, res) => {
    try {
        const gates = await Gate.find();
        res.status(200).json(gates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obter um portão por ID (todos podem ver)
router.get('/:id', async (req, res) => {
    try {
        const gate = await Gate.findById(req.params.id);
        if (!gate) {
            return res.status(404).json({ error: 'Portão não encontrado.' });
        }
        res.status(200).json(gate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar um portão por ID (apenas admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
    try {
        const { codigo, disponivel } = req.body;

        const gate = await Gate.findByIdAndUpdate(
            req.params.id,
            { codigo, disponivel },
            { new: true, runValidators: true }
        );

        if (!gate) {
            return res.status(404).json({ error: 'Portão não encontrado.' });
        }

        res.status(200).json(gate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deletar um portão por ID (apenas admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const gate = await Gate.findByIdAndDelete(req.params.id);
        if (!gate) {
            return res.status(404).json({ error: 'Portão não encontrado.' });
        }
        res.status(200).json({ message: 'Portão deletado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;