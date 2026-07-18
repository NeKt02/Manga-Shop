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
        } else {

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

    const TELEGRAM_TOKEN = '8008682838:AAF_kcwwazgZVBV14_JWGLNLZchl2sivI_E';
    const TELEGRAM_CHAT_ID = '1527831232';

    const checkoutForm = document.getElementById('orderForm');

    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Отменяем перезагрузку страницы

        // 1. Собираем данные покупателя из формы
        const name = document.getElementById('clientName')?.value || 'Не указано';
        const phone = document.getElementById('clientPhone')?.value || 'Не указано';

        // 2. Формируем максимально простой текст БЕЗ спецсимволов
        let totalPrice = 0;

        let messageText = `🛒 НОВЫЙ ЗАКАЗ

👤 Покупатель: ${name}
📞 Телефон: ${phone}

📚 Товары:
`;

        cart.forEach(product => {
            const quantity = Number(product.quantity) || 1;
            const price = Number(product.price) || 0;

            totalPrice += quantity * price;

            messageText += `• ${product.title}
${quantity} × ${price} грн

`;
        });

        messageText += `💰 Итого: ${totalPrice} грн`;

        // 3. Отправляем fetch-запрос в Telegram (АДРЕС ИСПРАВЛЕН!)
        fetch('https://api.telegram.org/bot8008682838:AAF_kcwwazgZVBV14_JWGLNLZchl2sivI_E/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: messageText
            })
        })
            .then(response => {
                if (response.ok) {
                    alert('Дякуємо за замовлення! Менеджер зв\'яжется с вами.');

                    // Очищаем корзину после успешной отправки
                    cart = [];
                    saveJsonCookie('cart', cart, 3600 * 24 * 7);
                    displayCart();
                    checkoutForm.reset();
                } else {
                    alert('Помилка отправки замовлення в Telegram. Спробуйте ще раз.');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Сталася помилка при з\'єднанні.');
            });
    });
});
