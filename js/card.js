async function loadCartByID(productId) {
    const response = await fetch('products.json');
    const data = await response.json();
    products = data;
    const product = products.find(p => p.id === productId);
    return product
}


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

        <div class="price">${product.price}$</div>

        <button class="buy-btn">
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