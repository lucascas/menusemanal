const mongoose = require('mongoose');

// Definir el esquema para el menú semanal con almuerzo y cena por día
const menuSchema = new mongoose.Schema({
  Monday: {
    lunch: String,
    dinner: String,
  },
  Tuesday: {
    lunch: String,
    dinner: String,
  },
  Wednesday: {
    lunch: String,
    dinner: String,
  },
  Thursday: {
    lunch: String,
    dinner: String,
  },
  Friday: {
    lunch: String,
    dinner: String,
  },
  Saturday: {
    lunch: String,
    dinner: String,
  },
  Sunday: {
    lunch: String,
    dinner: String,
  }
});

// Exportar el modelo basado en el esquema
module.exports = mongoose.model('Menu', menuSchema);
