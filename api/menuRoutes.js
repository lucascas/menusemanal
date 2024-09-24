const express = require('express');
const Menu = require('../models/Menu');
const router = express.Router();
const Comida = require('../models/Comida');  // Modelo Comida (si usas Mongoose o similar)

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

// POST para agregar una nueva comida
router.post('/comidas', async (req, res) => {
  const { nombre, ingredientes, tipo, momento } = req.body;  // Asegúrate de que 'momento' se reciba aquí

  try {
    const nuevaComida = new Comida({ nombre, ingredientes, tipo, momento });  // Incluye 'momento' en el objeto
    await nuevaComida.save();
    res.status(201).json(nuevaComida);
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar la comida', error });
  }
});



// Ruta GET para obtener todas las comidas
router.get('/comidas', async (req, res) => {
  try {
    const comidas = await Comida.find();  // Obtener todas las comidas desde la base de datos
    res.json(comidas);  // Retornar en formato JSON
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las comidas' });
  }
});

module.exports = router;
