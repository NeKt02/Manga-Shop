// 1. Оголошуємо змінні в самому верху файлу (глобально для цього скрипта)
let products = [];
let cart = [];

// 2. Робимо addToCart глобальною СРАЗУ, не чекаючи завантаження HTML
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);

    if (!product) return;
    const cartItem = cart.find(item => item?.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    console.log(cart);
    saveJsonCookie('cart', cart, 3600 * 24 * 7);
    console.log('Product added to cart:', product.title);
};

// 3. Інші допоміжні функції теж виносимо з DOMContentLoaded
function getJsonCookie(cookieName) {
    const allCookies = document.cookie.split('; ');
    const targetCookie = allCookies.find(row => row.startsWith(cookieName + '='));
    if (targetCookie) {
        const encodedData = targetCookie.split('=')[1];
        return JSON.parse(decodeURIComponent(encodedData));
    }
    return null;
}

function saveJsonCookie(cookieName, data, seconds) {
    const jsonString = JSON.stringify(data);
    const safeString = encodeURIComponent(jsonString);
    document.cookie = `${cookieName}=${safeString}; max-age=${seconds}; path=/`;
}


document.addEventListener('DOMContentLoaded', () => {

    const productsGrid = document.getElementById('products-grid')

    const searchInput = document.querySelector('.search');
    console.log('Знайдений інпут:', searchInput);

    searchInput.addEventListener('input', function() {
        const text = searchInput.value.toLowerCase(); // Що ввів юзер
       
        // Фільтруємо
        const filtered = products.filter(product => product.title.toLowerCase().includes(text));
        // Перемальовуємо сторінку новими даними!
        displayProducts(filtered);
        console.log('Search input:', text);
      });

    
    fetchProducts()
    loadCart()


    
    async function fetchProducts() {
        const response = await fetch('products.json')
        const data = await response.json()
        products = data
        displayProducts(data)
    }
    
    function displayProducts(products) {
        productsGrid.innerHTML = '';

        products.forEach(product => {
            const card = createProductCard(product);
            productsGrid.innerHTML += card;
        });
    }
        
    function createProductCard(product) {
        return `<div class="card berserk-card">
            <div class="card-img">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="card-title">${product.title}</div>
            <div class="card-author">${product.author}</div>
            <div class="card-footer">
                <div class="card-price">${product.price} $</div>
                    <button onclick="addToCart(${product.id})" class="card-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path
                            d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z">
                        </path>
                        <path
                            d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z">
                        </path>
                        <path
                            d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z">
                        </path>
                        <path
                            d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74z">
                        </path>
                    </svg>
                </button>
            </div>
        </div>
        `
    }


    function loadCart() {
        const savedCart = getJsonCookie('cart');
        if (savedCart != null) {
            cart = savedCart;
            console.log(cart);
            displayCart()
        }
    }


    function displayCart() {
        // Очищаємо контейнер перед виведенням
        cartContainer.innerHTML = '';
    
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Ваш кошик порожній 🛒</p>';
            return; // Зупиняємо функцію, далі йти не треба
        }  else {
            cart.forEach((product) => {
                cartContainer.innerHTML += `
                  <div class="card border-0 border-bottom rounded-0">
                    <div class="card-body d-flex align-items-center gap-3 p-3">
                      <img src="img/${product.image}" height="80" >
                      <div class="flex-grow-1">
                          <h5 class="card-title mb-1">${product.title}</h5>
                          <p class="card-text text-muted mb-1">Кількість: ${product.quantity}</p>
                          <p class="card-text text-primary fw-bold mb-0">Ціна: ${product.price} грн</p>
                      </div>
                    </div>
                  </div>
                `;
              });
            }
            
        }


    
});