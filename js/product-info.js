function getProductInfo(id) {
    return getJSONData(PRODUCT_INFO_URL + id + EXT_TYPE);
}
function getProductComments(id) {
    return getJSONData(PRODUCT_INFO_COMMENTS_URL + id + EXT_TYPE);
}

// se agrego abrir la vista de la imagen (modal) : onclick=showModal(this)
// set product id lo pase al init.js
function imagesCard(active, name, src1, src2) {
    return `
        <div class="carousel-item ${active? "active":""}" data-bs-interval="5000">
            <div class="row">
                <img src=${src1} class="rounded d-block w-50 pointer" alt="Illustrative image of ${name}" onclick="showModal(this)">
                <img src=${src2} class="rounded d-block w-50 pointer" alt="Illustrative image of ${name}" onclick="showModal(this)">
            </div>
        </div>`;
}

// ejemplo desestructurar asignando a nuevos nombres de variable
//const o = {p: 42, q: true};
//const {p: foo, q: bar} = o;
function relatedImagesCard(active, {id: id1, name: name1, image: src1}, {id: id2, name: name2, image: src2}) {
    return `
    <div class="carousel-item ${active? "active":""}" data-bs-interval="5000">
        <div class="row">
            <div class="col text-over-img">
                <img src=${src1} class="rounded d-block w-100 pointer" alt="Illustrative image of ${name1}" onclick="setProductID(${id1})">
                <div class="overlay-text-centered-bottom d-none d-md-block p-2">
                    <h5 class="m-0">${name1}</h5>
                </div>
            </div>
            <div class="col text-over-img">
                <img src=${src2} class="rounded d-block w-100 pointer" alt="Illustrative image of ${name2}" onclick="setProductID(${id2})">
                <div class="overlay-text-centered-bottom d-none d-md-block p-2"">
                    <h5 class="m-0">${name2}</h5>
                </div>
            </div>
        </div>
    </div>`;

}

// se agrego carousel_id para poder diferenciar los dos carouseles de la pagina
const carouselButton = (active, number, carousel_id) => {
    return `<button type="button" data-bs-target="#${carousel_id}" data-bs-slide-to="${number-1}" aria-label="Slide ${number}" ${active? `class="active"`: ""}></button>`;
}
const nameField = document.getElementById("name");
const priceField = document.getElementById("price");
const descriptionField = document.getElementById("description");
const categoryField = document.getElementById("category");
const soldCountField = document.getElementById("soldCount");
const imagesContainer = document.getElementById("illustrative-images-container");
const carouselBtns = document.getElementById("carousel-buttons");
const relProdsImgCont = document.getElementById("illustrative-images-related-products-container");
const relProdsCarBtns = document.getElementById("carousel-related-products-buttons");


function showProductInfo({name, description, cost, currency, soldCount, category, images, relatedProducts}) {
    nameField.innerText = name;
    priceField.innerText = currency + " " + cost;
    descriptionField.innerText = description;
    categoryField.innerText = category;
    soldCountField.innerText = soldCount;

    // si hay cant de img impar le repito la primera al final, en el slider no se nota a no ser que
    // solo venga una
    if (images.length % 2 != 0) images.push(images[0]);
    
    // es necesario distinguir la primera porque hay que agregarle la clase "active" a alguna slide y
    // al boton respectivo
    carouselBtns.insertAdjacentHTML("beforeend", carouselButton(true, 1, "carousel"));
    imagesContainer.insertAdjacentHTML("beforeend", imagesCard(true, name, images[0], images[1]));   

    let slideNumber = 2;
    // agrega el resto de imagenes al carrusel
    for (let i=2; i<images.length; i+=2) {
        carouselBtns.insertAdjacentHTML("beforeend", carouselButton(false, slideNumber, "carousel"));
        imagesContainer.insertAdjacentHTML("beforeend", imagesCard(false, name, images[i], images[i+1]));
        slideNumber++;
    }

    // esta parte fue agregada
    // analogo para el carousel de productos relacionados
    const rp = relatedProducts;
    if (relatedProducts.length % 2 != 0) relatedProducts.push(rp[0].image);
    
    relProdsCarBtns.insertAdjacentHTML("beforeend", carouselButton(true, 1, "carousel-related-products"));
    relProdsImgCont.insertAdjacentHTML("beforeend", relatedImagesCard(true, rp[0], rp[1]));   

    slideNumber = 2;
    for (let i=2; i<rp.length; i+=2) {
        relProdsCarBtns.insertAdjacentHTML("beforeend", carouselButton(false, slideNumber, "carousel-related-products"));
        relProdsImgCont.insertAdjacentHTML("beforeend", relatedImagesCard(false, rp[i], rp[i+1]));
        slideNumber++;
    }

    // para que deje mover el carousel aunque solo hayan dos imagenes
    relProdsCarBtns.insertAdjacentHTML("beforeend", carouselButton(false, slideNumber, "carousel-related-products"));
    relProdsImgCont.insertAdjacentHTML("beforeend", relatedImagesCard(false, rp[0], rp[1]));
}

const getStars = (score) => {
    let result = "";
    for (let i=0; i<score; i++) result += `<span class="fa fa-star checked"></span>`;
    for (let i=score; i<5; i++) result += `<span class="fa fa-star"></span>`;
    return result;
}

function commentCard({product, score, description, user, dateTime}) {
    return `
    <div class="list-group-item list-group-item-action">
        <div class="row">
            <div class="col">
                <div class="d-flex w-100 justify-content-between">
                    <p> 
                        <span class="mb-1 fw-bold">${user}</span> - 
                        ${dateTime} -
                        ${getStars(score)} 
                    </p>
                </div>
                <p class="mb-1 text-muted">${description}</p>
            </div>
        </div>
    </div>`;
}

const commentsContainer = document.getElementById("comment-list-container");
function showComments(comments) {
    for (const c of comments) {
        commentsContainer.insertAdjacentHTML("beforeend", commentCard(c));
    }
}

let product_info;
getProductInfo(localStorage.getItem("productID"))
.then( (response) => {
    product_info = response.data;
    showProductInfo(response.data);
});
getProductComments(localStorage.getItem("productID"))
.then( (response) => {
    showComments(response.data);
});


const userScore = document.getElementById("user-score");
const userComment = document.getElementById("user-comment")
document.getElementById("send-review").addEventListener("click", () => {

    // valido que no haya campos vacios
    let err = false;
    if (userScore.selectedIndex == 0){
        errorMsg(userScore);
        err = true;
    }
    if (!userComment.value){
        errorMsg(userComment);
        err = true;
    }
    if (err) return;

    // mm/dd/yyyy, hh:mm:ss AM
    let now = new Date().toLocaleString();
    
    const regexpPM = /PM/;
    const flagPM = regexpPM.test(now);
    // va a matchear grupos 1 a 4 digitos, esto es porque a veces devuelve
    // 1 digitos (ejemplo: dia 2)
    // 2 digitos (ejemplo: dia 12)
    // 4 digitos (por el anio)
    const regexp2d = /\d{1,4}/g;
    const m = Array.from(now.match(regexp2d));

    const addZero = (d) => { return (d.length==1)? "0"+d : d }
    const hora = (h, pm) => { return pm? parseInt(h)+12: h }
    
    const [mm, dd, yyyy, hh, mmin, ss] = m;
    now = yyyy +"-"+                      // yyyy-                        
          addZero(mm) +"-"+               // mm-          
          addZero(dd) +" "+               // dd_            
          addZero(hora(hh,flagPM)) +":"+  // hh:                    
          mmin + ":"+                     // mm:        
          ss;                             // ss
    // yyyy-mm-dd hh:mm:ss

    // anade el comentario a la lista
    commentsContainer.inserAdjacentHTML("beforeend", commentCard({
        "product": null, 
        "score": userScore.value, 
        "description": userComment.value, 
        "user": localStorage.getItem("usrEmail"), 
        "dateTime": now
    })
    );

    // reseteo los campos
    userScore.selectedIndex = 0;
    userComment.value = "";
});

const addedToCartSuccesfully = document.getElementById("added-to-cart-success");

document.getElementById("buy-btn").addEventListener("click", () => {
    // si no existe un valor de clave cartProducts devuelve un objeto vacio
    // de lo contrario parsea el string a objeto
    var cart = JSON.parse(localStorage.getItem("cartProducts")) || {};

    // se agrega una sola vez cada producto. Tal vez no es lo que quiero?
    // no se que es mejor que cada vez que aprete se sume uno al count
    // o que solo se agregue una vez y dsps el usr modofique la cant desde el carrito
    if (!(product_info.id in cart)) {
        cart[product_info.id] = 
            {
                id: product_info.id,
                name: product_info.name, 
                count: 1, 
                unitCost: product_info.cost, 
                currency: product_info.currency, 
                image: product_info.images[0]
            }
        };
    localStorage.setItem("cartProducts", JSON.stringify(cart));

    // muestra el mensaje de exito por 4 segundos
    addedToCartSuccesfully.classList.remove("d-none");
    setTimeout(() => {
        addedToCartSuccesfully.classList.add("d-none")
    }, 4000);
});