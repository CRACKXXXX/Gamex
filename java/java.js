// English: Cache frequently used DOM elements for better performance
const CART_ICON = document.getElementById('cart-icon');
const CART_MODAL = document.getElementById('cart-modal');
const CHECKOUT_MODAL = document.getElementById('checkout-modal');
const THEME_TOGGLE = document.getElementById('theme-toggle');

// English: Shopping cart data structure
let CART = [];

// ========================================
// NAVIGATION FUNCTIONS 
// ========================================

// English: Shows a specific section and updates navigation button states
function showSection(sectionId) {
  // English: Get all content sections
  const sections = document.querySelectorAll('.content-section');

  // English: Hide all sections
  sections.forEach(section => {
    section.style.display = 'none';
  });

  // English: Show the selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.style.display = 'block';
  } else {
    console.error(`No se encontró la sección con ID: ${sectionId}`);
    return;
  }

  // English: Update button states
  const buttons = document.querySelectorAll('nav button');
  buttons.forEach(button => {
    button.classList.remove('active-button');
  });

  // English: Add active class to corresponding button
  const activeButton = Array.from(buttons).find(button => button.onclick.toString().includes(sectionId));
  if (activeButton) {
    activeButton.classList.add('active-button');
  } else {
    console.error(`No se encontró un botón correspondiente para la sección: ${sectionId}`);
  }
}

// ========================================
// LANGUAGE FUNCTIONS 
// ========================================

// English: Toggles language using Google Translate
function toggleLanguage() {
  // English: Initialize Google Translate element
  const googleTranslateElement = new google.translate.TranslateElement({
    pageLanguage: 'es',
    includedLanguages: 'en,es',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');

  // English: Change language to English
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = 'en';
    select.dispatchEvent(new Event('change'));
  } else {
    console.error("No se encontró el elemento de selección para el traductor.");
  }
}

// ========================================
// SCROLL HANDLING 
// ========================================

// English: Event listener for scroll to update active navigation links
document.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('nav ul li a');

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top >= 0 && rect.top < window.innerHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      navLinks[index].classList.add('active');
    }
  });
});

// ========================================
// SHOPPING CART FUNCTIONS 
// ========================================

// English: Adds an item to the cart
function addToCart(name, price, image) {
  const existingItem = CART.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    CART.push({ name, price, image, quantity: 1 });
  }
  updateCartIcon();
  console.log(`${name} agregado al carrito.`);
}

// English: Updates the cart icon with item count
function updateCartIcon() {
  const totalItems = CART.reduce((sum, item) => sum + item.quantity, 0);
  CART_ICON.textContent = `🛒 (${totalItems})`;
}

// English: Displays the cart modal
function displayCart() {
  const cartItems = document.getElementById('cart-items');
  const totalElement = document.getElementById('cart-total');
  cartItems.innerHTML = '';

  if (CART.length === 0) {
    cartItems.innerHTML = '<p>El carrito está vacío.</p>';
    totalElement.textContent = 'Total: $0.00';
  } else {
    CART.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      const subtotal = (item.price * item.quantity).toFixed(2);
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <p><strong>${item.name}</strong></p>
          <p>Precio unitario: $${item.price}</p>
          <div class="quantity-controls">
            <button onclick="changeQuantity(${index}, -1)" class="quantity-btn">-</button>
            <span class="quantity">${item.quantity}</span>
            <button onclick="changeQuantity(${index}, 1)" class="quantity-btn">+</button>
          </div>
          <p>Subtotal: $${subtotal}</p>
          <button onclick="removeFromCart(${index})" class="btn remove-btn">Eliminar</button>
        </div>
      `;
      cartItems.appendChild(itemDiv);
    });
    const total = CART.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    totalElement.textContent = `Total: $${total}`;
  }
  CART_MODAL.style.display = 'block';
}

// English: Changes the quantity of an item in the cart
function changeQuantity(index, delta) {
  CART[index].quantity += delta;
  if (CART[index].quantity <= 0) {
    CART.splice(index, 1);
  }
  updateCartIcon();
  displayCart();
}

// English: Removes an item from the cart
function removeFromCart(index) {
  CART.splice(index, 1);
  updateCartIcon();
  displayCart();
}

// English: Closes the cart modal
function closeCart() {
  CART_MODAL.style.display = 'none';
}

// English: Handles the buy action, transitioning to checkout
function buy() {
  closeCart();
  displayCheckout();
}

// English: Displays the checkout modal
function displayCheckout() {
  const checkoutItems = document.getElementById('checkout-items');
  const checkoutTotal = document.getElementById('checkout-total');
  checkoutItems.innerHTML = '';

  CART.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'checkout-item';
    const subtotal = (item.price * item.quantity).toFixed(2);
    itemDiv.innerHTML = `
      <p><strong>${item.name}</strong> - Cantidad: ${item.quantity} - Subtotal: $${subtotal}</p>
    `;
    checkoutItems.appendChild(itemDiv);
  });
  const total = CART.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  checkoutTotal.textContent = `Total final: $${total}`;
  CHECKOUT_MODAL.style.display = 'block';
}

// English: Closes the checkout modal and clears the cart
function closeCheckout() {
  CHECKOUT_MODAL.style.display = 'none';
  CART = [];
  updateCartIcon();
}

// ========================================
// THEME FUNCTIONS 
// ========================================

// English: Toggles between dark and light mode by adding/removing the 'light-mode' class on the body element
function toggleTheme() {
  // English: Get the body element and add a temporary class for animation
  const body = document.body;
  body.classList.add('theme-changing');

  // English: Toggle the 'light-mode' class to switch themes
  body.classList.toggle('light-mode');

  // English: Update the toggle button icon based on the current mode
  if (body.classList.contains('light-mode')) {
    THEME_TOGGLE.textContent = '☀️';
  } else {
    THEME_TOGGLE.textContent = '🌙';
  }

  // English: Remove the animation class after the transition completes
  setTimeout(() => {
    body.classList.remove('theme-changing');
  }, 300);
}
