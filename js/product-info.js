function getProductInfo(id) {
    return getJSONData(PRODUCT_INFO_URL + id + EXT_TYPE);
}
function getProductComments(id) {
    return getJSONData(PRODUCT_INFO_COMMENTS_URL + id + EXT_TYPE);
}

function imagesCard(active, name, src1,src2) {
    return `
        <div class="carousel-item ${active? "active":""}" data-bs-interval="${5000}">
            <div class="row">
                <img src=${src1} class="rounded d-block w-50" alt="Illustrative image of ${name}">
                <img src=${src2} class="rounded d-block w-50" alt="Illustrative image of ${name}">
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
    imagesContainer.innerHTML += imagesCard(true, name, images[0], images[1]);   

    let slideNumber = 2;
    // agrega el resto de imagenes al carrusel
    for (let i=2; i<images.length; i+=2) {
        carouselBtns.innerHTML += carouselButton(false, slideNumber);
        imagesContainer.innerHTML += imagesCard(false, name, images[i], images[i+1]);
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
    showSpinner();
    showProductInfo(response.data);
    hideSpinner();
});
getProductComments(localStorage.getItem("productID"))
.then( (response) => {
    showSpinner();
    showComments(response.data);
    hideSpinner();
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
    // devuelve un array de arrays [match, group]
    const m = Array.from(now.match(regexp2d));
    console.log(m);

    const addZero = (d) => { return (d.length==1)? 0+d : d }
    const hora = (h, pm) => { return pm? parseInt(h)+12: h }
    // me interesan los grupos, por eso siempre es la segunda posicion
    now = m[2] +"-"+                        // yyyy-                        
          addZero(m[0]) +"-"+               // mm-          
          addZero(m[1]) +" "+               // dd_            
          addZero(hora(m[3],flagPM)) +":"+  // hh:                    
          m[4] + ":"+                       // mm:        
          m[5];                             // ss
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

/*
 lo que llevo mas tiempo fue, 1.formatear el date 2.el carrusel
*/