// Cliente: public/chat.js

// 1. Establecer conexión con el servidor Socket.io
//    Nota: io() se hace disponible gracias al script de socket.io en index.html
var socket = io.connect('http://localhost:4000');

// 2. Obtener referencias a elementos del DOM
var persona = document.getElementById('persona'),
    appChat = document.getElementById('app-chat'),
    panelBienvenida = document.getElementById("panel-bienvenida"),
    usuario = document.getElementById('usuario'),
    mensaje = document.getElementById('mensaje'),
    botonEnviar = document.getElementById('enviar'),
    escribiendoMensaje = document.getElementById('escribiendo-mensaje'),
    output = document.getElementById("output");

// 3. Función para ingresar al chat (llamada desde el botón en index.html)
function ingresarAlChat(){
    if (persona.value) {
        // Ocultar el panel de bienvenida y mostrar la aplicación de chat
        panelBienvenida.style.display = "none";
        appChat.style.display = "block";
        
        // Asignar el nombre de usuario y hacerlo de solo lectura
        var nombreDeUsuario = persona.value;
        usuario.value = nombreDeUsuario;
        usuario.readOnly = true;
    }
}

// 4. Listener para el botón de enviar mensaje
botonEnviar.addEventListener('click', function(){
    if(mensaje.value) {
        // Emitir un evento 'chat' al servidor con el mensaje y el usuario
        socket.emit("chat", {
            mensaje: mensaje.value,
            usuario: usuario.value
        });
        mensaje.value = ''; // Limpiar el campo de mensaje
    }
});

// 5. Listener para detectar cuando un usuario está escribiendo
mensaje.addEventListener("keyup", function(){
    if (usuario.value) { // Solo si el usuario ya ingresó al chat
        // Emitir un evento 'typing' con el nombre del usuario y el contenido del mensaje
        socket.emit('typing', {
            nombre: usuario.value,
            texto: mensaje.value
        });
    }
});

// 6. Listener para recibir mensajes del servidor
socket.on('chat', function(data) {
    // Limpiar el mensaje de 'escribiendo' y mostrar el nuevo mensaje
    escribiendoMensaje.innerHTML = "";
    output.innerHTML += '<p><strong>' + data.usuario + ':</strong> ' + data.mensaje + '</p>';
});

// 7. Listener para recibir notificaciones de 'escribiendo' del servidor
socket.on('typing', function(data){
    if(data.texto){
        // Mostrar el mensaje de que alguien está escribiendo
        escribiendoMensaje.innerHTML = '<p><em>' + data.nombre + ' está escribiendo un mensaje....</em></p>';
    } else {
        // Si el texto está vacío, ocultar el mensaje de 'escribiendo'
        escribiendoMensaje.innerHTML = "";
    }
});