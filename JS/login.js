function login() {
  
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    if (!usuario || !contrasena) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Por favor, completa todos los campos."
        });
        return;
    }
   
    const data = new URLSearchParams();
    data.append('u', usuario);
    data.append('c', contrasena);

    const ruta = "http://localhost:8097/zarape/api/usuario/login";  

    fetch(ruta, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: data.toString()
    })
    .then(response => {
        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error de red o servidor.');
        }
        return response.json();
    })
    .then(data => {
    
        if (data && data.idUsuario && data.activo === 1) {
         
            localStorage.setItem('usuario', usuario);
            localStorage.setItem('idUsuario', data.idUsuario);
            localStorage.setItem('nombre', data.nombre);
            localStorage.setItem('activo', data.activo);
            localStorage.setItem('inicioSesion', 'true');

            // Mostrar mensaje de bienvenida
            Swal.fire({
                title: "¡BIENVENIDO " + data.nombre + "!",
                text: "Inicio de sesión exitoso.",
                icon: "success",
                showConfirmButton: true
            }).then(() => {
       
                location.href = "principal.html";  
            });
        } else {
            Swal.fire("ERROR", "¡CREDENCIALES INCORRECTAS O USUARIO INACTIVO!", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire("Error", "Error de red o servidor.", "error");
    });
}
