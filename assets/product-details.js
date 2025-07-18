document.addEventListener("DOMContentLoaded", () => {
  const productDetails = document.getElementById("product-details");

  if (!productDetails) return;

  productVariationInit(productDetails);

  // Quantity functionality
  const initializeQuantityHandlers = () => {
    const qtyWrapper = productDetails.querySelector(".add-to-cart-qty-wrapper");
    if (!qtyWrapper) return;

    const qtyDisplay = qtyWrapper.querySelector(".quantity-input");
    const minusBtn = qtyWrapper.querySelector(".qty-btn.minus");
    const plusBtn = qtyWrapper.querySelector(".qty-btn.plus");

    if (!qtyDisplay || !minusBtn || !plusBtn) return;

    const updateQuantity = (newQty) => {
      const min = parseInt(qtyWrapper.dataset.min) || 1;
      const max = parseInt(qtyWrapper.dataset.max) || 9999;

      // Ensure quantity is within bounds
      newQty = Math.max(min, Math.min(max, newQty));

      qtyDisplay.textContent = newQty;

      // Update button states
      minusBtn.classList.toggle("disable", newQty <= min);
      plusBtn.classList.toggle("disable", newQty >= max);
    };

    // Initialize quantity
    const initialQty = parseInt(qtyDisplay.textContent) || 1;
    updateQuantity(initialQty);

    // Minus button click
    minusBtn.addEventListener("click", () => {
      const currentQty = parseInt(qtyDisplay.textContent) || 1;
      const min = parseInt(qtyWrapper.dataset.min) || 1;

      if (currentQty > min) {
        updateQuantity(currentQty - 1);
      }
    });

    // Plus button click
    plusBtn.addEventListener("click", () => {
      const currentQty = parseInt(qtyDisplay.textContent) || 1;
      const max = parseInt(qtyWrapper.dataset.max) || 9999;

      if (currentQty < max) {
        updateQuantity(currentQty + 1);
      } else {
        console.log("You've reached the maximum stock available.");
      }
    });
  };

  // Update max quantity based on selected variant
  const updateMaxQuantity = (variant) => {
    const qtyWrapper = productDetails.querySelector(".add-to-cart-qty-wrapper");
    if (!qtyWrapper) return;

    let maxQty = 9999; // Default max

    if (variant) {
      // Check if inventory is managed
      if (variant.inventory_management === "shopify") {
        maxQty = variant.inventory_quantity || 0;
      }

      // If variant is not available, set max to 0
      if (!variant.available) {
        maxQty = 0;
      }
    }

    console.log(
      "Setting max quantity to:",
      maxQty,
      "for variant:",
      variant?.id,
    );

    // Update the data-max attribute
    qtyWrapper.dataset.max = maxQty;

    // Update the quantity display if current quantity exceeds new max
    const qtyDisplay = qtyWrapper.querySelector(".quantity-input");
    const currentQty = parseInt(qtyDisplay.textContent) || 1;

    if (currentQty > maxQty && maxQty > 0) {
      qtyDisplay.textContent = maxQty;
    }

    // Update button states
    const minusBtn = qtyWrapper.querySelector(".qty-btn.minus");
    const plusBtn = qtyWrapper.querySelector(".qty-btn.plus");

    if (minusBtn && plusBtn) {
      const min = parseInt(qtyWrapper.dataset.min) || 1;
      const shouldDisableMinus = currentQty <= min;
      const shouldDisablePlus = currentQty >= maxQty;

      // minusBtn.classList.toggle("disable", shouldDisableMinus);
      // plusBtn.classList.toggle("disable", shouldDisablePlus);
    }
  };

  // Initialize quantity handlers
  initializeQuantityHandlers();

  // Update max quantity for initial variant - use first available variant if possible
  const variantData = JSON.parse(
    document.getElementById("product-variants-data").textContent,
  );

  // Find first available variant for initial setup
  const firstAvailableVariant =
    variantData.find((variant) => variant.available) || variantData[0];

  updateMaxQuantity(firstAvailableVariant);

  const addToCartBtn = productDetails.querySelector(".product-add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const variantId = addToCartBtn.dataset.variantId;

      if (!variantId) {
        alert("Please select a product variant.");
        return;
      }

      // Add loading state (optional)
      addToCartBtn.classList.add("loading");

      // Get quantity from the quantity input
      const quantity =
        parseInt(
          productDetails.querySelector(".quantity-input")?.textContent,
        ) || 1;

      fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: variantId, quantity }),
      })
        .then(async (res) => await window.handleFetchResponse(res))
        .then((res) => {
          window.updateCartCount();
          window.showToast(`${res.title} has been added in your cart`);
        })
        .catch((err) => {
          console.error(err);
          window.showToast(err.message, "error");
        })
        .finally(() => {
          addToCartBtn.classList.remove("loading");
        });
    });
  }
});
