const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

async function fetchProducts() {
  try {
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();

    let str = ``
    data.products.forEach(product => {
      const originalPriceINR = product.price * 85;
      const discount = product.discountPercentage || 0;
      const discountedPrice = originalPriceINR - (originalPriceINR * discount) / 100;

      str += `
  <div class="card">
      <a href="./pages/product.html?id=${product.id}">
          <img src="${product.thumbnail}" alt="">
          <h3>${product.title}</h3>
          <p>Rating: ⭐ ${product.rating}</p>
          <div class="price-box">
              <span class="final-price">₹${discountedPrice.toLocaleString("en-IN")}</span>
              <span class="original-price">₹${originalPriceINR.toLocaleString("en-IN")}</span>
              <span class="discount">${discount}% off</span>
          </div>
      </a>
  </div>
`;


    });
    document.getElementById("cards").innerHTML = str;

  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

fetchProducts();