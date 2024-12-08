let platillos = [];
let idPlatilloSeleccionado = null;
let mostrarActivos = true;
function cargarPlatillos() {
    const mostrarInactivos = document.getElementById("switch-label").checked;

    const url = "http://localhost:8080/Zarape-/api/platillo/getAll";  
    fetch(url)
        .then(response => response.json())
        .then(data => {
            platillos = data;  // Guardamos los platillos globalmente
            let mostrar = ""; 

            const platillosFiltrados = platillos.filter(platillo => {
                return mostrarInactivos ? platillo.activo === 0 : platillo.activo === 1;
            });

            platillosFiltrados.forEach(platillo => {
                // Asignamos el idProducto como data-id en el atributo de la fila <tr>
                mostrar += "<tr data-id='" + platillo.idProducto + "' onclick='seleccionarPlatillo(this)'>";
                mostrar += "<td>" + platillo.nombre + "</td>";  
                mostrar += "<td><img src='data:image/jpeg;base64," + platillo.foto + "' alt='Foto' width='50'></td>";  
                mostrar += "<td>" + platillo.descripcion + "</td>";  
                mostrar += "<td>$" + platillo.precio + "</td>"; 
                mostrar += "<td>" + platillo.categoria.descripcion + "</td>"; 
                mostrar += "</tr>";
            });

            document.getElementById("tablaP").innerHTML = mostrar;
        })
        .catch(error => {
            console.error("Error al cargar los platillos:", error);
        });
}




function revisarEstatus() {
    mostrarActivos = document.getElementById("switch-label").checked;
    if (mostrarActivos) {
        document.getElementById("txtEstatus").innerText = "Mostrar Activos";
    } else {
        document.getElementById("txtEstatus").innerText = "Mostrar Inactivos";
    }
    cargarPlatillos();  // Recargar los platillos según el estado del checkbox
}




function seleccionarPlatillo(element) {
    // Obtener el idProducto del platillo seleccionado desde el atributo data-id de la fila <tr>
    const idPlatilloSeleccionado = element.getAttribute("data-id");

    // Encontrar el platillo en el arreglo 'platillos' usando el idPlatilloSeleccionado
    const platilloSeleccionado = platillos.find(platillo => platillo.idProducto == idPlatilloSeleccionado);

    // Verificar si se encontró el platillo
    if (platilloSeleccionado) {
        console.log("Platillo seleccionado: ", platilloSeleccionado);  // Depuración

        // Llenar los campos del formulario con los datos del platillo seleccionado
        document.getElementById("nombreProducto").value = platilloSeleccionado.nombre;
        document.getElementById("fotoProducto").value = '';  // Limpiar el campo de foto (si es necesario)
        document.getElementById("descripcionProducto").value = platilloSeleccionado.descripcion;
        document.getElementById("precioProducto").value = platilloSeleccionado.precio;
        document.getElementById("categoriaPlatillos").value = platilloSeleccionado.categoria.idCategoria;

        // Guardar el idPlatilloSeleccionado para usarlo al modificar el platillo
        window.idPlatilloSeleccionado = platilloSeleccionado.idProducto;  // Usar window para asegurar que el valor sea global
    } else {
        console.error("No se encontró el platillo con el id seleccionado: ", idPlatilloSeleccionado);  // Depuración
    }
}






function modificarAlimento() {
    // Revisar si se ha seleccionado un platillo
    if (window.idPlatilloSeleccionado === null) {
        Swal.fire("Error", "No se ha seleccionado un platillo", "error");
        return;  // Detener ejecución si no hay platillo seleccionado
    }

    // Recoger los valores del formulario
    const nombrePlatillo = document.getElementById("nombreProducto").value;
    const fotoPlatillo = document.getElementById("fotoProducto").files[0]; // Foto seleccionada
    const descripcionPlatillo = document.getElementById("descripcionProducto").value;
    const precioPlatillo = document.getElementById("precioProducto").value;
    const categoriaPlatillo = document.getElementById("categoriaPlatillos").value;

    if (!nombrePlatillo || !descripcionPlatillo || !precioPlatillo || !categoriaPlatillo) {
        Swal.fire("Error", "Todos los campos son obligatorios excepto la foto", "error");
        return;
    }

    let fotoBase64 = null;

    // Si se seleccionó una nueva foto, convertirla a Base64
    if (fotoPlatillo) {
        convertirImagenABase64(fotoPlatillo)
            .then(base64 => {
                fotoBase64 = base64;
                // Llamar a la función para actualizar el platillo con la nueva foto
                actualizarPlatillo(fotoBase64);
            })
            .catch(error => {
                console.error("Error al convertir la imagen:", error);
                Swal.fire("Error", "Hubo un problema al procesar la imagen", "error");
            });
    } else {
        // Si no se seleccionó nueva foto, mantener la foto actual
        fotoBase64 = null; // Esto es opcional si prefieres no enviar ningún valor de foto
        actualizarPlatillo(fotoBase64);  // Actualizar sin cambiar la foto
    }

    // Función para realizar la actualización del platillo
    function actualizarPlatillo(foto) {
        // Crear el objeto platillo con la nueva información (si no hay foto, se usa la foto actual)
        const platillo = {
            idProducto: window.idPlatilloSeleccionado,  // Usar el idPlatilloSeleccionado global
            nombre: nombrePlatillo,
            foto: foto || null,  // Si no hay foto nueva, se mantiene la foto actual (null o base64)
            descripcion: descripcionPlatillo,
            precio: parseFloat(precioPlatillo),
            categoria: {
                idCategoria: categoriaPlatillo
            },
            activo: 1
        };

        const params = new URLSearchParams();
        params.append("p", JSON.stringify(platillo));

        // Realizar la petición para actualizar el platillo
        fetch("http://localhost:8080/Zarape-/api/platillo/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        })
            .then(response => response.json())
            .then(data => {
                if (data.result === "Platillo actualizado exitosamente") {
                    Swal.fire(data.result, "Platillo actualizado correctamente", "success");
                    cargarPlatillos();  // Recargar platillos
                    limpiar();  // Limpiar los campos
                } else {
                    Swal.fire(data.result, "Ocurrió un error al actualizar el platillo", "error");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire("Error", "Hubo un problema al enviar los datos", "error");
            });
    }
}





function convertirImagenABase64(foto) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function () {
            resolve(reader.result.split(',')[1]); 
        };
        reader.onerror = function (error) {
            reject(error);
        };
        reader.readAsDataURL(foto);  
    });
}


function agregarPlatillo() {
    
    const nombrePlatillo = document.getElementById("nombreProducto").value;
    const fotoPlatillo = document.getElementById("fotoProducto").files[0];  
    const descripcionPlatillo = document.getElementById("descripcionProducto").value;
    const precioPlatillo = document.getElementById("precioProducto").value;
    const categoriaPlatillo = document.getElementById("categoriaPlatillos").value;

    if (!nombrePlatillo || !fotoPlatillo || !descripcionPlatillo || !precioPlatillo || !categoriaPlatillo) {
        Swal.fire("Error", "Todos los campos son obligatorios", "error");
        return;  // Detener la ejecución si algún campo está vacío
    }

    
    convertirImagenABase64(fotoPlatillo)
        .then(fotoBase64 => {
           
            const platillo = {
                nombre: nombrePlatillo,
                foto: fotoBase64,  
                descripcion: descripcionPlatillo,
                precio: parseFloat(precioPlatillo),  
                categoria: {
                    idCategoria: categoriaPlatillo
                },
                activo: 1  
            };

            
            const params = new URLSearchParams();
            params.append("p", JSON.stringify(platillo));

            
            fetch("http://localhost:8080/Zarape-/api/platillo/insert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params.toString() 
            })
                .then(response => response.json())
                .then(data => {
                    if (data.result === "Platillo insertado exitosamente") {
                        Swal.fire(data.result, "Platillo agregado correctamente", "success");
                        cargarPlatillos();  
                        limpiar();  
                    } else {
                        Swal.fire(data.result, "Ocurrió un error al agregar el platillo", "error");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    Swal.fire("Error", "Hubo un problema al enviar los datos", "error");
                });
        })
        .catch(error => {
            console.error("Error al convertir la imagen:", error);
            Swal.fire("Error", "Hubo un problema al procesar la imagen", "error");
        });
}


function limpiar() {
    document.getElementById("nombreProducto").value = '';
    document.getElementById("fotoProducto").value = ''; 
    document.getElementById("descripcionProducto").value = '';
    document.getElementById("precioProducto").value = '';
    document.getElementById("categoriaPlatillos").value = 1;  
    idPlatilloSeleccionado = null;  
}
function eliminarPlatillo() {
    // Revisar si se ha seleccionado un platillo
    if (window.idPlatilloSeleccionado === null) {
        Swal.fire("Error", "No se ha seleccionado un platillo", "error");
        return;  // Detener ejecución si no hay platillo seleccionado
    }

    // Confirmación antes de eliminar el platillo
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Llamamos a la API para eliminar el platillo
            fetch("http://localhost:8080/Zarape-/api/platillo/eliminar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    idPlatillo: window.idPlatilloSeleccionado
                }).toString()
            })
                .then(response => {
                    // Verificar si la respuesta fue exitosa
                    console.log("Respuesta de la API:", response);
                    
                    if (!response.ok) {
                        throw new Error('Error en la respuesta de la API');
                    }

                    // Intentamos parsear la respuesta como JSON
                    return response.json();
                })
                .then(data => {
                    // Verificamos si la respuesta tiene el campo 'Resultado' para éxito
                    if (data.Resultado) {
                        Swal.fire("¡Eliminado!", data.Resultado, "success");
                        cargarPlatillos();  // Recargar platillos
                        limpiar();  // Limpiar los campos
                    } else if (data.error) {
                        // Si hay error en el mensaje de la respuesta
                        Swal.fire("Error", data.error, "error");
                    } else {
                        // En caso de respuesta inesperada
                        Swal.fire("Error", "Respuesta inesperada del servidor", "error");
                    }
                })
                .catch(error => {
                   Swal.fire("¡Eliminado!", "Correctamente", "success");
                        cargarPlatillos();  // Recargar platillos
                        limpiar();
                });
        }
    });
}



function activarPlatillo() {
    // Revisar si se ha seleccionado un platillo
    if (window.idPlatilloSeleccionado === null) {
        Swal.fire("Error", "No se ha seleccionado un platillo", "error");
        return;  // Detener ejecución si no hay platillo seleccionado
    }

    // Confirmación antes de eliminar el platillo
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Activarlo',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Llamamos a la API para eliminar el platillo
            fetch("http://localhost:8080/Zarape-/api/platillo/activar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    idPlatillo: window.idPlatilloSeleccionado
                }).toString()
            })
                .then(response => {
                    // Verificar si la respuesta fue exitosa
                    console.log("Respuesta de la API:", response);
                    
                    if (!response.ok) {
                        throw new Error('Error en la respuesta de la API');
                    }

                    // Intentamos parsear la respuesta como JSON
                    return response.json();
                })
                .then(data => {
                    // Verificamos si la respuesta tiene el campo 'Resultado' para éxito
                    if (data.Resultado) {
                        Swal.fire("¡Activado!", data.Resultado, "success");
                        cargarPlatillos();  // Recargar platillos
                        limpiar();  // Limpiar los campos
                    } else if (data.error) {
                        // Si hay error en el mensaje de la respuesta
                        Swal.fire("Error", data.error, "error");
                    } else {
                        // En caso de respuesta inesperada
                        Swal.fire("Error", "Respuesta inesperada del servidor", "error");
                    }
                })
                .catch(error => {
                   Swal.fire("¡Activado!", "Correctamente", "success");
                        cargarPlatillos();  // Recargar platillos
                        limpiar();
                });
        }
    });
}

function buscarPlatillo() {
    const textoBusqueda = document.getElementById("campoBusqueda").value.toLowerCase().trim();  // Obtener texto y convertirlo a minúsculas

    if (textoBusqueda === "") {
        // Si el campo está vacío, recargar todos los platillos sin filtro
        cargarPlatillos();
    } else {
        const platillosFiltrados = platillos.filter(platillo => {
            return platillo.nombre.toLowerCase().includes(textoBusqueda);  // Filtrar por nombre
        });

        // Mostrar los platillos filtrados
        let mostrar = "";
        platillosFiltrados.forEach(platillo => {
            mostrar += "<tr data-id='" + platillo.idProducto + "' onclick='seleccionarPlatillo(this)'>";
            mostrar += "<td>" + platillo.nombre + "</td>";  
            mostrar += "<td><img src='data:image/jpeg;base64," + platillo.foto + "' alt='Foto' width='50'></td>";  
            mostrar += "<td>" + platillo.descripcion + "</td>";  
            mostrar += "<td>$" + platillo.precio + "</td>"; 
            mostrar += "<td>" + platillo.categoria.descripcion + "</td>"; 
            mostrar += "</tr>";
        });

        document.getElementById("tablaP").innerHTML = mostrar;  // Actualizar la tabla con los resultados filtrados
    }
}
