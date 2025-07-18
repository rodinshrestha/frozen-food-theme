document.addEventListener("DOMContentLoaded", function () {
  // === Move all modals to body tag ===
  document.querySelectorAll(".add-to-cart-modal-wrapper").forEach((modal) => {
    window.portal(modal); // Moves modal directly under <body>
  });

  //Disabling the click and link events for disabled btn
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("disabled")) {
      e.preventDefault();
      return;
    }
  });

  // Use event delegation for open modal buttons (works with dynamically added elements)
  document.addEventListener("click", (e) => {
    if (e.target.closest(".open-modal-btn")) {
      const button = e.target.closest(".open-modal-btn");
      const id = button.dataset.productId;
      const modal = document.getElementById(`modal-${id}`);
      if (modal) {
        const addToCartBtn = modal.querySelector(".add-to-cart-btn");

        if (addToCartBtn.classList.contains("disabled")) {
          addToCartBtn.innerHTML = "Out of Stock";
        }

        modal.style.display = "flex";
        window.whenDrawerOpen();
        imageGallery(modal);

        // Initialize product variations in the modal
        if (typeof productVariationInit === "function") {
          productVariationInit(modal);
        }
      }
    }
  });

  // Close modal on ESC key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModal = document.querySelector(
        ".add-to-cart-modal-wrapper[style*='display: flex']",
      );
      if (openModal) {
        openModal.style.display = "none";
        window.whenDrawerClose();
      }
    }
  });

  // Use event delegation for close modal buttons
  document.addEventListener("click", (e) => {
    if (e.target.closest(".close-modal-btn")) {
      const button = e.target.closest(".close-modal-btn");
      button.closest(".add-to-cart-modal-wrapper").style.display = "none";
      window.whenDrawerClose();
    }
  });

  // Use event delegation for click outside to close
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-modal-wrapper")) {
      e.target.style.display = "none";
      window.whenDrawerClose();
    }
  });

  // Use event delegation for quantity buttons
  document.addEventListener("click", (e) => {
    if (e.target.closest(".qty-btn")) {
      const button = e.target.closest(".qty-btn");
      const modal = button.closest(".add-to-cart-modal-wrapper");
      const qtyWrapper = modal.querySelector(".add-to-cart-qty-wrapper");
      const qtyDisplay = qtyWrapper.querySelector(".quantity-input");
      const minus = qtyWrapper.querySelector(".qty-btn.minus");
      const plus = qtyWrapper.querySelector(".qty-btn.plus");

      const min = parseInt(qtyWrapper.dataset.min) || 1;
      const max = parseInt(qtyWrapper.dataset.max) || 9999;
      let currentQty = parseInt(qtyDisplay.textContent) || 1;

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

        modal.querySelector("input[name='quantity']").value = currentQty;
      };

      if (button.classList.contains("minus") && currentQty > min) {
        updateQuantity(currentQty - 1);
      } else if (button.classList.contains("plus") && currentQty < max) {
        updateQuantity(currentQty + 1);
      } else if (button.classList.contains("plus") && currentQty >= max) {
        console.log("You've reached the maximum stock available.");
      }
    }
  });

  // Use event delegation for add to cart buttons
  document.addEventListener("click", (e) => {
    if (e.target.closest(".add-to-cart-btn")) {
      const button = e.target.closest(".add-to-cart-btn");
      const btnWrapper = button.closest(".cart-btn");
      const modal = button.closest(".add-to-cart-modal-wrapper");
      const variantId = button.dataset.variantId || modal?.dataset.variantId;

      if (!variantId) {
        alert("Missing product variant.");
        return;
      }
      btnWrapper.classList.add("loading");
      const qty =
        parseInt(modal.querySelector(".quantity-input").textContent) || 1;

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
          modal.style.display = "none";
          window.whenDrawerClose();
          const productTitle = modal.querySelector("#add-cart-product-title");
          window.showToast(`${productTitle.innerHTML} added in your cart`);
        })
        .catch((err) => {
          window.showToast(err, "error");
          console.error(err);
        })
        .finally(() => {
          btnWrapper.classList.remove("loading");
        });
    }
  });

  // Function to move new modals to body (called when new elements are added)
  function moveNewModalsToBody() {
    // Only target modals that are currently in the search results
    const searchResults = document.getElementById("search-product-list");
    if (searchResults) {
      const searchModals = searchResults.querySelectorAll(
        ".add-to-cart-modal-wrapper",
      );
      searchModals.forEach((modal) => {
        if (!modal.dataset.movedToBody) {
          window.portal(modal);
          modal.dataset.movedToBody = "true";
          // Mark this modal as being added from search drawer
          modal.dataset.searchDrawerModal = "true";
        }
      });
    }
  }

  // Listen for new product cards being added (from search drawer)
  document.addEventListener("newProductCardsAdded", function () {
    moveNewModalsToBody();
  });
});
