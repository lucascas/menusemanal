const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const menuRoutes = require('./routes/menuRoutes'); // Ruta de los menús
const { Client, LocalAuth } = require('whatsapp-web.js'); // Importar whatsapp-web.js
const qrcode = require('qrcode-terminal'); // Importar QR para autenticación

const app = express();

// Configurar CORS para aceptar todas las solicitudes
app.use(cors({
    origin: '*',  // Permitir todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api', menuRoutes); // Ruta para las APIs

// Conexión a MongoDB Atlas usando la URI
mongoose.connect('mongodb+srv://lucascastillo:Cordoba6267@cluster0.2naw1.mongodb.net/menudb?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conexión a MongoDB exitosa'))
.catch((error) => console.error('Error conectando a MongoDB:', error));

// Definir el puerto directamente
const PORT = process.env.PORT || 5000; // Ahora el puerto se define correctamente

// Inicializar cliente de WhatsApp con autenticación local (esto guarda la sesión)
const client = new Client({
    authStrategy: new LocalAuth(), // Esto guarda la sesión en una carpeta .wwebjs_auth
});

// Mostrar código QR en consola para autenticación (solo la primera vez)
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Escanea este código QR con tu WhatsApp.');
});

// Confirmar que el cliente está listo
client.on('ready', () => {
    console.log('Cliente de WhatsApp listo para enviar mensajes.');
});

// Función para enviar un mensaje a un grupo específico
const sendMessageToGroup = async (groupName, messageText) => {
    try {
        // Obtener todos los chats de WhatsApp
        const chats = await client.getChats();
        // Buscar el grupo por su nombre
        const group = chats.find(chat => chat.isGroup && chat.name === groupName);

        if (group) {
            // Enviar el mensaje al grupo si existe
            await client.sendMessage(group.id._serialized, messageText);
            console.log(`Mensaje enviado al grupo ${groupName}`);
        } else {
            console.log('Grupo no encontrado.');
        }
    } catch (error) {
        console.error('Error enviando mensaje al grupo:', error);
    }
};

// Inicializar el cliente (esto arranca el proceso y conecta a WhatsApp)
client.initialize();

// Ruta para enviar el menú semanal al grupo de WhatsApp
app.post('/api/menus', async (req, res) => {
    const menuData = req.body;

    // Crear el mensaje a enviar con el menú
    const message = `
    Menú Semanal:

    Lunes:
    Almuerzo: ${menuData.Monday.lunch}
    Cena: ${menuData.Monday.dinner}

    Martes:
    Almuerzo: ${menuData.Tuesday.lunch}
    Cena: ${menuData.Tuesday.dinner}

    Miércoles:
    Almuerzo: ${menuData.Wednesday.lunch}
    Cena: ${menuData.Wednesday.dinner}

    Jueves:
    Almuerzo: ${menuData.Thursday.lunch}
    Cena: ${menuData.Thursday.dinner}

    Viernes:
    Almuerzo: ${menuData.Friday.lunch}
    Cena: ${menuData.Friday.dinner}

    Sábado:
    Almuerzo: ${menuData.Saturday.lunch}
    Cena: ${menuData.Saturday.dinner}

    Domingo:
    Almuerzo: ${menuData.Sunday.lunch}
    Cena: ${menuData.Sunday.dinner}

    Ingredientes:
    ${menuData.ingredients}
    `;

    // Enviar el mensaje al grupo de WhatsApp
    try {
        await sendMessageToGroup('MenuSemanal', message);  // Nombre del grupo "Menú Semanal"
        res.status(200).json({ message: 'Menú enviado por WhatsApp' });
    } catch (error) {
        res.status(500).json({ message: 'Error enviando el menú por WhatsApp' });
    }
});

// Configuración de rutas
app.use('/api', menuRoutes);

// Configurar el puerto y escuchar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
