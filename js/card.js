document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');

    const clear = document.querySelector('.clear');

    clear.addEventListener('click', () => {
        cart = [];
        document.cookie = 'cart=; max-age=0; path=/';
        displayCart();
    })


    loadCart()

    function getJsonCookie(cookieName) {
        const allCookies = document.cookie.split('; ');
        const targetCookie = allCookies.find(row => row.startsWith(cookieName +
        '='));
        if (targetCookie) {
        const encodedData = targetCookie.split('=')[1];
        return JSON.parse(decodeURIComponent(encodedData));
        }
        return null;
        }

    function loadCart() {
        const savedCart = getJsonCookie('cart');
        console.log('Loaded cart from cookie:', savedCart);
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
                console.log(product.image)
                cartContainer.innerHTML += `
                  <div class="card border-0 border-bottom rounded-0">
                    <div class="card-body d-flex align-items-center gap-3 p-3">
                      <img src="${product.image}" height="80" >
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

        // Виводимо кожен товар у кошику

    function saveJsonCookie(cookieName, data, seconds) {
    const jsonString = JSON.stringify(data);
    const safeString = encodeURIComponent(jsonString);
    document.cookie = `${cookieName}=${safeString}; max-age=${seconds}; path=/`;
}
        
    checkoutForm = document.getElementById('orderForm');
        
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault()
        // Тут можна додати збереження даних замовлення (необов’язоко)
            alert('Дякуємо за замовлення!');
            
            cart = []; // Очищуємо кошик
            saveJsonCookie('cart', cart, 3600 * 24 * 7); // Оновлюємо Cookie     
           displayCart(); // Оновлюємо відображення кошика
            checkoutForm.reset();
        })
    });