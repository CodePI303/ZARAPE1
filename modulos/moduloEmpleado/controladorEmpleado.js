let empleados = [];

export function agregarEmpleado() { 
    let v_nombre = document.getElementById("nombre").value;
    let v_apellidos = document.getElementById("apellidos").value;
    let v_telefono = document.getElementById("tel").value;
    let v_ciudad = document.getElementById("ciudades").value;
    let v_estado = parseInt(document.getElementById("estados").value);
    let v_user = document.getElementById("user").value;
    let v_contrasenia = document.getElementById("pass").value;
    let v_sucursal = document.getElementById("sucursales").value;

    let tblZarape = {
        idEmpleado: -1,
        activo: 1,  
        sucursal: {
            idSucursal: v_sucursal,
            activo: 1,  
            nombre: "",  
            latitud: "",
            longitud: "",
            foto: "",
            urlWeb: "",
            horarios: "",
            calle: "",
            numCalle: "",
            colonia: "",
            ciudad: {
                idCiudad: parseInt(v_ciudad),
                nombre: "", 
                estado: {
                    idEstado: v_estado,  
                    nombre: "" 
                }
            }
        },
        persona: {
            idPersona: -1,  
            nombre: v_nombre,
            apellidos: v_apellidos,
            telefono: v_telefono,
            ciudad: {
                idCiudad: parseInt(v_ciudad),
                nombre: "",  
                estado: {
                    idEstado: v_estado,  
                    nombre: "" 
                }
            }
        },
        
        usuario: {
            idUsuario: -1,  
            activo: 1,
            nombre: v_user,
            contrasenia: v_contrasenia
        }
    };

    let datos_servidor = { datosEmpleado: JSON.stringify(tblZarape) };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    fetch('http://localhost:8080/Zarape-/api/empleado/agregar', registro)
        .then(response => response.json())
        .then(json => console.log("Empleado agregado:",json))
        .catch(error => console.error("Error al agregar el empleado:", error));
}

export function actualizarEmpleado() { 
    let v_id = document.getElementById("id").value;
    let v_nombre = document.getElementById("nombre").value;
    let v_apellidos = document.getElementById("apellidos").value;
    let v_telefono = document.getElementById("tel").value;
    let v_ciudad = document.getElementById("ciudades").value;
    let v_estado = parseInt(document.getElementById("estados").value);
    let v_user = document.getElementById("user").value;
    let v_contrasenia = document.getElementById("pass").value;
    let v_sucursal = document.getElementById("sucursales").value;
    
    let v_idPersona, v_idUsuario;

    // Obtenemos los IDs de persona y usuario del array 'clientes'
    empleados.forEach(empleado => {
        if (empleado.idEmpleado === parseInt(v_id)) { // Verifica el cliente correcto
            v_idPersona = empleado.persona.idPersona;
            v_idUsuario = empleado.usuario.idUsuario;
        }
    });

    let tblZarape = {
        idEmpleado: v_id,
        activo: 1,  
        sucursal: {
            idSucursal: v_sucursal,
            activo: 1,  
            nombre: "",  
            latitud: "",
            longitud: "",
            foto: "",
            urlWeb: "",
            horarios: "",
            calle: "",
            numCalle: "",
            colonia: "",
            ciudad: {
                idCiudad: v_ciudad,
                nombre: "", 
                estado: {
                    idEstado: v_estado,  
                    nombre: "" 
                }
            }
        },
        persona: {
            idPersona: v_idPersona,  
            nombre: v_nombre,
            apellidos: v_apellidos,
            telefono: v_telefono,
            ciudad: {
                idCiudad: v_ciudad,
                nombre: "",  
                estado: {
                    idEstado: v_estado,  
                    nombre: "" 
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

    let datos_servidor = { datosEmpleado: JSON.stringify(tblZarape) };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    fetch('http://localhost:8080/Zarape-/api/empleado/agregar', registro)
        .then(response => response.json())
        .then(json => console.log("Empleado actualizado:", json))
        .catch(error => console.error("Error al actualizar el empleado:", error));
}

export function eliminarEmpleado() {
    // Obtenemos el ID del cliente que se quiere eliminar desde el formulario
    let idEmpleado = parseInt(document.getElementById("id").value); 

    if (!idEmpleado) {
        console.error("No se ha seleccionado un empleado para eliminar.");
        return;
    }

    // Preparamos los datos para enviarlos al servidor
    let datos_servidor = { idEmpleado: idEmpleado };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    // Realizamos la solicitud de eliminación al servidor
    fetch('http://localhost:8080/Zarape-/api/empleado/eliminar', registro)
        .then(response => response.json())
        .then(json => {
            if (json.error) {
                console.error("Error al eliminar el empleado:", json.error);
            } else {
                console.log("Empleado eliminado:", json);
                // Aquí puedes actualizar la lista de clientes después de eliminar uno
                // Por ejemplo, eliminando el cliente de la lista de clientes en memoria
//                clientes = clientes.filter(cliente => cliente.idEmpleado !== idEmpleado);
                loadEmpleado();  // Recarga la tabla con los clientes actualizados
            }
        })
        .catch(error => console.error("Error al eliminar el empleado:", error));
}

export function limpiarEmpleado(){
    // Seleccionamos todos los campos de entrada por su id
    document.getElementById("id").value = "";      // Limpia el campo ID
    document.getElementById("nombre").value = "";  // Limpia el campo Nombre
    document.getElementById("apellidos").value = ""; // Limpia el campo Apellidos
    document.getElementById("tel").value = "";     // Limpia el campo Teléfono
    document.getElementById("user").value = "";    // Limpia el campo Usuario
    document.getElementById("pass").value = "";    // Limpia el campo Contraseña
}


function loadEmpleado(){
    let table = document.getElementById("renglones");
    let renglon = "";
    empleados.forEach(empleado => {
    let contraseniaOculta = "●".repeat(empleado.usuario.contrasenia.length);
    renglon += "<tr onclick='controladorGral.selectRegistro("+empleados.indexOf(empleado)+");'><td>"+empleado.persona.nombre+ "</td>"+
            "<td>"+ empleado.persona.apellidos + "</td>"+
            "<td>"+ empleado.persona.telefono + "</td>"+
            "<td>"+ empleado.persona.ciudad.nombre + "</td>"+
            "<td>"+ empleado.sucursal.nombre + "</td>"+
            "<td>"+ empleado.usuario.nombre + "</td>"+
            "<td>"+ contraseniaOculta + "</td></tr>";
    });
    table.innerHTML=renglon;
}

fetch('http://localhost:8080/Zarape-/api/empleado/getAllEmpleados')
    .then(response=>response.json())
    .then(
    registro=>{
        console.log(registro);
        empleados=registro;
        loadEmpleado();
    });

export function selectRegistro(indice){
        console.log("Datos seleccionados del cliente:", empleados[indice]);
        document.getElementById("id").value = empleados[indice].idEmpleado;
        document.getElementById("nombre").value = empleados[indice].persona.nombre;
        document.getElementById("apellidos").value = empleados[indice].persona.apellidos;
        document.getElementById("tel").value = empleados[indice].persona.telefono;
        document.getElementById("user").value = empleados[indice].usuario.nombre;
        document.getElementById("pass").value = empleados[indice].usuario.contrasenia;
        document.getElementById("estados").value = empleados[indice].persona.ciudad.estado.idEstado;
        loadCiudades();
        document.getElementById("ciudades").value = empleados[indice].persona.ciudad.idCiudad;
        document.getElementById("sucursales").value = empleados[indice].sucursal.idSucursal;
    }
    
function filtrarEmpleados() {
    const estatusActivo = document.getElementById("estatusSwitch").checked; // true: activos, false: inactivos
    // Filtra los empleados según el estado
    const empleadosFiltrados = empleados.filter(empleado => empleado.activo === (estatusActivo ? 1 : 0));
    
    // Actualiza la tabla con los empleados filtrados
    let table = document.getElementById("renglones");
    let renglon = "";
    empleadosFiltrados.forEach(empleado => {
    let contraseniaOculta = "●".repeat(empleado.usuario.contrasenia.length);
    renglon += "<tr onclick='controladorGral.selectRegistro("+empleados.indexOf(empleado)+");'><td>"+empleado.persona.nombre+ "</td>"+
            "<td>"+ empleado.persona.apellidos + "</td>"+
            "<td>"+ empleado.persona.telefono + "</td>"+
            "<td>"+ empleado.persona.ciudad.nombre + "</td>"+
            "<td>"+ empleado.sucursal.nombre + "</td>"+
            "<td>"+ empleado.usuario.nombre + "</td>"+
            "<td>"+ contraseniaOculta + "</td></tr>";
    });

    table.innerHTML = renglon;
}

document.getElementById("estatusSwitch").addEventListener("change", filtrarEmpleados);




let listSucursales = [];
let listEstados = [];
let listCiudades = [];

function loadSucursales() {
    let v_sucursales = document.getElementById("sucursales");
    listSucursales.forEach(
        sucursal => {
            let v_option = document.createElement("option");
            v_option.value = sucursal.idSucursal;
            v_option.text = sucursal.nombre;
            
            v_sucursales.appendChild(v_option);
        }
    );
}

fetch('http://localhost:8080/Zarape-/api/sucursal/getAllSucursales')
    .then(response => response.json())
    .then(
        sucursales => {
            console.log(sucursales);
            listSucursales = sucursales;
            loadSucursales();
        }
    );

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