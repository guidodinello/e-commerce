function getCart(id){
    return getJSONData(CART_INFO_URL + id + EXT_TYPE);
}

const cartBody = document.getElementById("shopping-cart").getElementsByTagName("tbody")[0];
function addRow({id: id, name: name, count: count, unitCost: unitCost, currency: curr, image: src}){
    cartBody.insertAdjacentHTML("beforeend", 
    `<tr>
        <th scope="row">
            <img class="cart-img pointer" src="${src}" onclick="setProductID(${id})">
        </th>
        <td>${name}</td>
        <td>${curr} ${unitCost}</td>
        <td class="d-flex justify-content-center">
            <input type="number" class="form-control w-25" aria-label="Product Amount" min="1" value="${count}"
            oninput="this.parentNode.nextElementSibling.firstElementChild.innerText = ${unitCost}*this.value;">
        </td>
        <td class="fw-bold">
            ${curr} 
            <span>${unitCost * count}</span>
        </td>
    </tr>`);
}

getCart(25801)
.then(response => {
    response.data.articles.forEach(e => {
        addRow(e);
    });

    const cart = JSON.parse(localStorage.getItem("cartProducts"));
    for (const prod in cart )
        addRow(cart[prod]);
});

