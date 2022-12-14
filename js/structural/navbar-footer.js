
const navbar = `  <nav class="navbar navbar-expand-lg navbar-dark bg-dark p-1">
<div class="container">
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav w-100 justify-content-between">
      <li class="nav-item my-auto">
        <a class="nav-link active" href="main.html">Inicio</a>
      </li>
      <li class="nav-item my-auto">
        <a class="nav-link" href="categories.html">Categorías</a>
      </li>
      <li class="nav-item my-auto">
        <a class="nav-link" href="sell.html">Vender</a>
      </li>
      <li class="nav-item">
        <div class="dropdown">
            <button class="btn btn-secondary bg-dark dropdown-toggle flex-row-container py-0" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                <img id="nav-usrpicture" src="">
                <span id="nav-usremail" class="nav-link"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="dropdownMenuButton2">
                <li><a class="dropdown-item d-flex justify-content-between" href="my-profile.html">
                    Mi Perfil <i class="fas fa-user my-auto"></i>
                    </a>
                </li>
                <li><a class="dropdown-item d-flex justify-content-between" href="cart.html">
                    Mi Carrito <i class="fas fa-shopping-cart my-auto"> </i>
                    </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item d-flex justify-content-between" id="cerrar-sesion" href="index.html">
                    Cerrar Sesion <i class="fas fa-sign-out-alt my-auto"> </i>
                    </a>
                </li>
            </ul>
        </div>
      </li>
    </ul>
  </div>
</div>
</nav>
`;
document.body.insertAdjacentHTML("afterbegin", navbar);

const footer = `  <footer class="text-muted">
<div class="container">
  <p class="float-end">
    <a href="#">Volver arriba</a>
  </p>
  <p>Este sitio forma parte de <a href="https://jovenesaprogramar.edu.uy/" target="_blank">Jovenes a Programar</a> -
    2022</p>
  <p>Clickea <a target="_blank" href="Letra.pdf">aquí</a> para descargar la letra del obligatorio.</p>
</div>
</footer>`

document.getElementsByTagName("main")[0].insertAdjacentHTML("afterend", footer);
const userInfo = JSON.parse(localStorage.getItem("loggedUser"));

const navUsrPicture = document.getElementById("nav-usrpicture");
const navUsrEmail = document.getElementById("nav-usremail");

if (userInfo === null) {
    navUsrPicture.src = "img/img_perfil.png";
    navUsrEmail.innerText = "Iniciar Sesión";
} else {
    navUsrPicture.src = userInfo.picture;
    navUsrEmail.innerText = userInfo.email;
}

document.getElementById("cerrar-sesion").addEventListener("click", () => {
    localStorage.removeItem("loggedUser");
});