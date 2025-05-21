const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartCounter = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const addressInput = document.getElementById("adress");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrindo o carrinho modal
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
});

// Fechando o modal carrinho quando clicado fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// Abrindo o menu
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    //Adicionando ao carrinho
    addToCart(name, price);
  }
});

// Adicionando ao carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  updateCartModal();
}

// Atualizando o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col",
    );
    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <p class="font-meium">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
      </div>

     
      <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover        
      </button>      
      

    </div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

// Removendo do carrinho

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}
// Endereço
addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
  }
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
     text: "Restaurante fechado, volte mais tarde!",
     duration: 3000,
     close: true,
     gravity: "top",
     position: "right",
     stopOnFocus: true,
     style: {
       background: "#ef4444",
     },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  //Enviar o pedido para API
  const cartItem = cart
    .map((item) => {
      return ` ${item.name} Quantidade: (${
        item.quantity
      }) Preço: R$ ${item.price.toFixed(2)} | `;
    })
    .join("");
  const message = encodeURIComponent();
  const phone = "+5561999999999";
  window.open(
    `https://wa.me/${phone}?text=${cartItem} Endereço: ${addressInput.value}, _blank`,
  );

  cart = [];
  updateCartModal();
});

// Aviso do restaurante aberto ou não
function checkRestaurantOpen() {
  const date = new Date();
  const hora = date.getHours();
  return hora >= 18 && hora < 22; // Aberto das 18h as 22h
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();
if (isOpen) {
  spanItem.classList.add("bg-green-600");
  spanItem.classList.remove("bg-red-500");
} else {
  spanItem.classList.add("bg-red-500");
  spanItem.classList.remove("bg-green-600");
}
