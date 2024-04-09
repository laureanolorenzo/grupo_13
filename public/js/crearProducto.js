window.addEventListener("load", () => {
    let form = document.querySelector("form");
    let errosHTML = document.querySelector(".errores");


    form.addEventListener("submit", (event) => {
        let errorsList = [];

        // Nombre
        if (form.title.value == "") {
            errorsList.push("El título no debe estar vacío");
        } else if (form.title.value.length < 5) {
            errorsList.push("El título debe contener más de 5 caracteres");
        };

        // Descripción
        if (form.description.value.length < 20) {
            errorsList.push("La descripción debe contener más de 20 caracteres");
        }

        // Poster
        let fileInput = document.getElementById('image');
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