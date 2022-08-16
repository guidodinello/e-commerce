
function handleCredentialResponse(usr) {
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
        window.location.replace("main.html");
    } else {
        setTimeout(()=> { errors.forEach( (err) => {
            err[0].style.border = "1px solid #ced4da";
            err[1].innerText = "";
        })}, 3000);
    }
});