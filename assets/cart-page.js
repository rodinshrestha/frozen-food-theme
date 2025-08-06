document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector(".cart-main-wrapper")) return;

  // Add Shopify.formatMoney if missing
  if (typeof Shopify === "undefined") {
    window.Shopify = {};
  }
  if (typeof Shopify.formatMoney !== "function") {
    Shopify.formatMoney = function (cents, format) {
      if (typeof cents == "string") {
        cents = cents.replace(".", "");
      }
      var value = "";
      var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
      function formatWithDelimiters(number, precision, thousands, decimal) {
        thousands = thousands || ",";
        decimal = decimal || ".";
        if (isNaN(number) || number == null) {
          return 0;
        }
        number = (number / 100.0).toFixed(precision);
        var parts = number.split(".");
        var dollars = parts[0].replace(
          /(\d)(?=(\d{3})+(?!\d))/g,
          "$1" + thousands,
        );
        var cents = parts[1] ? decimal + parts[1] : "";
        return dollars + cents;
      }
      switch (format || this.money_format) {
        case "${{amount}}":
          value = formatWithDelimiters(cents, 2);
          break;
        case "${{amount_no_decimals}}":
          value = formatWithDelimiters(cents, 0);
          break;
        case "${{amount_with_comma_separator}}":
          value = formatWithDelimiters(cents, 2, ".", ",");
          break;
        default:
          value = formatWithDelimiters(cents, 2);
          break;
      }
      return format.replace(placeholderRegex, value);
    };
  }

  // Debounce map per item key
  const quantityUpdateTimers = {};

  function setCartLoading(isLoading) {
    const wrapper = document.querySelector(".cart-main-wrapper");
    if (!wrapper) return;
    if (isLoading) {
      wrapper.classList.add("loading");
      wrapper.classList.remove("loading-done");
    } else {
      wrapper.classList.remove("loading");
      wrapper.classList.add("loading-done");
      setTimeout(() => {
        wrapper.classList.remove("loading-done");
      }, 300); // matches the transition duration
    }
  }

  function fetchAndRenderCartSection() {
    return fetch(
      window.location.pathname + "?sections=cart-main&v=" + Date.now(),
    )
      .then((res) => res.json())
      .then((data) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = data["cart-main"];
        const newSection = tempDiv.querySelector(".cart-main-wrapper");
        if (newSection) {
          document.querySelector(".cart-main-wrapper").replaceWith(newSection);
        }
        attachCartPageListeners();
        if (window.updateCartCount) window.updateCartCount();
      });
  }

  function updateCartItem(key, newQty) {
    setCartLoading(true);
    fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: key, quantity: newQty }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.description || "Cart update failed");
          });
        }
        return res.json();
      })
      .then(() => fetchAndRenderCartSection())
      .catch((err) => {
        alert(err.message || "Error updating cart. Please try again.");
        fetchAndRenderCartSection(); // Try to re-sync the DOM anyway
      })
      .finally(() => setCartLoading(false));
  }

  function attachCartPageListeners() {
    document
      .querySelectorAll(".cart-item, .cart-item-card")
      .forEach(function (itemElem) {
        const key = itemElem.dataset.key;
        const qtyInput = itemElem.querySelector(".cart-qty-input");
        const minusBtn = itemElem.querySelector(".cart-qty-minus");
        const plusBtn = itemElem.querySelector(".cart-qty-plus");
        const removeBtn = itemElem.querySelector(".cart-remove-btn");

        if (minusBtn) {
          minusBtn.addEventListener("click", function () {
            let qty = parseInt(qtyInput.value, 10);
            if (qty > 1) {
              qty--;
              qtyInput.value = qty;
              if (quantityUpdateTimers[key])
                clearTimeout(quantityUpdateTimers[key]);
              quantityUpdateTimers[key] = setTimeout(
                () => updateCartItem(key, qty),
                400,
              );
            }
          });
        }
        if (plusBtn) {
          plusBtn.addEventListener("click", function () {
            let qty = parseInt(qtyInput.value, 10);
            qty++;
            qtyInput.value = qty;
            if (quantityUpdateTimers[key])
              clearTimeout(quantityUpdateTimers[key]);
            quantityUpdateTimers[key] = setTimeout(
              () => updateCartItem(key, qty),
              400,
            );
          });
        }
        if (qtyInput) {
          qtyInput.addEventListener("change", function () {
            let qty = Math.max(1, parseInt(qtyInput.value, 10));
            qtyInput.value = qty;
            if (quantityUpdateTimers[key])
              clearTimeout(quantityUpdateTimers[key]);
            quantityUpdateTimers[key] = setTimeout(
              () => updateCartItem(key, qty),
              400,
            );
          });
        }
        if (removeBtn) {
          removeBtn.addEventListener("click", function () {
            updateCartItem(key, 0);
          });
        }
      });
  }

  // Initial attach
  attachCartPageListeners();

  const cartDrawerButton = document.querySelector(".add-to-cart-icon-group"); // Update the selector
  const cartDrawer = document.getElementById("cart-drawer");

  if (cartDrawerButton) {
    cartDrawerButton.addEventListener("click", function (event) {
      const currentPage = window.location.pathname;

      // Check if the user is on the cart page
      if (currentPage === "{{ routes.cart_url }}") {
        event.preventDefault(); // Prevent the default drawer opening behavior
        window.location.reload(); // Reload the cart page
      } else {
        // Open the cart drawer if the user is not on the cart page
        if (cartDrawer) {
          event.preventDefault(); // Prevent default behavior
          cartDrawer.classList.add("active"); // Add a class to open the drawer
        }
      }
    });
  }
});
