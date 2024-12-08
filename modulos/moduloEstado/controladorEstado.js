let listEstados = [];

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

fetch('http://localhost:8097/zarape/api/zarape/getAllEstados')
        .then(response=>response.json())
        .then(
        states=>{
            console.log(states);
            listEstados=states;
            loadEstados();
        });

//function loadEstados() {
//    let v_estados = document.getElementById("estados");
//    v_estados.innerHTML = ""; // Limpia opciones previas en estados
//    
//    listEstados.forEach(estado => {
//        let v_option = document.createElement("option");
//        v_option.value = estado.idEstado;
//        v_option.text = estado.nombre;
//        v_estados.appendChild(v_option);
//    });
//
//    // Limpia las ciudades al cargar los estados
//    document.getElementById("ciudades").innerHTML = "";
//}
//
//fetch('http://localhost:8097/zarape/api/zarape/getAllEstados')
//        .then(response=>response.json())
//        .then(
//        estado=>{
//            console.log(estado);
//            listEstados=estado;
//            loadEstados();
//        });
        