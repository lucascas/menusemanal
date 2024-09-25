// models/Comida.js
const mongoose = require('mongoose');

const comidaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ingredientes: { type: String, required: true },
  tipo: { type: String, required: true },
  momento: { type: String, required: true },  // Nuevo campo
});

const Comida = mongoose.model('Comida', comidaSchema);

module.exports = Comida;
