/* DUDAS:
- Hay que usar firebase para el login?
    - https://firebase.google.com/docs/auth/web/google-signin?hl=es
    No precisa firebase
    - https://www.mabisy.com/blog-ayuda/activar-y-configurar-inicio-sesion-google

- Para modificar el estilo del login
    - Esribir en el styles.css
    - Crear un archivo login.css
    - Hacerlo desde login.js usando la etiqueta style como hice

- Como buscar el boton submit del login
    - le doy un id en el html
    - lo busco por el tag sabiendo que solo hay uno

- Validacion de campos obligatorios del login
    - puedo usar el atributo required
        - porque en este caso no esta funcionando
    - o tengo que hacerlo desde javascript

- Como arreglar elegantemente que dejene de que aparezca un nuevo mensaje de error cuando le da submit con campos vacios
*/

const head = document.getElementsByTagName('head')[0];
head.innerHTML += `
<style>
.form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
}
.form-floating {
    margin-bottom: 10px;
    text-align: center;
}
</style>
`;

const main = document.getElementsByTagName("main")[0];
main.classList.add("form-signin");
main.innerHTML += `
  <form>
    <img class="mb-4" src="img/login.png" alt="" width="100%" height="100%">
    <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

    <div class="form-floating">
      <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
      <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating">
      <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
      <label for="floatingPassword">Password</label>
    </div>

    <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
    <div id="g-oauth2" class="g-signin2" data-onsuccess="onSignIn"></div>
  </form>
`;

function onSignIn(usr) {
    window.location.replace("main.html");
}

const submit_btn = document.querySelectorAll("button[type=submit]")[0];
submit_btn.addEventListener("click", function(event) {
    event.preventDefault();

    const pass = document.getElementById("floatingPassword");
    const email = document.getElementById("floatingInput");
    let valid = true;
    if (email.value === "") {
        email.style.border = "1px solid red";
        email.nextElementSibling.insertAdjacentHTML("afterend", `<span style="color: red;"">Email is required</span>`);
        valid = false;
    }
    if (pass.value === "") {
        pass.style.border = "1px solid red";
        pass.nextElementSibling.insertAdjacentHTML("afterend", `<span style="color: red;">Password is required</span>`);
        valid = false;
    }
    if (valid) {
        window.location.replace("main.html");
    }
});