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


        // Avatar
        let fileInput = document.getElementById('avatar');
        let file = fileInput.files[0];
        if (!file) {
            errorsList.push("Por favor, selecciona una imagen.");
        } else {
            // Verificar el tipo de archivo
            let allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                errorsList.push("Por favor, selecciona un archivo de imagen válido (JPG, JPEG, PNG, GIF).");
            }
        }

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
