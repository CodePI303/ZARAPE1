let controladorGral; // Variable para el controlador

function cargarInicio() {
    fetch('inicio.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById("maincontent").innerHTML = html;
        });
}

function cargarModuloSucursal() {
    fetch('modulos/moduloSucursal/sucursal.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById("maincontent").innerHTML = html;
            import('../modulos/moduloSucursal/controladorSucursal.js').then(
                function (controller) {
                controladorGral = controller; // Asigna el módulo importado
            });
        });
}

function cargarModuloEmpleado() {
    fetch('modulos/moduloEmpleado/empleado.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById("maincontent").innerHTML = html;
            // Importa el primer módulo
            import('../modulos/moduloEmpleado/controladorEmpleado.js').then(
                function (controller) {
                controladorGral = controller; // Asigna el primer módulo importado         
            });
        });
}

function cargarModuloCliente() {
    fetch('modulos/moduloCliente/cliente.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById("maincontent").innerHTML = html;
            import('../modulos/moduloCliente/controladorCliente.js').then(module => {
                controladorGral = module; // Asigna el módulo importado
            });
        });
}

