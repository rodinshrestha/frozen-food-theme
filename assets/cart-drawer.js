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

//disable checkout button
const disableCheckoutBtn = (disable) => {
  const checkoutButton = document.getElementById("proceed-to-checkout");

  if (!checkoutButton) return;

  checkoutButton.classList.toggle("disable", disable);
  checkoutButton.addEventListener("click", (e) => {
    if (disable) {
      e.preventDefault();
    }
  });
};

// Disable all CTA buttons
const ShouldDisableAllCta = (isLoading) => {
  const itemRemoveBtn = document.querySelectorAll("#remove-cart-item");
  itemRemoveBtn.forEach((item) => {
    item.classList.toggle("disabled", isLoading);
  });
};

// Loader of each item in a cart
const itemLoader = (index, isLoading) => {
  const cartItem = document.querySelector(
    `.cart-item-details[data-line="${index}"]`,
  );

  if (!cartItem) return;

  const loader = cartItem.querySelector("#item-individual-loader");

  if (!loader) return;

  cartItem.style.opacity = isLoading ? "0.3" : "1";
  ShouldDisableAllCta(isLoading);
  disableCheckoutBtn(isLoading);
  loader.classList.toggle("active", isLoading);
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

// Remove cart item via event delegation
document.addEventListener("click", (e) => {
  const removeButton = e.target.closest(".remove-cart-item");
  if (!removeButton || removeButton.classList.contains("disabled")) {
    return;
  }

  const itemIndex = removeButton.getAttribute("data-line");
  if (!itemIndex) return;

  // Capture "before" positions of all items in a cart
  const cartItemListBefore = document.querySelectorAll(".cart-item-details");
  const positions = new Map();

  cartItemListBefore.forEach((item) => {
    const key = item.dataset.key;
    const rect = item.getBoundingClientRect();
    positions.set(key, rect);
  });

  itemLoader(itemIndex, true);
  fetch("/cart/change.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ line: parseInt(itemIndex), quantity: 0 }),
  })
    .then((res) => res.json())
    .then(() => {
      fetchAndRenderCartDrawer().finally(() => {
        window.updateCartCount();
        itemLoader(itemIndex, false);

        // Animate items from old position to new
        requestAnimationFrame(() => {
          const cartItemList = document.querySelectorAll(".cart-item-details");

          cartItemList.forEach((item) => {
            const key = item.dataset.key;
            const oldPos = positions.get(key);
            const newPos = item.getBoundingClientRect();

            if (oldPos) {
              const dy = oldPos.top - newPos.top;
              item.style.transform = `translateY(${dy}px)`;
              item.offsetHeight; // force reflow
              item.style.transition = "transform 0.3s ease";
              item.style.transform = "translateY(0)";
            }
          });

          // Clean up after animation
          setTimeout(() => {
            document.querySelectorAll(".cart-item-details").forEach((item) => {
              item.style.transition = "";
              item.style.transform = "";
            });
          }, 300);
        });
      });
    })
    .catch((err) => {
      alert("Error, view console for more information");
      console.log(err);
      itemLoader(itemIndex, false);
    });
});

// Handle checkbox logic when cart drawer is loaded
document.addEventListener("cartDrawerLoaded", () => {
  const checkbox = document.getElementById("agreement-checkbox");
  // const checkoutButton = document.querySelector(".checkout-button");
  const closeCart = document.getElementById("close-cart");

  if (closeCart) {
    closeCart.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      document.getElementById("cart-drawer").classList.remove("active");
      window.whenDrawerClose();
    });
  }

  if (!checkbox) return;

  // Only bind once
  if (!checkbox.dataset.bound) {
    checkbox.addEventListener("change", (e) => {
      // checkoutButton.classList.toggle("disable", !e.target.checked);
      disableCheckoutBtn(!e.target.checked);
    });
    checkbox.dataset.bound = "true";
  }

  // if (!checkoutButton.dataset.bound) {
  //   checkoutButton.addEventListener("click", (e) => {
  //     if (!checkbox.checked) {
  //       e.preventDefault();
  //     }
  //   });
  //   checkoutButton.dataset.bound = "true";
  // }
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
