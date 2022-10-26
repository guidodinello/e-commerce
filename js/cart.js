function getCart(id) {
    return getJSONData(CART_INFO_URL + id + EXT_TYPE);
}


const cartBody = document.getElementById("shopping-cart").getElementsByTagName("tbody")[0];

// se agrega el id del producto a la fila asi puedo borrar el elemento sin necesidad de borrar todos
// y volverlos a poner
function addRow({ id: id, name: name, count: count, unitCost: unitCost, currency: curr, image: src }) {
    cartBody.insertAdjacentHTML("beforeend",
        `<tr id="item-${id}" class="cart-item">
            <th scope="row">
                <img class="cart-img pointer" src="${src}" onclick="setProductID(${id})">
            </th>
                <td>${name}</td>
                <td>${curr} ${unitCost}</td>
                <td class="d-flex justify-content-center">
                    <input type="number" class="form-control w-25" aria-label="Product Amount" min="1" value="${count}"
                    oninput="calcSubtotal(this, ${unitCost})">
                </td>
                <td class="fw-bold">
                ${curr} 
                    <span>${unitCost * count}</span>
                </td>
                <td>
                    <button onclick="removeCartItem(${id})" class="btn">
                        <i class="fas fa-trash my-auto text-danger"></i>
                    </button>
                </td>
        </tr>`);

    subtotal.innerText = parseInt(subtotal.innerText) + unitCost * count;
}

function removeCartItem(id) {
    // se remueve del DOM
    document.getElementById(`item-${id}`).remove();
    // se remueve del localStorage
    const cart = JSON.parse(localStorage.getItem("cartProducts"));
    delete cart[id];
    // se vuelve a guardar el json actualizado
    localStorage.setItem("cartProducts", JSON.stringify(cart));
}

function calcSubtotal(el, unitCost) {
    if (el.value < 1) {
        el.value = 1;
    }
    el.parentNode.nextElementSibling.firstElementChild.innerText = unitCost * el.value;
}

getCart(25801)
    .then(response => {
        response.data.articles.forEach(e => {
            addRow(e);
        });

        const cart = JSON.parse(localStorage.getItem("cartProducts"));
        for (const prod in cart)
            addRow(cart[prod]);
    });

// TODO
const subtotal = document.getElementById("subtotal");
function updateSubtotalGeneral(element) {
    console.log(parseInt(subtotal.innerText), - parseInt(element.oldValue), parseInt(element.innerText));
    // nuevo subtotal es el subtotal anterior mas la diferencia entre el nuevo valor y el anterior
    subtotal.innerText = parseInt(subtotal.innerText) - parseInt(element.oldValue) + parseInt(element.innerText);
    // se actualiza el valor anterior
    element.oldValue = element.innerText;
}

const paymenyMethod = document.getElementsByName("paymentMethod");
const paymentMethodMsg = document.getElementById("paymentMethodmsg");
const creditCardInputs = document.getElementsByClassName("cc-info");
const bankTransferInputs = document.getElementsByClassName("bt-info");

const successIcon = document.createElement("i");
successIcon.classList.add("fas", "fal", "fa-check-circle", "ps-2");
successIcon.style.color = "#00e03c";
const errorIcon = document.createElement("i");
errorIcon.classList.add("fas", "fal", "fa-exclamation-circle", "ps-2");
errorIcon.style.color = "#ff0602";

for (const p of paymenyMethod)
    p.addEventListener("change", () => {
        // el primer metodo de pago es la tarjeta de credito
        const disable = paymenyMethod[0].checked ? false : true;
        for (const input of creditCardInputs)
            input.disabled = disable;
        for (const input of bankTransferInputs)
            input.disabled = !disable;
        paymentMethodMsg.innerText = disable ? "Transferencia Bancaria" : "Tarjeta de Credito";
        paymentMethodMsg.style.color = "green";
        paymentMethodMsg.appendChild(successIcon);
    });

const alert = document.getElementById("successAlert"); 
const forms = document.getElementsByClassName("needs-validation");
document.getElementById("checkoutBtn").addEventListener("click", (e) => {
    /*
    Los campos calle, número y esquina, no podrán estar vacíos.             | DONE.
    Deberá estar seleccionada la forma de envío.                            | DONE.
    La cantidad para cada artículo deberá estar definida y ser mayor a 0.   | DONE, se maneja en el evento input.
    Deberá haberse seleccionado una forma de pago.                          | DONE.
    Los campos, para la forma de pago seleccionada, no podrán estar vacíos. | DONE.
    */
    let valid = true;
    for (const form of forms) {
        if (form.checkValidity() === false) {
            valid = false;
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
            alert.classList.add("d-none");
        }, 5000);

        for (const form of forms) 
            form.submit();
    }
});

// TODO 
// actualizar subtotal, total, etc en function de productos del carrito y tipo de envio