function decodeJwtResponse(token) {
    // https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function handleCredentialResponse(usr) {    
    // https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions
    const responsePayload = decodeJwtResponse(usr.credential);

    localStorage.setItem("usrPicture", responsePayload.picture);
    localStorage.setItem("usrEmail", responsePayload.email);

    window.location.replace("main.html");
}

const submit_btn = document.querySelector("button[type=submit]");
submit_btn.addEventListener("click", function(event) {
    event.preventDefault();

    const pass = document.getElementById("floatingPassword");
    const email = document.getElementById("floatingInput");
    let errors = [];

    if (email.value === "") {
        email.style.border = "1px solid red";
        const email_span = email.nextElementSibling.nextElementSibling; 
        email_span.innerText = "Email is required";
        errors.push([email, email_span]);
    }
    if (pass.value === "") {
        pass.style.border = "1px solid red";
        const pass_span = pass.nextElementSibling.nextElementSibling; 
        pass_span.innerText = "Password is required";
        errors.push([pass, pass_span]);
    }
    if (errors.length === 0) {
        localStorage.setItem("usrPicture", "img/img_perfil.png");
        localStorage.setItem("usrEmail", email.value);
        window.location.replace("main.html");
    } else {
        setTimeout(()=> { errors.forEach( (err) => {
            err[0].style.border = "1px solid #ced4da";
            err[1].innerText = "";
        })}, 3000);
    }
});