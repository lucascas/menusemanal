require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const menuRoutes = require('./routes/menuRoutes');

const app = express();

// Habilitar CORS para que el frontend (puerto 3000) pueda comunicarse con el backend (puerto 5000)
app.use(cors());

// Middleware para analizar las solicitudes con JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Usar las rutas del menú
app.use('/api', menuRoutes);

// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
