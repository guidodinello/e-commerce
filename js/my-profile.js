const form = document.getElementById("userData");

const firstName = document.getElementById("firstName");
const middleName = document.getElementById("middleName");
const surname = document.getElementById("firstSurname");
const secondSurname = document.getElementById("secondSurname");
const email = document.getElementById("userEmail");
const telephone = document.getElementById("telNumber");
const picture = document.getElementById("userPicture");

const updateButton = document.getElementById("saveChangesBtn");
const alert = document.getElementById("successAlert");

const pictureInput = document.getElementById("userPictureInput");
const fileReader = new FileReader();


function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    
    //const userDOMinfo = [firstName, middleName, surname, secondSurname, email, telephone, picture];
    // for (const input of userDOMinfo) {
    //     input.value = user[input.id] || "";

    firstName.value = user.name || "";
    middleName.value = user.middleName || "";
    surname.value = user.lastname || "";
    secondSurname.value = user.secondLastname || "";
    email.value = user.email || "";
    telephone.value = user.telephone || "";
    picture.src = user.picture || "";
}

function updateUserInfo({name, middleName, lastname, secondLastname, email, telephone, newPicture}) {
    var user = JSON.parse(localStorage.getItem("loggedUser"));

    user.name = name;
    user.middleName = middleName;
    user.lastname = lastname;
    user.secondLastname = secondLastname;
    user.email = email;
    user.telephone = telephone;
    user.picture = newPicture;

    // podria pasarle un objeto a la funcion, recorrer con un for los atributos de user y si el atributo del objeto pasado como parametro contiene un valor para ese atributo actualizarlo, sino no.

    localStorage.setItem("loggedUser", JSON.stringify(user));
} 

pictureInput.addEventListener("change", () => {
    fileReader.readAsDataURL(pictureInput.files[0]);
    // el read es asincrono, por eso esperamos a que haya cargado la imagen
    fileReader.addEventListener("load", () => {
        picture.src = fileReader.result;
    });
});

updateButton.addEventListener("click", () => {
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    updateUserInfo({
        name: firstName.value,
        middleName: middleName.value,
        lastname: surname.value,
        secondLastname: secondSurname.value,
        email: email.value,
        telephone: telephone.value,
        newPicture: picture.src
    });
    loadUserInfo();

    alert.classList.remove("d-none");
    setTimeout( () => {
        alert.classList.add("d-none");
        // por consistencia visual, para recargar los datos del navbar
        window.location.reload();
    }, 1000);
});

loadUserInfo();