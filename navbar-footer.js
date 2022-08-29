
const navbar = `  <nav class="navbar navbar-expand-lg navbar-dark bg-dark p-1">
<div class="container">
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav w-100 justify-content-between">
      <li class="nav-item">
        <a class="nav-link active" href="main.html">Inicio</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="categories.html">Categorías</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="sell.html">Vender</a>
      </li>
      <li class="nav-item">
        <div class="flex-row-container">
          <img id="nav-usrpicture" src="">
          <a id="nav-usremail" class="nav-link" href="my-profile.html"></a>
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

const picture = document.getElementById("nav-usrpicture");
if (localStorage.getItem("usrPicture") === null)
    picture.src = "img/img_perfil.png";
else
    picture.src = localStorage.getItem("usrPicture");
document.getElementById("nav-usremail").innerText = localStorage.getItem("usrEmail");