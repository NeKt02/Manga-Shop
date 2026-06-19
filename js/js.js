
let products = [];
let cart = [];
let tags = [];
let selectedTags = [];

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

    const tagsContainer = document.querySelector('.tags');
    const productsGrid = document.getElementById('products-grid');
    const cartContainer = document.getElementById('cart-container'); // ДОДАНО: оголошення контейнера кошика (перевір свій ID в HTML)

    const searchInput = document.querySelector('.search');
    console.log('Знайдений інпут:', searchInput);

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const text = searchInput.value.toLowerCase(); // Що ввів юзер
           
            // Фільтруємо
            const filtered = products.filter(product => product.title.toLowerCase().includes(text));
            // Перемальовуємо сторінку новими даними!
            displayProducts(filtered);
            console.log('Search input:', text);
        });
    }

    fetchProducts();
    loadCart();

    async function fetchProducts() {
        const response = await fetch('products.json');
        const data = await response.json();
        products = data;
        displayProducts(products)

        productsGrid.querySelectorAll('.card').forEach(item => {
        const productId = item.querySelector('.id')
        item.querySelector('.card-img').addEventListener('click', () => {
            localStorage.setItem('lastClickedProductId', productId.textContent);
            window.location.href = 'card.html';
        })
    })
        products.forEach(product => {
            if (product.tags) {
                product.tags.forEach(tag => {
                    console.log('Перевіряємо тег:', tag);
                    if (!tags.includes(tag)) {
                        tags.push(tag);
                        console.log('Додано новий тег:', tag);
                    }
                });
            }
        });
        displayTags();
    }
    
    function displayProducts(products) {
        productsGrid.innerHTML = '';products.forEach(product => {
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
                        <path d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"></path>
                        <path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path>
                        <path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path>
                        <path d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74z"></path>
                    </svg>
                </button>
            </div>
            <p class="id" style="display:none;">${product.id}</p>
        </div>`;
    }

    function loadCart() {
        const savedCart = getJsonCookie('cart');
        if (savedCart != null) {
            cart = savedCart;
            console.log(cart);
            displayCart();
        }
    }

    function displayCart() {
        if (!cartContainer) return; // Захист від помилки, якщо контейнера немає на цій сторінці
        
        cartContainer.innerHTML = '';
    
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Ваш кошик порожній 🛒</p>';
            return;
        } else {
            cart.forEach((product) => {
                cartContainer.innerHTML += `
                  <div class="cart-item border-0 border-bottom rounded-0">
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

    function displayTags() {
    console.log('Унікальні теги:', tags);
    tagsContainer.innerHTML = '';
    
    tags.forEach(tag => {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-check form-check-inline'; // якщо використовуєш Bootstrap
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'tag-checkbox';
        checkbox.value = tag; // зберігаємо значення тегу в самому чекбоксі
        
        // Вішаємо подію: при зміні стану запускаємо фільтрацію
        checkbox.addEventListener('change', handleTagFilter);
        
        const label = document.createElement('label');
        label.textContent = ` ${tag}`;
        
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        tagsContainer.appendChild(wrapper);
    });
}

// Функція, яка спрацьовує при кожному кліку на будь-який чекбокс
function handleTagFilter() {
    // 1. Збираємо всі обрані теги
    const checkboxes = tagsContainer.querySelectorAll('.tag-checkbox');
    const selectedTags = [];
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedTags.push(checkbox.value);
        }
    });

    console.log('Обрані теги для фільтрації:', selectedTags);

    // 2. Якщо жодного тегу не обрано — показуємо всі товари
    if (selectedTags.length === 0) {
        displayProducts(products);
        return;
    }

    // 3. Фільтруємо товари: товар проходить, якщо у нього є ХОЧА Б ОДИН з обраних тегів
    const filteredProducts = products.filter(product => {
        if (!product.tags) return false; // якщо у товару взагалі немає тегів
        
        // Перевіряємо, чи є хоч один спільний елемент між обраними тегами і тегами товару
        return product.tags.some(tag => selectedTags.includes(tag));
    });

    // 4. Відображаємо відфільтровані товари на сторінці!
    displayProducts(filteredProducts);
}
    function getSelectedTags() {
        const checkboxes = tagsContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                selectedTags.push(tags[index]);
            }
        });
    }

    function filterByTag(tag) {
        const filtered = products.filter(product => product.tags?.includes(tag));
        displayProducts(filtered);
    }

    
    function redirectToCart() {
        const productId = productsGrid.querySelector('.card .id').textContent; // Припускаємо, що ID зберігається в прихованому елементі з класом "id"
        localStorage.setItem('selectedProductId', productId);
        window.location.href = 'card.html';
    }

    

});