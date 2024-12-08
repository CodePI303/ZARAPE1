let listSucursales = [];

function loadSucursales(){
    let renglon="";
    let tblSuc= document.getElementById("renglones");
    listSucursales.forEach(sucursal => {
//        renglon += "<tr onclick='controladorGral.selectRegistro("+clientes.indexOf(cliente)+");'><td>"+cliente.persona.nombre+ "</td>"+
//    renglon+='<tr><td>'+sucursal.nombre+'</td><td><img alt = "" src = "data:image/jpeg;base64,'+sucursal.foto+'"/></td>'
renglon += "<tr onclick='controladorGral.selectRegistro(" + listSucursales.indexOf(sucursal) + ");'>" +
           "<td>" + sucursal.nombre + "</td>" 
            +"<td><img alt='' src='data:image/jpeg;base64," + sucursal.foto + "'/></td>"
            +"<td>"+sucursal.latitud+"</td>"
            +"<td>"+sucursal.longitud+"</td>"
            +"<td>"+sucursal.urlWeb+"</td>"
            +"<td>"+sucursal.horarios+"</td>"
            +"<td>"+sucursal.ciudad.nombre+"</td>"
            +"<td>"+sucursal.calle+"</td>"
            +"<td>"+sucursal.numCalle+"</td>"
            +"<td>"+sucursal.colonia+"</td></tr>";
    });
    tblSuc.innerHTML=renglon;
}

fetch('http://localhost:8080/Zarape-/api/sucursal/getAllSucursales')
    .then(response => response.json())
    .then(
        sucursales => {
            console.log(sucursales);
            listSucursales = sucursales;
            loadSucursales();
            addFoto();
        }
    );
    
export function selectRegistro(indice){
        document.getElementById("id").value = listSucursales[indice].idSucursal;
        document.getElementById("nombre").value = listSucursales[indice].nombre;
        document.getElementById("latitud").value = listSucursales[indice].latitud;
        document.getElementById("longitud").value = listSucursales[indice].longitud;
        document.getElementById("url").value = listSucursales[indice].urlWeb;
        document.getElementById("horarios").value = listSucursales[indice].horarios;
        document.getElementById("estados").value = listSucursales[indice].ciudad.estado.idEstado;
        loadCiudades();
        document.getElementById("ciudades").value = listSucursales[indice].ciudad.idCiudad;
        document.getElementById("calle").value = listSucursales[indice].calle;
        document.getElementById("numCalle").value = listSucursales[indice].numCalle;
        document.getElementById("colonia").value = listSucursales[indice].colonia;
        document.getElementById("txtaFoto").value = listSucursales[indice].foto;
    }
    
let inputFileFotoSucursal=null;
export function addFoto(){
    inputFileFotoSucursal= document.getElementById("inputFileFotoSucursal");
    inputFileFotoSucursal.onchange = function(evt){cargarFoto();};
    document.getElementById("btnCargarFoto").onclick = function(evt){inputFileFotoSucursal.click();};
}

function cargarFoto(){
    if (inputFileFotoSucursal.files && inputFileFotoSucursal.files[0]){
        let reader = new FileReader();
        reader.onload=function (e){
            let fotoB64=e.target.result;
            document.getElementById("foto").src=fotoB64;
            document.getElementById("txtaFoto").value=
                    fotoB64.substring(fotoB64.indexOf(",")+1, fotoB64.length);
        };
        reader.readAsDataURL(inputFileFotoSucursal.files[0]);
    }
}

export function agregarSucursal() {
    // Obtener los valores de los campos del formulario
    let v_nombre = document.getElementById("nombre").value;
    let v_latitud = document.getElementById("latitud").value;
    let v_longitud = document.getElementById("longitud").value;
    let v_url = document.getElementById("url").value;
    let v_horarios = document.getElementById("horarios").value;
    let v_ciudad = (document.getElementById("ciudades").value); // ID de la ciudad
    let v_estado = (document.getElementById("estados").value); // ID del estado
    let v_calle = document.getElementById("calle").value;
    let v_numCalle = document.getElementById("numCalle").value;
    let v_colonia = document.getElementById("colonia").value;
    let v_foto = document.getElementById("txtaFoto").value; // Foto en base64 (puede venir de un input tipo file o un campo de texto)

    // Crear el objeto Estado
    let tblEstado = {
        idEstado: v_estado,
        nombre: "" // Este valor puede completarse según la respuesta del servidor
    };

    // Crear el objeto Ciudad
    let tblCiudad = {
        idCiudad: v_ciudad,
        nombre: "", // Este valor puede completarse según la respuesta del servidor
        estado: tblEstado
    };

    // Crear el objeto Sucursal
    let tblSucursal = {
        nombre: v_nombre,
        latitud: v_latitud,
        longitud: v_longitud,
        urlWeb: v_url,
        horarios: v_horarios,
        ciudad: tblCiudad,
        calle: v_calle,
        numCalle: v_numCalle,
        colonia: v_colonia,
        foto: v_foto
    };

    // Preparamos los datos para enviarlos al servidor
    let datos_servidor = { datosSucursal: JSON.stringify(tblSucursal) };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    // Realizamos la solicitud al servidor
    fetch('http://localhost:8080/Zarape-/api/sucursal/agregar', registro)
        .then(response => response.json())
        .then(json => {
            if (json && json.idSucursal) {
                console.log("Sucursal agregada, ID:", json.idSucursal);
            } else {
                console.log("Error al agregar la sucursal", json);
            }
        })
        .catch(error => console.error("Error al agregar la sucursal:", error));
}

export function actualizarSucursal() {
    // Obtener los valores de los campos del formulario
    let v_id = document.getElementById("id").value; // ID de la sucursal a actualizar
    let v_nombre = document.getElementById("nombre").value;
    let v_latitud = document.getElementById("latitud").value;
    let v_longitud = document.getElementById("longitud").value;
    let v_url = document.getElementById("url").value;
    let v_horarios = document.getElementById("horarios").value;
    let v_ciudad = document.getElementById("ciudades").value; // ID de la ciudad
    let v_estado = document.getElementById("estados").value; // ID del estado
    let v_calle = document.getElementById("calle").value;
    let v_numCalle = document.getElementById("numCalle").value;
    let v_colonia = document.getElementById("colonia").value;
    let v_foto = document.getElementById("txtaFoto").value; // Foto en base64

    // Crear objeto Estado
    let tblEstado = {
        idEstado: v_estado
    };

    // Crear objeto Ciudad
    let tblCiudad = {
        idCiudad: v_ciudad,
        estado: tblEstado
    };

    // Crear objeto Sucursal
    let tblSucursal = {
        idSucursal: v_id, // ID de la sucursal a actualizar
        nombre: v_nombre,
        latitud: v_latitud,
        longitud: v_longitud,
        urlWeb: v_url,
        horarios: v_horarios,
        ciudad: tblCiudad,
        calle: v_calle,
        numCalle: v_numCalle,
        colonia: v_colonia,
        foto: v_foto,
        activo: 1 // Marca la sucursal como activa, si es necesario
    };

    // Preparamos los datos para enviarlos al servidor
    let datos_servidor = { datosSucursal: JSON.stringify(tblSucursal) };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    // Realizamos la solicitud al servidor
    fetch('http://localhost:8080/Zarape-/api/sucursal/agregar', registro)
        .then(response => response.json())
        .then(json => {
            if (json && json.idSucursal) {
                console.log("Sucursal actualizada, ID:", json.idSucursal);
            } else {
                console.log("Error al actualizar la sucursal", json);
            }
        })
        .catch(error => console.error("Error al actualizar la sucursal:", error));
}

export function eliminarSucursal() {
    // Obtener el ID de la sucursal a eliminar
    let idSucursal = parseInt(document.getElementById("id").value);

    if (!idSucursal) {
        console.error("No se ha seleccionado una sucursal para eliminar.");
        return;
    }

    // Preparar datos para el servidor
    let datos_servidor = { idSucursal: idSucursal };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    // Realizar solicitud al servidor
    fetch('http://localhost:8097/zarape/api/sucursal/eliminar', registro)
        .then(response => response.json())
        .then(json => {
            if (json.error) {
                console.error("Error al eliminar la sucursal:", json.error);
            } else {
                console.log("Sucursal eliminada:", json);
                loadSucursales();
            }
        })
        .catch(error => console.error("Error al eliminar la sucursal:", error));
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
function filtrarSucursales() {
    const estatusActivo = document.getElementById("estatusSwitch").checked; // true: activos, false: inactivos
    
    // Filtra las sucursales según el estado de 'activo'
    const sucursalesFiltradas = listSucursales.filter(sucursal => sucursal.activo === (estatusActivo ? 1 : 0));
    
    // Actualiza la tabla con las sucursales filtradas
    let renglon = "";
    let tblSuc = document.getElementById("renglones");
    
    sucursalesFiltradas.forEach(sucursal => {
        renglon += "<tr onclick='controladorGral.selectRegistro(" + listSucursales.indexOf(sucursal) + ");'>" +
            "<td>" + sucursal.nombre + "</td>" +
            "<td><img alt='' src='data:image/jpeg;base64," + sucursal.foto + "'/></td>" +
            "<td>" + sucursal.latitud + "</td>" +
            "<td>" + sucursal.longitud + "</td>" +
            "<td>" + sucursal.urlWeb + "</td>" +
            "<td>" + sucursal.horarios + "</td>" +
            "<td>" + sucursal.ciudad.nombre + "</td>" +
            "<td>" + sucursal.calle + "</td>" +
            "<td>" + sucursal.numCalle + "</td>" +
            "<td>" + sucursal.colonia + "</td>" +
            "</tr>";
    });

    tblSuc.innerHTML = renglon;
}