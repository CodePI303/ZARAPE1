let clientes = [];

export function agregarCliente() {
    // Obtenemos los valores de los campos del formulario
    let v_nombre = document.getElementById("nombre").value;
    let v_apellidos = document.getElementById("apellidos").value;
    let v_telefono = document.getElementById("tel").value;
    let v_ciudad = parseInt(document.getElementById("ciudades").value);
    let v_estado = parseInt(document.getElementById("estados").value);
    let v_user = document.getElementById("user").value;
    let v_contrasenia = document.getElementById("pass").value;

    // Estructura del objeto cliente
    let tblCliente = {
        idCliente: -1, // Inicialmente desconocido, será asignado por el servidor
        activo: 1,     // Cliente está activo
        persona: {
            idPersona: -1,  // ID generado por el servidor
            nombre: v_nombre,
            apellidos: v_apellidos,
            telefono: v_telefono,
            ciudad: {
                idCiudad: v_ciudad, // Ciudad seleccionada en el formulario
                nombre: "",         // Se completa desde el servidor
                estado: {
                    idEstado: v_estado,   // Puede omitirse o completarse según la lógica
                    nombre: ""      // Se completa desde el servidor
                }
            }
        },
        usuario: {
            idUsuario: -1,        // ID generado por el servidor
            activo: 1,            // Usuario está activo
            nombre: v_user,       // Nombre de usuario
            contrasenia: v_contrasenia // Contraseña del usuario
        }
    };

    // Preparamos los datos para enviarlos al servidor
    let datos_servidor = { datosCliente: JSON.stringify(tblCliente) };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };
 
    // Realizamos la solicitud al servidor
    fetch('http://localhost:8080/Zarape-/api/cliente/agregar', registro)
        .then(response => response.json())
        .then(json => console.log("Cliente agregado:", json))
        .catch(error => console.error("Error al agregar el cliente:", error));
}

export function actualizarCliente() {
    // Obtenemos los valores de los campos del formulario
    let v_id = document.getElementById("id").value;
    let v_nombre = document.getElementById("nombre").value;
    let v_apellidos = document.getElementById("apellidos").value;
    let v_telefono = document.getElementById("tel").value;
    let v_ciudad = parseInt(document.getElementById("ciudades").value);
    let v_estado = (document.getElementById("estados").value);
    let v_user = document.getElementById("user").value;
    let v_contrasenia = document.getElementById("pass").value;

    let v_idPersona, v_idUsuario;

    // Obtenemos los IDs de persona y usuario del array 'clientes'
    clientes.forEach(cliente => {
        if (cliente.idCliente === parseInt(v_id)) { // Verifica el cliente correcto
            v_idPersona = cliente.persona.idPersona;
            v_idUsuario = cliente.usuario.idUsuario;
        }
    });

    // Preparar objeto para actualizar
    let tblCliente = {
        idCliente: v_id,
        activo: 1, // Cliente activo
        persona: {
            idPersona: v_idPersona,
            nombre: v_nombre,
            apellidos: v_apellidos,
            telefono: v_telefono,
            ciudad: {
                idCiudad: v_ciudad,
                estado: {
                    idEstado: v_estado
                }
            }
        },
        usuario: {
            idUsuario: v_idUsuario,
            activo: 1,
            nombre: v_user,
            contrasenia: v_contrasenia
        }
    };


    // Preparamos los datos para enviarlos al servidor
    let datos_servidor = { datosCliente: JSON.stringify(tblCliente) };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    // Realizamos la solicitud al servidor
    fetch('http://localhost:8080/Zarape-/api/cliente/agregar', registro)
        .then(response => response.json())
        .then(json => console.log("Cliente actualizado:", json))
        .catch(error => console.error("Error al actualizar el cliente:", error));
}

export function eliminarCliente() {
    // Obtenemos el ID del cliente que se quiere eliminar desde el formulario
    let idCliente = parseInt(document.getElementById("id").value); 

    if (!idCliente) {
        console.error("No se ha seleccionado un cliente para eliminar.");
        return;
    }

    // Preparamos los datos para enviarlos al servidor
    let datos_servidor = { idCliente: idCliente };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    // Realizamos la solicitud de eliminación al servidor
    fetch('http://localhost:8080/Zarape-/api/cliente/eliminar', registro)
        .then(response => response.json())
        .then(json => {
            if (json.error) {
                console.error("Error al eliminar el cliente:", json.error);
            } else {
                console.log("Cliente eliminado:", json);
                // Aquí puedes actualizar la lista de clientes después de eliminar uno
                // Por ejemplo, eliminando el cliente de la lista de clientes en memoria
//                clientes = clientes.filter(cliente => cliente.idCliente !== idCliente);
                loadCliente();  // Recarga la tabla con los clientes actualizados
            }
        })
        .catch(error => console.error("Error al eliminar el cliente:", error));
}

export function limpiarCliente(){
    // Seleccionamos todos los campos de entrada por su id
    document.getElementById("id").value = "";      // Limpia el campo ID
    document.getElementById("nombre").value = "";  // Limpia el campo Nombre
    document.getElementById("apellidos").value = ""; // Limpia el campo Apellidos
    document.getElementById("tel").value = "";     // Limpia el campo Teléfono
    document.getElementById("user").value = "";    // Limpia el campo Usuario
    document.getElementById("pass").value = "";    // Limpia el campo Contraseña
}

export function selectRegistro(indice) {
    console.log("Datos seleccionados del cliente:", clientes[indice]);

    // Asignamos los valores a los elementos del formulario
    document.getElementById("id").value = clientes[indice].idCliente;
    document.getElementById("nombre").value = clientes[indice].persona.nombre;
    document.getElementById("apellidos").value = clientes[indice].persona.apellidos;
    document.getElementById("tel").value = clientes[indice].persona.telefono;
    document.getElementById("user").value = clientes[indice].usuario.nombre;
    document.getElementById("pass").value = clientes[indice].usuario.contrasenia;
    document.getElementById("estados").value = clientes[indice].persona.ciudad.estado.idEstado;
    loadCiudades();
    document.getElementById("ciudades").value = clientes[indice].persona.ciudad.idCiudad;
    
    console.log("ID Cliente:", clientes[indice].idCliente);
    console.log("ID Persona:", clientes[indice].persona.idPersona);
    console.log("Nombre:", clientes[indice].persona.nombre);
    console.log("Apellidos:", clientes[indice].persona.apellidos);
    console.log("Teléfono:", clientes[indice].persona.telefono);
    console.log("ID Usuario:", clientes[indice].usuario.idUsuario);
    console.log("Usuario:", clientes[indice].usuario.nombre);
    console.log("Contraseña:", clientes[indice].usuario.contrasenia);
    console.log("Estatus:", clientes[indice].usuario.activo);
    console.log("ID Estado:", clientes[indice].persona.ciudad.estado.idEstado);
    console.log("ID Ciudad:", clientes[indice].persona.ciudad.idCiudad);
    
       
}
    
function loadCliente(){
    let table = document.getElementById("renglones");
    let renglon = "";
    clientes.forEach(cliente => {
    let contraseniaOculta = "●".repeat(cliente.usuario.contrasenia.length);
    renglon += "<tr onclick='controladorGral.selectRegistro("+clientes.indexOf(cliente)+");'><td>"+cliente.persona.nombre+ "</td>"+
            "<td>"+ cliente.persona.apellidos + "</td>"+
            "<td>"+ cliente.persona.telefono + "</td>"+
            "<td>"+ cliente.persona.ciudad.nombre + "</td>"+
            "<td>"+ cliente.usuario.nombre + "</td>"+
            "<td>"+ contraseniaOculta + "</td></tr>";
//                "<td>"+ "Prueba" + "</td>"+
//                "<td>"+ "user" + "</td>"+
//                "<td>"+ "●●●●●" + "</td></tr>";
    });
    table.innerHTML=renglon;
}

fetch('http://localhost:8080/Zarape-/api/cliente/getAllClientes')
    .then(response=>response.json())
    .then(
    registro=>{
        console.log(registro);
        clientes=registro;
        loadCliente();
    });

function filtrarClientes() {
    const estatusActivo = document.getElementById("estatusSwitch").checked; // true: activos, false: inactivos
    // Filtra los clientes según el estado
    const clientesFiltrados = clientes.filter(cliente => cliente.activo === (estatusActivo ? 1 : 0));
    // Actualiza la tabla con los clientes filtrados
    let table = document.getElementById("renglones");
    let renglon = "";
    clientesFiltrados.forEach(cliente => {
    let contraseniaOculta = "●".repeat(cliente.usuario.contrasenia.length);
    renglon += "<tr onclick='controladorGral.selectRegistro("+clientes.indexOf(cliente)+");'><td>"+cliente.persona.nombre+ "</td>"+
            "<td>"+ cliente.persona.apellidos + "</td>"+
            "<td>"+ cliente.persona.telefono + "</td>"+
            "<td>"+ cliente.persona.ciudad.nombre + "</td>"+
            "<td>"+ cliente.usuario.nombre + "</td>"+
            "<td>"+ contraseniaOculta + "</td></tr>";
    });

    table.innerHTML = renglon;
}
document.getElementById("estatusSwitch").addEventListener("change", filtrarClientes);


    
    

let listEstados = [];
let listCiudades = [];

function loadEstados() {
    let v_estados = document.getElementById("estados");
    v_estados.innerHTML = ""; // Limpia opciones previas en estados
    
    listEstados.forEach(estado => {
        let v_option = document.createElement("option");
        v_option.value = estado.idEstado;
        v_option.text = estado.nombre;
        v_estados.appendChild(v_option);
    });

    // Limpia las ciudades al cargar los estados
    document.getElementById("ciudades").innerHTML = "";
}

fetch('http://localhost:8080/Zarape-/api/zarape/getAllEstados')
        .then(response=>response.json())
        .then(
        states=>{
            console.log(states);
            listEstados=states;
            loadEstados();
        });
 
function loadCiudades() {
    let v_edo = parseInt(document.getElementById("estados").value); // Estado seleccionado
    let v_ciudades = document.getElementById("ciudades");

    // Limpia las opciones previas
    v_ciudades.innerHTML = "";

    // Filtra y agrega las ciudades correspondientes al estado seleccionado
    listCiudades.forEach(ciudad => {
        if (ciudad.estado.idEstado === v_edo) {
            let option = document.createElement("option");
            option.value = ciudad.idCiudad;
            option.text = ciudad.nombre;
            v_ciudades.appendChild(option);
        }
    });
}

fetch('http://localhost:8080/Zarape-/api/zarape/getAllCiudades')
    .then(response => response.json())
    .then(
        ciudad => {
        console.log(ciudad);
        listCiudades = ciudad;
        loadCiudades();
    });
    
document.getElementById("estados").addEventListener("change", loadCiudades);