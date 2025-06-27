document.addEventListener("DOMContentLoaded", function () {
  // === Move all modals to body tag ===
  document.querySelectorAll(".add-to-cart-modal-wrapper").forEach((modal) => {
    window.portal(modal); // Moves modal directly under <body>
  });

  document.querySelectorAll(".open-modal-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.productId;
      const modal = document.getElementById(`modal-${id}`);
      if (modal) {
        modal.style.display = "flex";
        window.whenDrawerOpen();
      }
    });
  });

  // Close modal buttons
  document.querySelectorAll(".close-modal-btn").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".add-to-cart-modal-wrapper").style.display = "none";
      window.whenDrawerClose();
    });
  });

  document.querySelectorAll(".add-to-cart-modal-wrapper").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.style.display = "none";
        window.whenDrawerClose();
      }
    });
  });

  // Quantity Logic
  document.querySelectorAll(".add-to-cart-modal-wrapper").forEach((modal) => {
    const qtyWrapper = modal.querySelector(".add-to-cart-qty-wrapper");
    const qtyDisplay = qtyWrapper.querySelector(".quantity-input");
    const minus = qtyWrapper.querySelector(".qty-btn.minus");
    const plus = qtyWrapper.querySelector(".qty-btn.plus");

    const min = parseInt(qtyWrapper.dataset.min) || 1;
    const max = parseInt(qtyWrapper.dataset.max) || 9999;

    // Set initial value
    let currentQty = parseInt(qtyDisplay.textContent) || 1;

    if (currentQty <= 1) {
      minus.classList.add("disable");
    }

    if (currentQty >= max) {
      plus.classList.add("disable");
    }

    const updateQuantity = (newQty) => {
      currentQty = newQty;
      qtyDisplay.textContent = currentQty;

      if (currentQty <= 1) {
        minus.classList.add("disable");
      } else {
        minus.classList.remove("disable");
      }

      if (currentQty >= max) {
        plus.classList.add("disable");
      } else {
        plus.classList.remove("disable");
      }

      // Also update hidden input for form
      modal.querySelector("input[name='quantity']").value = currentQty;
    };

    minus.addEventListener("click", () => {
      if (currentQty > min) {
        updateQuantity(currentQty - 1);
      }
    });

    plus.addEventListener("click", () => {
      if (currentQty < max) {
        updateQuantity(currentQty + 1);
      } else {
        console.log("You've reached the maximum stock available.");
      }
    });
  });

  // AJAX Add to Cart logic
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".add-to-cart-modal-wrapper");
      const variantId = this.dataset.variantId || modal?.dataset.variantId;

      if (!variantId) {
        alert("Missing product variant.");
        return;
      }

      const qty =
        parseInt(modal.querySelector(".quantity-input").textContent) || 1;

      button.innerHTML = "loading...";

      fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: variantId,
          quantity: qty,
        }),
      })
        .then(async (res) => await window.handleFetchResponse(res))
        .then(() => window.updateCartCount())
        .then(() => {
          button.innerHTML = "Add to cart";
          modal.style.display = "none";
          window.whenDrawerClose();
          const productTitle = modal.querySelector("#add-cart-product-title");
          window.showToast(`${productTitle.innerHTML} added in your cart`);
        })
        .catch((err) => {
          window.showToast(err, "error");
          console.error(err);
        });
    });
  });
});
