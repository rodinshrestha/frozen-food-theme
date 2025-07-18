document.addEventListener("DOMContentLoaded", () => {
  const productDetails = document.getElementById("product-details");

  if (!productDetails) return;

  productVariationInit(productDetails);

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

      // Optional: Get quantity if you have a .quantity-input element
      const quantity =
        parseInt(productDetails.querySelector(".quantity-input")?.value) || 1;

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
