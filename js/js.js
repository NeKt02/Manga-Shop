document.addEventListener('DOMContentLoaded', () => {

    let products = []
    let cart = []


    async function fetchProducts() {
        const response = await fetch('products.json')
        const data = await response.json()
        products = data
        displayProducts(data)
    }
    
    function displayProducts(products) {
        productsGrid.innerHTML = '';

        products.forEach(product => {
            const card = document.createElement('product');
            productsGrid.innerHTML += 'card';
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

    function addToCart(productId) {
    
        const product = products.find(p => p.id === productId);
    
        if (!product) return;
        const cartItem = cart.find(item => item.product.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        console.log(cart);
    }
})

