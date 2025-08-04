const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Cadastrar novo funcionário
exports.createEmployee = async (req, res) => {
    try {
        const { nome, email, senha, cargo } = req.body;

        // Verifica se já existe um funcionário com este email
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }

        const employee = new Employee({
            nome,
            email,
            senha,
            cargo
        });

        await employee.save();

        // Remove a senha do objeto retornado
        const employeeResponse = employee.toObject();
        delete employeeResponse.senha;

        res.status(201).json(employeeResponse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login de funcionário
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Busca o funcionário pelo email
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        // Verifica a senha
        const isMatch = await employee.comparePassword(senha);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            { 
                id: employee._id,
                nome: employee.nome,
                cargo: employee.cargo
            },
            JWT_SECRET,
            { expiresIn: '30m' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 