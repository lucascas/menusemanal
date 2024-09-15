const mongoose = require('mongoose');

// Definir el esquema para el menú semanal
const menuSchema = new mongoose.Schema({
  Monday: { type: String, required: true },    // Se espera una cadena de texto para cada día
  Tuesday: { type: String, required: true },
  Wednesday: { type: String, required: true },
  Thursday: { type: String, required: true },
  Friday: { type: String, required: true },
  Saturday: { type: String, required: true },
  Sunday: { type: String, required: true }
});

// Exportar el modelo basado en el esquema
module.exports = mongoose.model('Menu', menuSchema);
