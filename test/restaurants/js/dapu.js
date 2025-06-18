let cart = [];
let total = 0;
let currentItem = null;
let menuData = null;

// Load menu data
fetch('../json/dapu.json')
    .then(response => response.json())
    .then(data => {
        menuData = data;
        initializeMenu();
        initializeCustomizationOptions();
    })
    .catch(error => console.error('Error loading menu data:', error));

function initializeMenu() {
    const menuContainer = document.getElementById('menuItems');
    menuData.menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            </div>
            <span class="item-price">NT$ ${item.price}</span>
            <button class="add-to-cart" onclick="${item.isCombo ? 
                `showCustomizationModal('${item.name}', ${item.price})` : 
                `addToCart('${item.name}', ${item.price})`}">➕</button>
        `;
        menuContainer.appendChild(menuItem);
    });
}

function initializeCustomizationOptions() {
    const optionsContainer = document.getElementById('customizationOptions');
    Object.entries(menuData.customizationOptions).forEach(([key, options]) => {
        const optionGroup = document.createElement('div');
        optionGroup.className = 'option-group';
        optionGroup.innerHTML = `
            <h4>${key.replace(/([A-Z])/g, ' $1').trim()}</h4>
            <div class="option-buttons" id="${key}">
                ${options.map(option => `
                    <button class="option-btn" onclick="selectOption(this, '${key}')">${option}</button>
                `).join('')}
            </div>
        `;
        optionsContainer.appendChild(optionGroup);
    });
}

function showCustomizationModal(name, price) {
    currentItem = { name, price };
    document.getElementById('customizationModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('customizationModal').style.display = 'none';
    currentItem = null;
}

function selectOption(button, groupId) {
    const group = document.getElementById(groupId);
    const buttons = group.getElementsByClassName('option-btn');
    for (let btn of buttons) {
        btn.classList.remove('selected');
    }
    button.classList.add('selected');
}

function confirmCustomization() {
    if (!currentItem) return;

    const options = {};
    Object.keys(menuData.customizationOptions).forEach(key => {
        options[key] = document.querySelector(`#${key} .selected`)?.textContent || 
            menuData.customizationOptions[key][0];
    });

    const customizedName = `${currentItem.name} (${options.spiceLevel}, ${options.vegetableChoice}, ${options.firstDishChoice}, ${options.secondDishChoice}, ${options.thirdDishChoice})`;
    addToCart(customizedName, currentItem.price);
    closeModal();
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>NT$ ${item.price} x ${item.quantity}</p>
            </div>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    document.getElementById('total').textContent = total;
}

function updateQuantity(name, newQuantity) {
    if (newQuantity <= 0) {
        cart = cart.filter(item => item.name !== name);
    } else {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert('Your order is empty!');
        return;
    }

    let orderCount = 1;
    // English Order Summary
    let englishSummary = '';
    cart.forEach(item => {
        englishSummary += `<div class="order-summary-item"> ${orderCount}. ${item.name} <br> x ${item.quantity} = NT$ ${item.price * item.quantity}</div>`;
        orderCount++;
    });
    document.getElementById('englishSummary').innerHTML = englishSummary;
    document.getElementById('englishTotal').innerHTML = `Total: NT$ ${total}`;

    // Chinese Order Summary
    let chineseSummary = '';
    orderCount = 1;
    cart.forEach(item => {
        let chineseItem = item.name;
        Object.entries(menuData.translations).forEach(([eng, chn]) => {
            chineseItem = chineseItem.replace(eng, chn);
        });
        
        chineseSummary += `<div class="order-summary-item"> ${orderCount}. ${chineseItem} <br> x ${item.quantity} = NT$ ${item.price * item.quantity}</div>`;
        orderCount++;
    });
    document.getElementById('chineseSummary').innerHTML = chineseSummary;
    document.getElementById('chineseTotal').innerHTML = `總計：NT$ ${total}`;

    // Show the modal
    document.getElementById('orderSummaryModal').style.display = 'block';
}

function closeOrderSummary() {
    document.getElementById('orderSummaryModal').style.display = 'none';
    cart = [];
    updateCart();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('orderSummaryModal');
    if (event.target == modal) {
        closeOrderSummary();
    }
} 