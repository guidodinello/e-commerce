document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });

    const picture = document.getElementById("nav-usrpicture");
    if (localStorage.getItem("usrPicture") === null)
        picture.src = "../img/img_perfil.png";
    else
        picture.src = localStorage.getItem("usrPicture");
    document.getElementById("nav-usremail").innerText = localStorage.getItem("usrEmail");

    console.log(localStorage.getItem("usrEmail"));

});