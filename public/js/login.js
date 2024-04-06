window.addEventListener("load", () => {
    let form = document.querySelector("form");
    let errosHTML = document.querySelector(".errores");


    form.addEventListener("submit", (event) => {
        let errorsList = [];
 
        let reg1 = /^[a-zA-Z0-9_]{3,8}@[a-zA-Z0-9_]{1,8}\.[a-zA-Z0-9_]{1,11}$/;

        // Email
        if (form.email.value == "") {
            errorsList.push("El email no debe estar vacío");
        } else if (reg1.test(form.email.value)) {
            errorsList.push("El email debe tener un formato válido");
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