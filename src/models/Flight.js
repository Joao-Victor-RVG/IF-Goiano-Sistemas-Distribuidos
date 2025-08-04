const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    numeroVoo: { type: String, required: true },
    origem: { type: String, required: true },
    destino: { type: String, required: true },
    dataHoraPartida: { type: Date, required: true },
    portaoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gate' },
    status: { type: String, enum: ['programado', 'embarque', 'concluído'], default: 'programado' },
});

module.exports = mongoose.model('Flight', flightSchema);