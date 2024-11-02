let carts = localStorage.getItem("carts") ? JSON.parse(localStorage.getItem("carts")) : [];

$(document).ready(function (){
    carts = localStorage.getItem("carts") ? JSON.parse(localStorage.getItem("carts")) : [];
    updateCartTop();
    showCart();
})

const handleAddCart = (id, price, name, image, slug) =>{
   let productCart = {
    "productID": id,
    "price" : price,
    "name" : name,
    "quantity": 1 ,
    "image" : image,
    "slug" : slug,
   }

   let indexProduct = carts.findIndex(item => item.productID === id);

   if(indexProduct >= 0){
    carts[indexProduct].quantity += 1;
   } else {
    carts.push(productCart);
   }
   localStorage.setItem("carts", JSON.stringify(carts));
   console.log(carts);
   updateCartTop();
   toastr.success("Success")
} 
const updateCartTop = () => {
    let xHtmlCartItem = "";
    let index = 0;
    let indexCount = 0;
    carts.forEach(item => {
        indexCount += item.quantity;
        index++;
        if(index >= 5) return 
        xHtmlCartItem += `
          <div class="top-cart-item">
            <div class="top-cart-item-image">
              <a href="#"><img src="/uploads/default-image/default-image.jpg" alt="${item.name}"></a>
            </div>
            <div class="top-cart-item-desc">
              <div class="top-cart-item-desc-title">
                <a href="#" class="fw-normal">${item.name}</a>
                <span class="top-cart-item-price d-block">$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <div class="top-cart-item-quantity fw-semibold">x ${item.quantity}</div>
            </div>
          </div>`;
    });
   
    $('.top-cart-number').html(indexCount);
    $('.top-cart-items').html(xHtmlCartItem);
}

const showCart = () =>{
    let xHtmlCart = '';
    carts.forEach(item =>{
        xHtmlCart += `
        <tr class="cart_item">
        <td class="cart-product-remove">
          <button onclick="handleRemoveCartItem('${item.productID}')" class="remove" title="Remove this item">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
        <td class="cart-product-thumbnail">
          <img width="64" height="64" src="${item.image}" alt="${item.name}">
        </td>
        <td class="cart-product-name">
          <a href="${item.slug}">${item.name}</a>
        </td>
        <td class="cart-product-price">
          <span class="amount">$${item.price}</span>
        </td> 
        <td class="cart-product-quantity">
          <div class="quantity">
            <button class="btn btn-sm btn-outline-secondary minus" onclick="handleDecreaseQuantity('${item.productID}')">-</button>
            <input type="text" name="quantity" value="${item.quantity}" class="qty form-control text-center" style="width: 60px;">
            <button class="btn btn-sm btn-outline-secondary plus" onclick="handleIncreaseQuantity('${item.productID}')">+</button>
          </div>
        </td>
        <td class="cart-product-subtotal">
          <span class="amount">$${(item.price * item.quantity).toFixed(2)}</span>
        </td>
       </tr>`;
    });
    $('#body-cart').html(xHtmlCart);
}
const handleRemoveCartItem = (id) => {
  carts = carts.filter(item => item.productID !== id);
  localStorage.setItem("carts", JSON.stringify(carts));
  updateCartTop();
  showCart();
  toastr.info("Product removed from cart.");
};
const handleIncreaseQuantity = (id) => {
  let indexProduct = carts.findIndex(item => item.productID === id);
  if (indexProduct >= 0) {
      carts[indexProduct].quantity += 1;
      localStorage.setItem("carts", JSON.stringify(carts));
      updateCartTop();
      showCart();
  }
};

const handleDecreaseQuantity = (id) => {
  let indexProduct = carts.findIndex(item => item.productID === id);
  if (indexProduct >= 0 && carts[indexProduct].quantity > 1) {
      carts[indexProduct].quantity -= 1;
      localStorage.setItem("carts", JSON.stringify(carts));
      updateCartTop();
      showCart();
  }
};
const updateCartTotal = () => {
  let total = 0;
  carts.forEach(item => {
      total += item.price * item.quantity;
  });
  document.getElementById("cartSubtotal").textContent = total.toFixed(2);
};
