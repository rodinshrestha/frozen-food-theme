// === UTILITY ===

// Rebuild the DOM after fetching updated cart HTML
const reBuildCartDrawer = (newCartElement) => {
  const cartDrawer = document.querySelector(".cart-drawer");
  if (!cartDrawer) return;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newCartElement;

  const newCartDrawer = tempDiv.querySelector("#cart-drawer");
  if (newCartDrawer) {
    cartDrawer.innerHTML = newCartDrawer.innerHTML;
    cartDrawer.classList.add("active");
    document.dispatchEvent(new Event("cartDrawerLoaded"));
  }
};

// Show/hide cart loading state
const toggleCartLoading = (isLoading) => {
  const loader = document.getElementById("cart-loader");
  const contentWrapper = document.getElementById("cart-content-wrapper");

  if (!loader || !contentWrapper) return;

  loader.classList.toggle("hidden", !isLoading);
  contentWrapper.style.display = isLoading ? "none" : "flex";
};

const deleteItemLoader = (isLoading) => {
  const deleteLoader = document.getElementById("cart-item-delete-overlay");
  const loader = document.getElementById("cart-loader");

  loader.classList.toggle("active", isLoading);
  deleteLoader.classList.toggle("active", isLoading);
};

// Fetch updated cart section and re-render
const fetchAndRenderCartDrawer = () => {
  return fetch("/?sections=cart-drawer")
    .then((res) => res.json())
    .then((data) => {
      reBuildCartDrawer(data["cart-drawer"]);
    })
    .catch((err) => console.error("Failed to update cart drawer:", err));
};

// === GLOBAL EVENT BINDINGS ===

// Remove cart item via event delegation
document.addEventListener("click", (e) => {
  const removeButton = e.target.closest(".remove-cart-item");
  if (!removeButton) return;

  const itemIndex = removeButton.getAttribute("data-line");
  if (!itemIndex) return;
  deleteItemLoader(true);
  fetch("/cart/change.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ line: parseInt(itemIndex), quantity: 0 }),
  })
    .then((res) => res.json())
    .then(() => {
      fetchAndRenderCartDrawer().finally(() => {
        window.updateCartCount();
        deleteItemLoader(false);
      });
    })
    .catch((err) => {
      alert("Error, view console for more information");
      console.log(err);
      deleteItemLoader(false);
    });
});

// Handle checkbox logic when cart drawer is loaded
document.addEventListener("cartDrawerLoaded", () => {
  const checkbox = document.getElementById("agreement-checkbox");
  const checkoutButton = document.querySelector(".checkout-button");
  const closeCart = document.getElementById("close-cart");

  if (closeCart) {
    closeCart.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      document.getElementById("cart-drawer").classList.remove("active");
      window.whenDrawerClose();
    });
  }

  if (!checkbox || !checkoutButton) return;

  // Only bind once
  if (!checkbox.dataset.bound) {
    checkbox.addEventListener("change", (e) => {
      checkoutButton.classList.toggle("disable", !e.target.checked);
    });
    checkbox.dataset.bound = "true";
  }

  if (!checkoutButton.dataset.bound) {
    checkoutButton.addEventListener("click", (e) => {
      if (!checkbox.checked) {
        e.preventDefault();
      }
    });
    checkoutButton.dataset.bound = "true";
  }
});

// Initial load bindings
document.addEventListener("DOMContentLoaded", () => {
  const cartDrawer = document.querySelector(".cart-drawer");
  const cartIcon = document.getElementById("cart-icon");

  if (!cartDrawer || !cartIcon) return;

  window.portal(cartDrawer);

  cartIcon.addEventListener("click", () => {
    const cartCookie = window.getCookie("cart");
    cartDrawer.classList.add("active");

    if (!cartCookie) return;

    toggleCartLoading(true);
    window.whenDrawerOpen();

    fetch(window.location.pathname + "?sections=cart-drawer")
      .then((res) => res.json())
      .then((data) => {
        reBuildCartDrawer(data["cart-drawer"]);
      })
      .catch((err) => console.error("Failed to load cart:", err))
      .finally(() => toggleCartLoading(false));
  });

  // 4. Close cart drawer on outside click
  document.addEventListener("click", (e) => {
    if (
      cartDrawer.classList.contains("active") &&
      !cartDrawer.contains(e.target) &&
      !e.target.closest("#cart-icon")
    ) {
      cartDrawer.classList.remove("active");
      window.whenDrawerClose();
    }
  });
});
