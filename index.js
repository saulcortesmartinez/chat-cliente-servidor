// Servidor: index.js

var express = require('express');
var socket = require('socket.io');

// 2. Configurar la aplicación Express
var app = express();

// A. ¡NUEVA LÍNEA CLAVE!
// Define el puerto. Usa el puerto del entorno de la nube (process.env.PORT) o el 4000 si es local.
var PORT = process.env.PORT || 4000;

// 3. Levantar el servidor HTTP
// Usa la variable PORT para escuchar en el puerto correcto.
var server = app.listen(PORT, function(){
    console.log('Servidor corriendo en el puerto ' + PORT);
    // Nota: El mensaje de consola ahora mostrará 4000 en local y el puerto asignado en la nube.
});


app.use(express.static('public'));


var io = socket(server);

// 6. Manejar eventos de conexión de Socket.io
io.on('connection', function(socket) {
    console.log('Hay una conexion', socket.id);

    // Evento para recibir mensajes de chat
    socket.on('chat', function(data) {
        // Enviar el mensaje a *todos* los clientes conectados
        io.sockets.emit('chat', data);
    });

    // Evento para notificar que un usuario está escribiendo
    socket.on('typing', function(data) {
        // Enviar la notificación a *todos los demás* clientes (no al que está escribiendo)
        socket.broadcast.emit('typing', data);
    });
});