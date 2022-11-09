const cartBody = document.getElementById("shopping-cart-body");

const total = document.getElementById("total");
const subtotal = document.getElementById("subtotal");
const shippingType = document.getElementsByName("shippingType");
const shippingCost = document.getElementById("shippingCost");

const paymenyMethod = document.getElementsByName("paymentMethod");
const paymentMethodMsg = document.getElementById("paymentMethodmsg");
const creditCardInputs = document.getElementsByClassName("cc-info");
const bankTransferInputs = document.getElementsByClassName("bt-info");

const alert = document.getElementById("successAlert"); 
const forms = document.getElementsByClassName("needs-validation");

const successIcon = document.createElement("i");
successIcon.classList.add("fas", "fal", "fa-check-circle", "ps-2");
successIcon.style.color = "#00e03c";
const errorIcon = document.createElement("i");
errorIcon.classList.add("fas", "fal", "fa-exclamation-circle", "ps-2");
errorIcon.style.color = "#ff0602";

// fixer api
let myHeaders = new Headers();
myHeaders.append("apikey", "M037182Z51vFScllUEj53oKBeZ4NTQvi");
let requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};
let conversion_rates = {};

function getCart(id) {
    return getJSONData(CART_INFO_URL + id + EXT_TYPE);
}

// se agrega el id del producto a la fila asi puedo borrar el elemento sin necesidad de borrar todos
// y volverlos a poner
// me defini el atributo data-old-value para el span asi se que valor habia y puedo sumar la diferencia
// en vez de sumar devuelta todos los elementos del carrito
function addRow({ id: id, name: name, count: count, unitCost: unitCost, currency: curr, image: src }) {
    if (curr != "USD") {
        unitCost = (unitCost / conversion_rates[curr]).toFixed(0);
    }        
    cartBody.insertAdjacentHTML("beforeend",
        `<tr id="item-${id}" class="cart-item">
            <th scope="row">
                <img class="cart-img pointer" src="${src}" onclick="setProductID(${id})">
            </th>
                <td>${name}</td>
                <td>USD ${unitCost}</td>
                <td class="d-flex justify-content-center">
                    <input id="input-item-${id}" type="number" class="form-control w-25" aria-label="Product Amount" min="1" value="${count}"
                    oninput="updateSubtotal(this, ${unitCost})">
                </td>
                <td class="fw-bold">
                USD 
                    <span data-oldvalue="${unitCost * count}">${unitCost * count}</span>
                </td>
                <td>
                    <button onclick="removeCartItem(${id})" class="btn">
                        <i class="fas fa-trash my-auto text-danger"></i>
                    </button>
                </td>
        </tr>`);

    subtotal.innerText = (parseFloat(subtotal.innerText) + unitCost * count).toFixed(0);
}

function removeCartItem(id) {
    const cartItem = document.getElementById(`item-${id}`);
    // se remueve del DOM
    cartItem.remove();
    // se remueve del localStorage
    const cart = JSON.parse(localStorage.getItem("cartProducts"));
    delete cart[id];
    // se vuelve a guardar el json actualizado
    localStorage.setItem("cartProducts", JSON.stringify(cart));
    // se actualiza el valor del subtotal
    subtotal.innerText = 
        parseInt(subtotal.innerText) - 
        // se obtiene el valor anterior del span
        parseInt(cartItem.lastElementChild.previousElementSibling.firstElementChild.innerText);
    // actualizar el resto de valores
    updateTotalAndShippingCost();
}

function updateTotalAndShippingCost() {
    let shippingCostValue = 0;
    let checked = null;
    // chequeamos que haya un metodo de envio clickeado
    for (const t of shippingType)
        if (t.checked) {
            checked = t;
            break;
        }
    // si lo hay se actualiza el costo de envio y el total
    if (checked) {
        shippingCostValue =
            ( parseFloat(subtotal.innerText) * parseFloat(checked.value) ).toFixed(0);
        shippingCost.innerText = shippingCostValue;
    } 
    total.innerText = 
        ( parseFloat(shippingCostValue) + parseFloat(subtotal.innerText) ).toFixed(0);
}

function updateSubtotal(input, unitCost) {
    if (input.value < 1) {
        input.value = 1;
    }
    const span = input.parentNode.nextElementSibling.firstElementChild;
    // se setea el subtotal asociado
    span.innerText = unitCost * input.value;
    // se actualiza el subtotal general
    subtotal.innerText = ( parseFloat(subtotal.innerText) + 
        // diferencia nuevo valor - valor anterior
        (parseFloat(span.innerText) - parseFloat(span.dataset.oldvalue)) ).toFixed(0);
    // actualizo el atributo valor anterior
    span.dataset.oldvalue = span.innerText;

    updateTotalAndShippingCost();
}

for (const t of shippingType){
    t.addEventListener("change", updateTotalAndShippingCost);
}

for (const p of paymenyMethod)
    p.addEventListener("change", () => {
        // el primer metodo de pago es la tarjeta de credito
        const disable = paymenyMethod[0].checked ? false : true;
        // habilitado o deshabilitado de campos segun el metodo seleccionado
        for (const input of creditCardInputs)
            input.disabled = disable;
        for (const input of bankTransferInputs)
            input.disabled = !disable;
        // mensaje de seleccion exitosa
        paymentMethodMsg.innerText = disable ? "Transferencia Bancaria" : "Tarjeta de Credito";
        paymentMethodMsg.style.color = "green";
        paymentMethodMsg.appendChild(successIcon);
    });

document.getElementById("checkoutBtn").addEventListener("click", (e) => {
    let valid = true;
    for (const form of forms) {
        if (!form.checkValidity()) {
            valid = false;
            // formulario de metodo de pago
            if (form.id === "pmForm") {
                    paymentMethodMsg.innerText = "Debe rellenar los campos";
                    paymentMethodMsg.style.color = "#ff0602";
                    paymentMethodMsg.appendChild(errorIcon);
            }
        }
        form.classList.add('was-validated');
    }
    if (valid) {
        alert.classList.remove("d-none");
        setTimeout( () => {
            for (const form of forms) 
                form.submit();
            window.location.replace("main.html");
        }, 3000);
    }
});

fetch("https://api.apilayer.com/fixer/latest?symbols=UYU%2CEUR%2CBRL%2CARS&base=USD", requestOptions)
.then(response => { return response.json(); })
.then(data => { conversion_rates = data.rates; })
.then(() => { 
    getCart(25801).then(response => {
        response.data.articles.forEach(e => {
            addRow(e);
        });
        
        const cart = JSON.parse(localStorage.getItem("cartProducts"));
        for (const prod in cart)
            addRow(cart[prod]);
        
        updateTotalAndShippingCost();
    });
});

