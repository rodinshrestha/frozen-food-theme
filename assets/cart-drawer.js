// Debounce map per line item
const quantityUpdateTimers = {};

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
const fetchAndRenderCartDrawer = async () => {
  return fetch("/?sections=cart-drawer&v=" + Date.now())
    .then(async (res) => await window.handleFetchResponse(res))
    .then((data) => {
      reBuildCartDrawer(data["cart-drawer"]);
    })
    .catch((err) => {
      window.showToast(err, "error");
      console.error("Failed to update cart drawer:", err);
    });
};

// Quantity handler
document.addEventListener("click", (e) => {
  const decreaseQty = e.target.closest(".qty-btn.minus");
  const increaseQty = e.target.closest(".qty-btn.plus");

  if (!decreaseQty && !increaseQty) return;

  const btn = increaseQty || decreaseQty;

  const itemIndex = btn.getAttribute("data-line");

  const wrapper = btn.closest(".cart-item-details");
  const qtyWrapper = btn.closest(".add-to-cart-qty-wrapper");
  const line = parseInt(wrapper.dataset.line);
  const quantityDisplay = qtyWrapper.querySelector(".quantity-input");
  const min = parseInt(qtyWrapper.dataset.min || "1");
  const max = parseInt(qtyWrapper.dataset.max || "99");

  let currentQty = parseInt(quantityDisplay.textContent || "1");

  // Determine new quantity
  const newQty = decreaseQty
    ? Math.max(min, currentQty - 1)
    : Math.min(max, currentQty + 1);

  // If no change, do nothing
  if (newQty === currentQty) return;

  // Show the new quantity immediately (optional for UX)
  quantityDisplay.textContent = newQty;

  // Clear any existing debounce timer for this line
  if (quantityUpdateTimers[line]) {
    clearTimeout(quantityUpdateTimers[line]);
  }

  // Start a new debounce timer
  quantityUpdateTimers[line] = setTimeout(() => {
    itemLoader(line, true);
    disableCheckoutBtn(true);

    fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ line: line, quantity: newQty }),
    })
      .then(async (res) => await window.handleFetchResponse(res))
      .then(() => fetchAndRenderCartDrawer())
      .then(() => {
        window.updateCartCount();
        itemLoader(itemIndex, false);
      })
      .catch((err) => {
        // reseeting the quantity, If it cause any error
        fetchAndRenderCartDrawer().finally(() => {
          window.showToast(err, "error");
          itemLoader(itemIndex, false);
        });
      })
      .finally(() => {
        delete quantityUpdateTimers[line]; // Clean up
      });
  }, 400); // Adjust delay as needed (400ms is smooth)
});

// Delete cart item
document.addEventListener("click", (e) => {
  const removeButton = e.target.closest(".remove-cart-item");
  if (!removeButton || removeButton.classList.contains("disabled")) {
    return;
  }

  const itemIndex = removeButton.getAttribute("data-line");

  const itemKey = removeButton.getAttribute("data-key");

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
    body: JSON.stringify({ id: itemKey, quantity: 0 }),
  })
    .then(async (res) => await window.handleFetchResponse(res))
    .then(async () => {
      await fetch("/cart.js").then((res) => res.json());
      await fetchAndRenderCartDrawer();
    })
    .then(() => {
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
    })
    .catch((err) => {
      alert("Error, view console for more information");
      console.log(err);
      itemLoader(itemIndex, false);
    });
});

// Handle checkbox logic when cart drawer is loaded
document.addEventListener("cartDrawerLoaded", (e) => {
  const cartDrawer = document.getElementById("cart-drawer");
  const checkbox = document.getElementById("agreement-checkbox");
  const closeCart = document.getElementById("close-cart");
  const cartItemList = document.querySelectorAll(".cart-item-details");

  cartItemList.forEach((item) => {
    const qtyWrapper = item.querySelector(".add-to-cart-qty-wrapper");
    const qtyDisplay = qtyWrapper.querySelector(".quantity-input");
    const minus = qtyWrapper.querySelector(".qty-btn.minus");
    const plus = qtyWrapper.querySelector(".qty-btn.plus");

    const maxQty = parseInt(qtyWrapper.dataset.max) || 9999;

    // Set initial value
    let currentQty = parseInt(qtyDisplay.textContent) || 1;

    if (currentQty <= 1) {
      minus.classList.add("disable");
    }

    if (currentQty >= maxQty) {
      plus.classList.add("disable");
    }
  });

  closeCart.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    cartDrawer.classList.remove("active");
    window.whenDrawerClose();
  });

  // Only bind once
  if (!checkbox.dataset.bound) {
    checkbox.addEventListener("change", (e) => {
      disableCheckoutBtn(!e.target.checked);
    });
    checkbox.dataset.bound = "true";
  }
});

// Initial load bindings
document.addEventListener("DOMContentLoaded", () => {
  const cartDrawer = document.querySelector(".cart-drawer");
  const cartIcon = document.getElementById("cart-icon");
  const closeCart = document.getElementById("close-cart");

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

  // Close drawer with Esc key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartDrawer.classList.contains("active")) {
      cartDrawer.classList.remove("active");
      window.whenDrawerClose();
    }
  });

  // Close cart
  closeCart.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    cartDrawer.classList.remove("active");
    window.whenDrawerClose();
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
