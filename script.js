const BASE_URL = 'https://crudcrud.com/api/0594573b8f6e48c1b8d33c6e2cd018e2/Product_Details';

const productNameInput = document.getElementById('productName');
const sellingPriceInput = document.getElementById('sellingPrice');
const categoryInput = document.getElementById('category');
const productList = document.getElementById('productList');

function createListItem(product) {
    const listItem = document.createElement('li');
    listItem.className="card";
    listItem.innerHTML = `${product.productName} - ${product.sellingPrice}Rupees <button class="delete-btn" data-id="${product._id}">Delete</button>`;
    return listItem;
}

async function fetchAndDisplayProducts() {
    try {
        const response = await axios.get(BASE_URL);
        const products = response.data;

        productList.innerHTML = '';

        const productsByCategory = {};
        products.forEach(product => {
            if (!productsByCategory[product.category]) {
                productsByCategory[product.category] = [];
            }
            productsByCategory[product.category].push(product);
        });

        Object.keys(productsByCategory).forEach(category => {
            const categoryHeading = document.createElement('h3');
            categoryHeading.textContent = category;
            productList.appendChild(categoryHeading);

            productsByCategory[category].forEach(product => {
                const listItem = createListItem(product);
                productList.appendChild(listItem);
            });
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function addProduct(event) {
    event.preventDefault();

    const productName = productNameInput.value;
    const sellingPrice = parseFloat(sellingPriceInput.value);
    const category = categoryInput.value;

    try {
        await axios.post(BASE_URL, {
            productName,
            sellingPrice,
            category
        });

        productNameInput.value = '';
        sellingPriceInput.value = '';

        fetchAndDisplayProducts();
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

productForm.addEventListener('submit', addProduct);

async function deleteProduct(productId) {
    try {
        await axios.delete(`${BASE_URL}/${productId}`);
        fetchAndDisplayProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

productList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const productId = event.target.getAttribute('data-id');
        deleteProduct(productId);
    }
});

fetchAndDisplayProducts();
