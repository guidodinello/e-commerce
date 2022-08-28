function getProductsByCategoryName(cat_name){
    return getJSONData(CATEGORIES_URL)
    .then( (response) => {
        // para cada cateogria del array de categorias recibido
        for (let cat of response.data)
            if (cat.name === cat_name)
                // si coincide el nombre de la categoria se hace la peticion de los productos de la misma
                return getJSONData(PRODUCTS_URL + cat.id + EXT_TYPE)
                .then( (response) => {
                    return response.data;
                });
    })
}

/*
Nueva FUNCION
*/
function getProductsByCategoryId(id){
    return getJSONData(PRODUCTS_URL + id + EXT_TYPE)
            .then( (response) => {
                return response.data;
            });
}

function productCard(p){
    /*
    La estructura se copio de categorires.html (modificando los atributos necesarios) para preservar el estilo de la pagina
    */
    return `
    <div class="list-group-item list-group-item-action cursor-active">
        <div class="row">
            <div class="col-3">
                <img src="${p.image}"
                    alt="${p.name}"
                    class="img-thumbnail">
            </div>
            <div class="col">
                <div class="d-flex w-100 justify-content-between">
                    <h4 class="mb-1">${p.name} - ${p.currency} ${p.cost}</h4>
                    <small class="text-muted">${p.soldCount} vendidos</small>
                </div>
                <p class="mb-1">${p.description}</p>
            </div>
        </div>
    </div>`
}

function listProducts(container, products){
    // genera el contenedor de cada producto y lo agrega al div lista de productos
    container.innerHTML = "";
    for (let product of products) {
        container.innerHTML += productCard(product);
    }
}

// obtenemos el contenedor donde va a ir la lista de productos
const list_div = document.getElementById("product-list-container");

// hacemos la peticion de los productos y los listamos en el contenedor hallado previamente
getProductsByCategoryId(localStorage.getItem("catID"))
.then( (response) => {
    listProducts(list_div, response.products);
});

const search = document.getElementById("search-input")

const ascBtn = document.getElementById("sortAsc");
const descBtn = document.getElementById("sortDesc");
const relevanceBtn = document.getElementById("sortByCount");
const limpiarBtn = document.getElementById("clearRangeFilter");

const filtrarBtn = document.getElementById("rangeFilterCount");
const maxBound = document.getElementById("rangeFilterCountMax");
const minBound = document.getElementById("rangeFilterCountMin");


ascBtn.addEventListener("click", () => {
    listProducts(list_div, products.sort((a,b) => {
        if (a.precio < b.precio) return 1;
        if (a.precio > b.precio) return -1;
        return 0;
    }));
});

descBtn.addEventListener("click", () => {
    
});

relevanceBtn.addEventListener("click", () => {
    
});

limpiarBtn.addEventListener("click", () => {
    minBound.value = "";
    maxBound.value = "";
});

function biggerThanZero(input) {
    if(input.value<0)input.value=0;
}

function errorMsg(container) {
    container.style.border = "1px solid red";
    setTimeout( () => {
        container.style.border = "1px solid #ced4da";
    },3000);
}

filtrarBtn.addEventListener("click", () => {
    if (minBound.value > maxBound.value) {
        errorMsg(minBound);
        errorMsg(maxBound);
    } else {

    }
});


