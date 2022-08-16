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

// obtenemos el contenedor donde va a ir la lista de productos
const list_div = document.getElementById("product-list-container");

// hacemos la peticion de los autos y los listamos en el contenedor hallado previamente
const autos = getProductsByCategoryName("Autos")
.then( (response) => {
    listProducts(list_div, response);
});
