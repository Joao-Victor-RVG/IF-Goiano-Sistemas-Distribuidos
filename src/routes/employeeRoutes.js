const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Rota de cadastro
router.post('/register', employeeController.createEmployee);

// Rota de login
router.post('/login', employeeController.login);

module.exports = router; 