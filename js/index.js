document.addEventListener("DOMContentLoaded", () => {
  const cardsElem = document.getElementById("cards");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const suggestionBox = document.getElementById("suggestion-box");
  const menuToggle = document.getElementById("menu-toggle");
  const navRight = document.getElementById("nav-right");
  const categoriesElem = document.getElementById("categories");

  // ✅ Fetch and Display All Categories
  async function fetchCategories() {
    try {
      const res = await fetch("https://dummyjson.com/products/categories");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const categories = await res.json();
      displayCategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      categoriesElem.innerHTML = `<p style="padding:10px;">Failed to load categories.</p>`;
    }
  }

  fetchCategories();

  // ✅ Display Categories
  function displayCategories(categories) {
    let html = `<h3>Categories</h3><ul class="category-list">`;
    categories.forEach((cat) => {
      html += `
        <li class="category-item" data-category="${cat.slug || cat}">
          ${cat.name || cat}
        </li>`;
    });
    html += `</ul>`;
    categoriesElem.innerHTML = html;

    // ✅ Add click event to filter products by category
    document.querySelectorAll(".category-item").forEach((item) => {
      item.addEventListener("click", async (e) => {
        const category = e.target.dataset.category;
        const res = await fetch(`https://dummyjson.com/products/category/${category}`);
        const data = await res.json();
        displayProducts(data.products);
      });
    });
  }

  // ✅ Menu Toggle for Mobile
  menuToggle.addEventListener("click", () => {
    navRight.classList.toggle("open");
  });

  // ✅ Fetch Products and Store in LocalStorage
  async function fetchProducts() {
    try {
      let data = JSON.parse(localStorage.getItem("productsData"));
      if (!data) {
        const res = await fetch("https://dummyjson.com/products?limit=100");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
        localStorage.setItem("productsData", JSON.stringify(data));
      }
      displayProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      cardsElem.innerHTML = `<p style="padding:20px;">Failed to load products. Try again later.</p>`;
    }
  }

  // ✅ Display Products on the Page
  function displayProducts(products) {
    let str = "";
    products.forEach((product) => {
      const originalPriceINR = product.price * 85;
      const discount = product.discountPercentage || 0;
      const discountedPrice = Math.round(
        originalPriceINR - (originalPriceINR * discount) / 100
      );

      str += `
        <div class="card">
          <a href="./pages/product.html?id=${product.id}">
            <div class="img">
              <img src="${product.thumbnail}" alt="${product.title}" />
            </div>
            <h3>${product.title}</h3>
            <p class="rating">
              <span class="material-symbols-outlined star-icon">star</span>
              ${product.rating.toFixed(1)}
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
  }

  // ✅ Search Suggestions
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    const storedData = JSON.parse(localStorage.getItem("productsData"));
    if (!storedData || !query) {
      suggestionBox.style.display = "none";
      return;
    }

    const matches = storedData.products.filter((p) =>
      p.title.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      suggestionBox.innerHTML = `<div class="no-result">No results found</div>`;
      suggestionBox.style.display = "block";
      return;
    }

    suggestionBox.innerHTML = matches
      .slice(0, 7)
      .map(
        (p) => `
        <div class="suggestion-item" onclick="window.location='./pages/product.html?id=${p.id}'">
          <img src="${p.thumbnail}" alt="${p.title}">
          <div class="info">
            <h4>${p.title}</h4>
            <p>${p.category}</p>
          </div>
        </div>`
      )
      .join("");

    suggestionBox.style.display = "block";
  });

  // ✅ Hide suggestion box when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-bar")) {
      suggestionBox.style.display = "none";
    }
  });

  // ✅ Manual Search Button
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase().trim();
    const storedData = JSON.parse(localStorage.getItem("productsData"));
    if (!storedData) return;

    const filtered = storedData.products.filter((p) =>
      p.title.toLowerCase().includes(query)
    );

    displayProducts(filtered);
    suggestionBox.style.display = "none";
  });

  // ✅ Initialize
  fetchProducts();
});
