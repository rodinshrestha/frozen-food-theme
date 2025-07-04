document.addEventListener("DOMContentLoaded", function () {
  const singleProductWrapper = document.getElementById("product-show-case");

  if (!singleProductWrapper) return;

  const handleLoadingBtn = (e, isLoading) => {
    if (!e) return;
    const addToCartBtn = e.target.closest(".single-product-add-to-cart-btn");
    const btnGroup = e.target.closest(".show-case-product-cta-wrapper");

    addToCartBtn.innerHTML = isLoading ? "Loading..." : "Add to cart";
    addToCartBtn.disabled = isLoading ? true : false;

    addToCartBtn.classList.toggle("disable", isLoading);
    btnGroup.classList.toggle("disable", isLoading);
  };

  const resetQuantity = () => {
    const qtyWrapper = singleProductWrapper.querySelector(
      ".add-to-cart-qty-wrapper",
    );

    if (!qtyWrapper) return;
    const qtyDisplay = qtyWrapper.querySelector(".quantity-input");

    // Reset to 1
    qtyDisplay.textContent = "1";
    qtyWrapper.dataset.currentQty = "1";
  };

  singleProductWrapper.addEventListener("click", (e) => {
    // Handle quantity buttons
    if (e.target.closest(".qty-btn")) {
      const button = e.target.closest(".qty-btn");
      const qtyWrapper = button.closest(".add-to-cart-qty-wrapper");
      const qtyDisplay = qtyWrapper.querySelector(".quantity-input");
      const minus = qtyWrapper.querySelector(".qty-btn.minus");
      const plus = qtyWrapper.querySelector(".qty-btn.plus");

      const min = parseInt(qtyWrapper.dataset.min) || 1;
      const max = parseInt(qtyWrapper.dataset.max) || 9999;
      let currentQty = parseInt(qtyDisplay.textContent) || 1;

      const updateQuantity = (newQty) => {
        currentQty = newQty;
        qtyDisplay.textContent = currentQty;

        // Update minus button state
        if (currentQty <= min) {
          minus.classList.add("disable");
        } else {
          minus.classList.remove("disable");
        }

        // Update plus button state
        if (currentQty >= max) {
          plus.classList.add("disable");
        } else {
          plus.classList.remove("disable");
        }

        // Update any hidden input fields for form submission
        const hiddenInput = qtyWrapper.querySelector("input[name='quantity']");
        if (hiddenInput) {
          hiddenInput.value = currentQty;
        }

        // Update data attribute for easy access
        qtyWrapper.dataset.currentQty = currentQty;
      };

      if (button.classList.contains("minus") && currentQty > min) {
        updateQuantity(currentQty - 1);
      } else if (button.classList.contains("plus") && currentQty < max) {
        updateQuantity(currentQty + 1);
      } else if (button.classList.contains("plus") && currentQty >= max) {
        console.log("You've reached the maximum stock available.");
      }
    }

    // Handle add to cart button
    if (e.target.closest(".single-product-add-to-cart-btn")) {
      e.preventDefault();
      const addToCartBtn = e.target.closest(".single-product-add-to-cart-btn");
      const qtyWrapper = singleProductWrapper.querySelector(
        ".add-to-cart-qty-wrapper",
      );
      const variantId = addToCartBtn.dataset.variantId;

      // Get current quantity
      const currentQty =
        parseInt(qtyWrapper.dataset.currentQty) ||
        parseInt(qtyWrapper.querySelector(".quantity-input").textContent) ||
        1;

      handleLoadingBtn(e, true);

      // Add to cart using Shopify AJAX API
      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parseInt(variantId),
          quantity: currentQty,
        }),
      })
        .then(async (res) => await window.handleFetchResponse(res))
        .then(() => window.updateCartCount())
        .then(() => {
          const productTitle = singleProductWrapper.querySelector(
            ".show-case-product-title",
          );
          window.showToast(`${productTitle.innerHTML} added in your cart`);
        })
        .then(() => resetQuantity())
        .catch((err) => {
          window.showToast(err, "error");

          console.error(err);
        })
        .finally(() => {
          addToCartBtn.disabled = false;
          handleLoadingBtn(e, false);
        });
    }
  });
});
