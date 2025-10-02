// Servidor: index.js


var express = require('express');
var socket = require('socket.io');

// 2. Configurar la aplicación Express
var app = express();


var server = app.listen(4000, function(){
    console.log('Servidor corriendo en http://localhost:4000');
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