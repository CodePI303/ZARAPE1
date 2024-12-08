let listCiudades = [];
 
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

fetch('http://localhost:8097/zarape/api/zarape/getAllCiudades')
    .then(response => response.json())
    .then(
        ciudad => {
        console.log(ciudad);
        listCiudades = ciudad;
        loadCiudades();
    });
    
document.getElementById("estados").addEventListener("change", loadCiudades);
//function loadCiudades() {
//    let v_edo = parseInt(document.getElementById("estados").value); // Estado seleccionado
//    let v_ciudades = document.getElementById("ciudades");
//
//    // Limpia las opciones previas
//    v_ciudades.innerHTML = "";
//
//    // Filtra y agrega las ciudades correspondientes al estado seleccionado
//    listCiudades.forEach(ciudad => {
//        if (ciudad.estado.idEstado === v_edo) {
//            let option = document.createElement("option");
//            option.value = ciudad.idCiudad;
//            option.text = ciudad.nombre;
//            v_ciudades.appendChild(option);
//        }
//    });
//}
//
//fetch('http://localhost:8097/zarape/api/zarape/getAllCiudades')
//    .then(response => response.json())
//    .then(
//        ciudad => {
//        console.log(ciudad);
//        listCiudades = ciudad;
//        loadCiudades();
//    });
//    
//document.getElementById("estados").addEventListener("change", controladorGral.loadCiudades);