require('dotenv').config(); // Asegúrate de que esté en la parte superior para cargar las variables de entorno
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const menuRoutes = require('./routes/menuRoutes'); // Ruta de los menús

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas usando la URI desde el archivo .env
mongoose.connect('mongodb+srv://lucascastillo:Cordoba6267@cluster0.2naw1.mongodb.net/menudb?retryWrites=true&w=majority&appName=Cluster0', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
 })
.then(() => console.log('Conexión a MongoDB exitosa'))
.catch((error) => console.error('Error conectando a MongoDB:', error));

// Configuración de rutas
//app.use('/api/menus', menuRoutes);
app.use('/api', menuRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
   console.log(`Servidor corriendo en el puerto ${port}`);
});
