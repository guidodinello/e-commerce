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
    </div>`;
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
        </div>`;
    }
}

function sortProducts({getAttribute, order}, array) {
    // ASC => order = 1; DESC => order = -1;
    return array.sort((a,b) => {
        if (getAttribute(a) < getAttribute(b)) return -1*order;
        if (getAttribute(a) > getAttribute(b)) return 1*order;
        return 0;
    });
}

function sortAndList() {
    // ordena los productos segun cierto criterio y dsps los lista
    currentArray = sortProducts(currentCriteria, currentArray);
    listProducts(list_div, currentArray);
}

const ORDER = Object.freeze({
    ASC : 1,
    DESC : -1
});
// array que guarda la totalidad de los productos
let arrayProducts = [];
// array que guarda los productos en el estado actual (filtrados y/u ordenados)
let currentArray = [];
// array que guarda el par atributo_de_compracion y orden asc o desc
let currentCriteria = {
                        "getAttribute": (p)=>{return p.cost}, 
                        "order": ORDER.ASC
                    };

// obtenemos el contenedor donde va a ir la lista de productos
const list_div = document.getElementById("product-list-container");

document.addEventListener("DOMContentLoaded", function(e){
    // se listan los productos de la categoria seleccionada al cargar la pagina
    getProductsByCategoryId(localStorage.getItem("catID")).then( (response) => {
            arrayProducts = response.products;
            currentArray = arrayProducts;
            listProducts(list_div, arrayProducts);
    });

    document.getElementById("sortAsc").addEventListener("click", () => {
        currentCriteria = {"getAttribute": (p)=>{return p.cost}, "order": ORDER.ASC};
        sortAndList();
    });

    document.getElementById("sortDesc").addEventListener("click", () => {
        currentCriteria = {"getAttribute": (p)=>{return p.cost}, "order": ORDER.DESC};
        sortAndList();
    });

	document.getElementById("sortByCount").addEventListener("click", () => {
        currentCriteria = {"getAttribute": (p)=>{return p.soldCount}, "order": ORDER.DESC};
        sortAndList();
    });

    const maxBound = document.getElementById("rangeFilterCountMax");
    const minBound = document.getElementById("rangeFilterCountMin");  
    let minCount = NaN;
    let maxCount = NaN;

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
        if (minCount > maxCount){
            errorMsg(maxBound);
            errorMsg(minBound);
            err = true;
        }
        if (err) return;

        currentArray = arrayProducts.filter((item) => {
            return item.cost < maxCount && item.cost > minCount;
        });
        sortAndList();
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