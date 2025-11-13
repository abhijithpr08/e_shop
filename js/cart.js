function loadCart() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const container = document.getElementById("cartContainer");
      const itemCount = document.getElementById("itemCount");
      const priceAmount = document.getElementById("priceAmount");
      const totalAmount = document.getElementById("totalAmount");

      if (cart.length === 0) {
        container.innerHTML = `<div class="empty-cart">
          <img src="https://cdn-icons-png.flaticon.com/512/102/102661.png" alt="Empty Cart" />
          <h3>Your cart is empty!</h3>
          <a href="/index.html">Shop Now</a>
        </div>`;
        itemCount.textContent = "0";
        priceAmount.textContent = "₹0";
        totalAmount.textContent = "₹0";
        return;
      }

      let total = 0;
      let html = "";

      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
          <div class="cart-card">
            <img src="${item.thumbnail}" alt="${item.title}" class="cart-img" />
            <div class="cart-info">
              <h3>${item.title}</h3>
              <p>₹${item.price.toLocaleString("en-IN")}</p>
              <div class="qty-box">
                <button onclick="updateQty(${index}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateQty(${index}, 1)">+</button>
              </div>
              <button class="remove" onclick="removeItem(${index})">REMOVE</button>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
      itemCount.textContent = cart.length;
      priceAmount.textContent = `₹${total.toLocaleString("en-IN")}`;
      totalAmount.textContent = `₹${total.toLocaleString("en-IN")}`;
    }

    function updateQty(index, change) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart[index].quantity = Math.max(1, cart[index].quantity + change);
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    }

    function removeItem(index) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    }

    document.getElementById("placeOrder").addEventListener("click", () => {
      alert("🛒 Order placed successfully!");
      localStorage.removeItem("cart");
      loadCart();
    });

    loadCart();