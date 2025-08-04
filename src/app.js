const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const passengerRoutes = require('./routes/passengerRoutes');
const flightRoutes = require('./routes/flightRoutes');
const gateRoutes = require('./routes/gateRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// Conectar ao banco de dados
connectDB();

// Middlewares
app.use(bodyParser.json());

// Rotas
app.use('/passengers', passengerRoutes);
app.use('/flights', flightRoutes);
app.use('/gates', gateRoutes);
app.use('/employees', employeeRoutes);

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});