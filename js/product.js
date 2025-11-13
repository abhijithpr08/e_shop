const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function fetchProductDetails() {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    const data = await res.json();

    let thumbnails = "";
    data.images.forEach((img) => {
      thumbnails += `<img src="${img}" alt="${data.title}" class="thumb" />`;
    });

    let reviewsHTML = "";
    if (data.reviews && data.reviews.length > 0) {
      data.reviews.forEach((r) => {
        reviewsHTML += `
          <div class="review">
            <p><strong>${r.reviewerName}</strong> ⭐ ${r.rating}</p>
            <p>${r.comment}</p>
            <small><b>Email:</b> ${r.reviewerEmail}</small><br>
            <small><b>Date:</b> ${new Date(r.date).toLocaleDateString()}</small>
          </div>
        `;
      });
    } else {
      reviewsHTML = `<p>No reviews yet 😔</p>`;
    }

    const originalPriceINR = data.price * 85;
    const discount = data.discountPercentage || 0;
    const discountedPrice =
      originalPriceINR - (originalPriceINR * discount) / 100;

    const returnPolicy = data.returnPolicy || "7-day replacement policy";
    const warrantyInformation =
      data.warrantyInformation || "1-year manufacturer warranty";
    const shippingInformation =
      data.shippingInformation ||
      "Free delivery within 5-7 business days";
    const availabilityStatus =
      data.availabilityStatus || (data.stock > 0 ? "In Stock" : "Out of Stock");

    document.getElementById("productDetails").innerHTML = `
      <div class="product-page">
        <div class="left-side">
          <div class="gallery">
            <div class="thumbnail-list">${thumbnails}</div>
            <div class="main-image">
              <img id="mainImg" src="${data.thumbnail}" alt="${data.title}" />
            </div>
          </div>
          <div class="buttons">
            <button id="addToCart" class="add">🛒 ADD TO CART</button>
            <button class="buy">BUY NOW</button>
          </div>
        </div>

        <div class="product-info">
          <h1>${data.title}</h1>
          <p class="desc">${data.description}</p>

          <div class="price-box">
            <h2 class="final-price">₹${discountedPrice.toLocaleString("en-IN")}</h2>
            <span class="original-price">₹${originalPriceINR.toLocaleString("en-IN")}</span>
            <span class="discount">${discount}% off</span>
          </div>

          <p><strong>Brand:</strong> ${data.brand || "N/A"}</p>
          <p><strong>Category:</strong> ${data.category}</p>
          <p><strong>Availability:</strong> ${availabilityStatus}</p>
          <p><strong>Stock:</strong> ${data.stock}</p>
          <p><strong>Rating:</strong> ⭐ ${data.rating}</p>
          <p><strong>Return Policy:</strong> ${returnPolicy}</p>
          <p><strong>Warranty:</strong> ${warrantyInformation}</p>
          <p><strong>Shipping Info:</strong> ${shippingInformation}</p>

          <div class="reviews-section">
            <h3>Customer Reviews</h3>
            ${reviewsHTML}
          </div>
        </div>
      </div>
    `;

    // Image hover switch
    const mainImg = document.getElementById("mainImg");
    document.querySelectorAll(".thumb").forEach((img) => {
      img.addEventListener("mouseenter", () => {
        mainImg.src = img.src;
      });
    });

    // ADD TO CART functionality
    const addToCartBtn = document.getElementById("addToCart");

    // Check if this item already exists in cart
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const isInCart = cart.some((item) => item.id === data.id);

    if (isInCart) {
      addToCartBtn.textContent = "🛍️ GO TO CART";
      addToCartBtn.style.background = "#2874f0";
    }

    addToCartBtn.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const exists = cart.find((item) => item.id === data.id);
      if (!exists) {
        cart.push({
          id: data.id,
          title: data.title,
          price: discountedPrice,
          thumbnail: data.thumbnail,
          quantity: 1,
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        addToCartBtn.textContent = "🛍️ GO TO CART";
        addToCartBtn.style.background = "#2874f0";
      } else {
        // Redirect to cart page
        window.location.href = "/pages/cart.html";
      }
    });

  } catch (err) {
    console.error("Error fetching product:", err);
  }
}

fetchProductDetails();
