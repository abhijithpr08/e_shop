document.addEventListener("DOMContentLoaded", () => {
  // --- Product fetching ---
  async function fetchProducts() {
    const cardsElem = document.getElementById("cards");
    if (!cardsElem) return console.error("No #cards found.");

    try {
      const res = await fetch("https://dummyjson.com/products");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      let str = "";
      data.products.forEach((product) => {
        const originalPriceINR = product.price * 85;
        const discount = product.discountPercentage || 0;
        const discountedPrice = Math.round(
          originalPriceINR - (originalPriceINR * discount) / 100
        );

        const safeTitle = (product.title || "").replaceAll('"', "&quot;");
        const rating = product.rating.toFixed(1);

        str += `
          <div class="card">
            <a href="./pages/product.html?id=${product.id}">
              <div class="img">
                <img src="${product.thumbnail}" alt="${safeTitle}">
              </div>
              <h3>${product.title}</h3>
              <p class="rating">
                <span class="material-symbols-outlined star-icon">star</span>
                ${rating}
              </p>
              <div class="price-box">
                <span class="final-price">₹${discountedPrice.toLocaleString("en-IN")}</span>
                <span class="original-price">₹${originalPriceINR.toLocaleString("en-IN")}</span>
                <span class="discount">${discount}% off</span>
              </div>
            </a>
          </div>`;
      });

      cardsElem.innerHTML = str;
    } catch (error) {
      console.error("Error fetching products:", error);
      cardsElem.innerHTML = `<p style="padding:20px;">Failed to load products. Try again later.</p>`;
    }
  }

  fetchProducts();
});
