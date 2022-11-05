function checkUserLoggedIn() {
    /*
    si no hay un usuario logueado, redirigir a login.html
    observar que el replace no permite volver a la página anterior
    */
    if (!localStorage.getItem("loggedUser")) {
        window.location.replace("index.html");
    }
  }
  
  checkUserLoggedIn();