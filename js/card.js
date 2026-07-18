async function loadCartByID(productId) {
    const response = await fetch('products.json');
    const data = await response.json();
    products = data;
    const product = products.find(p => p.id === productId);
    return product
}

let cart = [];
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

    function loadCart() {
        const savedCart = getJsonCookie('cart');
        if (savedCart != null) {
            cart = savedCart;
            console.log(cart);
        }
    }

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

document.addEventListener('DOMContentLoaded', async () => {
    const savedId = +localStorage.getItem('lastClickedProductId');


    if (savedId) {

        function displayProductDetails(product) {
            const productContainer = document.querySelector(".card");
            productContainer.innerHTML = `
<div class="product-page">
            <a href="index.html" class="back-link">← Назад</a>
    <div class="product-image">
        <img src="${product.image}" alt="${product.title}">
    </div>

    <div class="product-info">

        <h1>${product.title}</h1>

        <p class="author">${product.author}</p>

        <div class="price">${product.price} грн</div>

        <button class="buy-btn" onclick="addToCart(${product.id})">
            🛒 Купить
        </button>

        <div class="line"></div>

        <h2>Описание</h2>

        <p class="description">
            ${product.description}
        </p>

    </div>

</div>
`;
        }

        displayProductDetails(await loadCartByID(savedId));
    }
    

    
   
});