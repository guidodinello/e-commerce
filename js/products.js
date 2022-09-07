function getProductsByCategoryId(id){
    return getJSONData(PRODUCTS_URL + id + EXT_TYPE)
            .then( (response) => {
                return response.data;
            });
}

function setProductID(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html"
}

function productCard(p){
    /*
    La estructura se copio de categorires.html (modificando los atributos necesarios) para preservar el estilo de la pagina
    */
    return `
    <div onclick=setProductID(${p.id}) class="list-group-item list-group-item-action cursor-active">
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
    // si no hay productos despliega un cartel avisando
    if (products.length === 0) {
        container.innerHTML +=  `
        <div class="list-group-item list-group-item-action cursor-active mt-3">
            <div class="row">
                <p class="m-0"> No hay productos que cumplan con esas características </p>
            </div>
        </div>`
    }
}

function sortProducts(criteria, array){
    let result = [];
    switch (criteria) {
        case ASC_BY_PRICE:
            result = array.sort((a,b) => {
                if (a.cost < b.cost){ return -1; }
                if (a.cost > b.cost){ return 1; }
                return 0;
            });
            break;
        case DESC_BY_PRICE:
            result = array.sort((a,b) => {
                if (a.cost > b.cost){ return -1; }
                if (a.cost < b.cost){ return 1; }
                return 0;
            });
            break;
        case ASC_BY_COUNT:
            result = array.sort((a, b) => {
                if (a.soldCount > b.soldCount){ return -1; }
                if (a.soldCount < b.soldCount){ return 1; }
                return 0;
            });
            break;
    }
    return result;
}

function sortAndList(criteria, array) {
    // ordena los productos segun cierto criterio y dsps los lista
    currentCriteria = criteria;
    if (array != undefined)
        currentArray = array;

    currentArray = sortProducts(currentCriteria, currentArray);
    if (filtering)
        currentArray = arrayProducts.filter((item) => {
            return item.cost < maxCount && item.cost > minCount;
        });

    listProducts(list_div, currentArray);
}

const ASC_BY_PRICE = "asc";
const DESC_BY_PRICE = "desc";
const ASC_BY_COUNT = "rel";
let arrayProducts = [];
let currentCriteria = undefined;
let minCount = NaN;
let maxCount = NaN;
let filtering = false;

// obtenemos el contenedor donde va a ir la lista de productos
let list_div = document.getElementById("product-list-container");

document.addEventListener("DOMContentLoaded", function(e){
    // se listan los productos de la categoria seleccionada al cargar la pagina
    getProductsByCategoryId(localStorage.getItem("catID")).then( (response) => {
            arrayProducts = response.products;
            currentArray = arrayProducts;
            listProducts(list_div, arrayProducts);
    });

    document.getElementById("sortAsc").addEventListener("click", () => {
        sortAndList(ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", () => {
        sortAndList(DESC_BY_PRICE);
    });

	document.getElementById("sortByCount").addEventListener("click", () => {
        sortAndList(ASC_BY_COUNT);
    });

    const maxBound = document.getElementById("rangeFilterCountMax");
    const minBound = document.getElementById("rangeFilterCountMin");

	document.getElementById("clearRangeFilter").addEventListener("click", () => {
        minBound.value = "";
        maxBound.value = "";

        minCount = NaN;
        maxCount = NaN;

        currentArray = arrayProducts;
        listProducts(list_div, currentArray);
    });

	document.getElementById("rangeFilterCount").addEventListener("click", () => {
        //devuelve NaN si "" o undefined
        minCount = parseInt(minBound.value);
        maxCount = parseInt(maxBound.value);

        let err = false;
        if (isNaN(minCount)){
            errorMsg(minBound);
            err = true;
        }
        if (isNaN(maxCount)){
            errorMsg(maxBound);
            err = true;
        }
        if (err) return;
        if (minCount > maxCount){
            errorMsg(maxBound);
            errorMsg(minBound);
            return;
        }
        currentArray = arrayProducts;
        filtering = true;
        sortAndList(currentCriteria, currentArray);
        filtering = false;
    });

    const search = document.getElementById("search-input");
    search.addEventListener("input", () => {
        const searchText = search.value.toLowerCase();
        currentArray = arrayProducts.filter((element) => {
            return  element.name.toLowerCase().includes(searchText) ||
                    element.description.toLowerCase().includes(searchText);  
        });
        listProducts(list_div, currentArray);
    });

});