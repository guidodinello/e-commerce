function getProductInfo(id) {
    return getJSONData(PRODUCT_INFO_URL + id + EXT_TYPE);
}
function getProductComments(id) {
    return getJSONData(PRODUCT_INFO_COMMENTS_URL + id + EXT_TYPE);
}

// modifique esta agregandole el parametro clickable que decide si la imagen debe rederigir
// o abrir la vista de la imagen (modal)
// y el array images
// set product id lo pase al init.js

//FALTA MOSTRAR EL NOMBRE EN LOS RELATED PRODUCTS
function imagesCard(active, clickable, [name1, src1, id1, name2, src2, id2]) {
    return `
        <div class="carousel-item ${active? "active":""}" data-bs-interval="${5000}">
            <div class="row">
                <img src=${src1} class="rounded d-block w-50 pointer" alt="Illustrative image of ${name1}" onclick=${clickable? `"setProductID(${id1})"` : `"showModal(this)"`}>
                <img src=${src2} class="rounded d-block w-50 pointer" alt="Illustrative image of ${name2}" onclick=${clickable? `"setProductID(${id2})"` : "showModal(this)"}>
            </div>
        </div>`;
}

const carouselButton = (active, number) => {
    return `<button type="button" data-bs-target="#carousel" data-bs-slide-to="${number-1}" aria-label="Slide ${number}" ${active? `class="active"`: ""}></button>`;
}
const nameField = document.getElementById("name");
const priceField = document.getElementById("price");
const descriptionField = document.getElementById("description");
const categoryField = document.getElementById("category");
const soldCountField = document.getElementById("soldCount");
const imagesContainer = document.getElementById("illustrative-images-container");
const carouselBtns = document.getElementById("carousel-buttons");
// agregue estos dos nuevos componentes
const relProdsImgCont = document.getElementById("illustrative-images-related-products-container");
const relProdsCarBtns = document.getElementById("carousel-related-products-buttons");


function showProductInfo({id, name, description, cost, currency, soldCount, category, images, relatedProducts}) {
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
    carouselBtns.innerHTML += carouselButton(true, 1);
    imagesContainer.innerHTML += imagesCard(true, false, [name, images[0], id, name, images[1], id]);   

    let slideNumber = 2;
    // agrega el resto de imagenes al carrusel
    for (let i=2; i<images.length; i+=2) {
        carouselBtns.innerHTML += carouselButton(false, slideNumber);
        imagesContainer.innerHTML += imagesCard(false, false, [name, images[i], id, name, images[i+1], id]);
        slideNumber++;
    }

    // esta parte fue agregada
    // analogo para el carousel de productos relacionados
    const rp = relatedProducts;
    if (relatedProducts.length % 2 != 0) relatedProducts.push(rp[0].image);
    
    relProdsCarBtns.innerHTML += carouselButton(true, 1);
    relProdsImgCont.innerHTML += imagesCard(true, true, 
        [rp[0].name, rp[0].image, rp[0].id,
        rp[1].name, rp[1].image, rp[1].id]);   

    slideNumber = 2;
    for (let i=2; i<rp.length; i+=2) {
        relProdsCarBtns.innerHTML += carouselButton(false, slideNumber);
        relProdsImgCont.innerHTML += imagesCard(false, true, 
            [rp[i].name, rp[i].image, rp[i].id,
            rp[i+1].name, rp[i+1].image, rp[i+1].id]);
        slideNumber++;
    }
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
        commentsContainer.innerHTML += commentCard(c);
    }
}

getProductInfo(localStorage.getItem("productID"))
.then( (response) => {
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

    const addZero = (d) => { return (d.length==1)? 0+d : d }
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
    commentsContainer.innerHTML += commentCard({
        "product": null, 
        "score": userScore.value, 
        "description": userComment.value, 
        "user": localStorage.getItem("usrEmail"), 
        "dateTime": now
    });

    // reseteo los campos
    userScore.selectedIndex = 0;
    userComment.value = "";
});


function showModal(img) {
    const modal = document.getElementById("modal");
    modal.style.display = "block";
    document.getElementById("modal-img").src = img.src;
    document.getElementById("modal-caption").innerHTML = img.alt;
    document.getElementsByClassName("close")[0].onclick = () => {
        modal.style.display = "none";
    }
}