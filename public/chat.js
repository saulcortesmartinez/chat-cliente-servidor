// Cliente: public/chat.js

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


function ingresarAlChat(){
    if (persona.value) {
        
        panelBienvenida.style.display = "none";
        appChat.style.display = "block";
        
        
        var nombreDeUsuario = persona.value;
        usuario.value = nombreDeUsuario;
        usuario.readOnly = true;
    }
}


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
    if (usuario.value) { 
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