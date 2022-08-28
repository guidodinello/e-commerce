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
    for (let product of products.products) {
        container.innerHTML += productCard(product);
    }
}

function sortAndList(criteria, array) {
    // ordena los productos segun cierto criterio y dsps los lista
    currentCriteria = criteria;
    if (array != undefined)
        currentArray = array;
    
    current

    listProducts(div_list, currentArray);
}


const ASC_BY_PRICE = "asc";
const DESC_BY_PRICE = "desc";
const ASC_BY_REL = "rel";
let currentArray = [];
let currentCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

// obtenemos el contenedor donde va a ir la lista de productos
const list_div = document.getElementById("product-list-container");

document.addEventListener("DOMContentLoaded", function(e){
    // se listan los productos de la categoria seleccionada al cargar la pagina
    getProductsByCategoryId(localStorage.getItem("catID")).then( (response) => {
            if (response.status === "ok"){
                currentCategoriesArray = response.data
                listProducts(list_div, response);
            }
    });

    document.getElementById("asc-price").addEventListener("click", () => {
        sortAndList(ASC_BY_PRICE);
    });

    document.getElementById("desc-price").addEventListener("click", () => {
        sortAndList(DESC_BY_PRICE);
    });

	document.getElementById("relevance").addEventListener("click", () => {
        sortAndList(ASC_REL_BY);
    });

	document.getElementById("filter-btn").addEventListener("click", () => {
        
    });

	document.getElementById("clear-btn").addEventListener("click", () => {
        
    });



});