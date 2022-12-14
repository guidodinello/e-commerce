const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

function getJSONData(url){
    let result = {};
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        return result;
    });
}

/* =============================== */
function biggerThanZero(input) {
  if(input.value<0)input.value=0;
}
function errorMsg(container) {
  container.style.border = "1px solid red";
  setTimeout( () => {
      container.style.border = "1px solid #ced4da";
  },3000);
}
function setCatID(id) {
  localStorage.setItem("catID", id);
  window.location = "products.html"
}
function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}
function showModal(img) {
  const modal = document.getElementById("modal");
  modal.style.display = "block";
  document.getElementById("modal-img").src = img.src;
  document.getElementById("modal-caption").innerHTML = img.alt;
  document.getElementsByClassName("close")[0].onclick = () => {
      modal.style.display = "none";
  }
}
/* =============================== */