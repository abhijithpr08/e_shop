const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function fetchProductDetails() {
    try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();

        let container = document.getElementById("productDetails");
        container.innerHTML = `
            <div class="product-img">
                <img src="${data.thumbnail}" alt="${data.title}" />
            </div>
            <div class="product-info">
                <h2>${data.title}</h2>
                <p>${data.description}</p>
                <h3>Price: $${data.price}</h3>
                <p>Category: ${data.category}</p>
                <p>Rating: ⭐ ${data.rating}</p>
                <a href="../index.html" class="back-btn">← Back to Products</a>
            </div>
    `;
    } catch (error) {
        console.error("Error fetching product:", error);
    }
}

fetchProductDetails();
