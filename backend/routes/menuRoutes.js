const express = require('express');
const Menu = require('../models/Menu');

const router = express.Router();

// Obtener todos los menús
router.get('/menus', async (req, res) => {
  try {
    const menus = await Menu.find();  // Obtener todos los menús guardados en la base de datos
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los menús' });
  }
});

// Guardar un nuevo menú
router.post('/menu', async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    await newMenu.save();
    res.json(newMenu); // Responder con el menú guardado
  } catch (error) {
    console.error('Error al guardar el menú:', error); // Esto imprimirá el error en la consola del servidor
    res.status(500).json({ message: 'Error al guardar el menú' });
  }
});


module.exports = router;
