const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Inicializar cliente de WhatsApp con autenticación local (esto permite guardar la sesión)
const client = new Client({
    authStrategy: new LocalAuth()
});

// Mostrar código QR en consola para autenticación
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Confirmar que el cliente está listo
client.on('ready', () => {
    console.log('Cliente WhatsApp listo!');
});

// Manejar mensajes nuevos
client.on('message', message => {
    console.log(`Mensaje recibido de ${message.from}: ${message.body}`);
});

// Función para enviar un mensaje a un grupo
const sendMessageToGroup = async (groupName, messageText) => {
    try {
        const chats = await client.getChats();
        const group = chats.find(chat => chat.isGroup && chat.name === groupName);

        if (group) {
            await client.sendMessage(group.id._serialized, messageText);
            console.log(`Mensaje enviado al grupo ${groupName}`);
        } else {
            console.log('Grupo no encontrado');
        }
    } catch (error) {
        console.error('Error enviando mensaje al grupo:', error);
    }
};

// Inicializar el cliente
client.initialize();

module.exports = { sendMessageToGroup };
