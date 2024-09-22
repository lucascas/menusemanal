const express = require('express');
const Menu = require('../models/Menu');

const router = express.Router();

// Obtener todos los menús
router.get('/menus', async (req, res) => {
  try {
    const menus = await Menu.find();  // Obtener todos los menús guardados
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los menús' });
  }
});

// Guardar un nuevo menú con almuerzo y cena por día
router.post('/menus', async (req, res) => {
  const { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } = req.body;

  if (!Monday || !Tuesday || !Wednesday || !Thursday || !Friday || !Saturday || !Sunday) {
    return res.status(400).json({ message: 'Todos los días de la semana son obligatorios' });
  }

  try {
    const newMenu = new Menu(req.body);
    await newMenu.save();
    res.json(newMenu);
  } catch (error) {
    console.error('Error al guardar el menú:', error);
    res.status(500).json({ message: 'Error al guardar el menú' });
  }
});

module.exports = router;
