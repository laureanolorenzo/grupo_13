window.addEventListener("load", () => {
    let form = document.querySelector("form");
    let errosHTML = document.querySelector(".errores");


    form.addEventListener("submit", (event) => {
        let errorsList = [];
        
        // Nombre y Apellido
        if (form.username.value == "") {
            errorsList.push("El nombre no debe estar vacío");
        } else if (form.username.value.length < 2) {
            errorsList.push("El nombre debe contener más de 2 letras");
        };
        
        let reg1 = /^[a-zA-Z0-9_]{3,8}@[a-zA-Z0-9_]{1,8}\.[a-zA-Z0-9_]{1,11}$/;
        
        // Email
        if (form.email.value == "") {
            errorsList.push("El email no debe estar vacío");
        } else if (reg1.test(form.email.value)) {
            errorsList.push("El email debe tener un formato válido");
        };


        // // Avatar
        if (form.avatar.value == avatar.value + /.(gif|jpeg|jpg|png)/) {
            errorsList.push("Comprueba la extensión de tus imagenes, recuerda que los formatos aceptados son .gif, .jpeg, .jpg y .png'email no debe estar vacío")
            console.log(form.avatar);
        };

        // Contraseña
        if (form.password.value == "") {
            errorsList.push("La contraseña no debe estar vacía");
        };

        if (errorsList.length > 0) {
            event.preventDefault();
            errosHTML.innerHTML = "";
            errorsList.forEach((error) => {
                errosHTML.innerHTML += "<li>" + error + "</li>"
            });
        }
        console.log("se envia el formulario");
    })
});
