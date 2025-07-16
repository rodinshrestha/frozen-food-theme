async function renderProductCard(handle) {
  return fetch(`/products/${handle}?view=card`)
    .then((res) => res.text())
    .then((html) => {
      const container = document.createElement("div");
      container.innerHTML = html;
      return container;
    });
}

// Function to trigger modal initialization for newly added elements
function initializeModalsForSearchResults() {
  // Trigger a custom event that the add-to-cart-modal.js can listen for
  const event = new CustomEvent("newProductCardsAdded");
  document.dispatchEvent(event);
}

document.addEventListener("DOMContentLoaded", () => {
  const searchDrawer = document.getElementById("search-drawer");
  const searchDrawerIcon = document.getElementById("search-drawer-icon");
  const searchInputField = document.getElementById("search-field-input");
  const searchResults = document.getElementById("search-product-list");
  const searchLoader = document.getElementById("search-loader");
  const totalProductCount = searchDrawer.querySelector(
    "#searched-product-total-count",
  );

  const whenSearchDrawerClose = () => {
    searchDrawer.classList.remove("active");
    window.whenDrawerClose(false);
    searchDrawerIcon.src = searchIconUrl;

    searchDrawer.style.height = 0;

    // Clear search results and remove dynamically added modals
    searchResults.innerHTML = "";
    clearDynamicModals();
  };

  const toggleLoading = (isLoading) => {
    searchLoader.classList.toggle("active", isLoading);
  };

  let debounceTimeout;

  if (!searchDrawer || !searchDrawerIcon) return;
  window.portal(searchDrawer);

  const searchIconUrl = searchDrawerIcon.dataset.searchIcon; // Add this to HTML too
  const closeIconUrl = searchDrawerIcon.dataset.closeIcon;

  //Open the search drawer
  searchDrawerIcon.addEventListener("click", () => {
    const isActive = searchDrawer.classList.contains("active");

    if (!isActive) {
      let top = 0;
      window.whenDrawerOpen(false);
      const promotionalBanner = document.getElementById("promotional-banner");
      const header = document.getElementById("header");

      const isStickyInHeader = header.classList.contains("sticky");

      if (promotionalBanner && !isStickyInHeader) {
        top += promotionalBanner.offsetHeight;
      }

      if (header) {
        top += header.offsetHeight;
      }

      searchDrawer.style.top = `${top}px`;
      searchDrawer.style.height = `calc(100% - ${top}px)`;

      searchDrawerIcon.src = closeIconUrl;
      searchDrawerIcon.width = "26";
      searchDrawerIcon.height = "26";
      searchResults.innerHTML = "";
      searchInputField.value = "";
      totalProductCount.innerHTML = "";
      searchInputField.focus();
      searchDrawer.classList.add("active");
    } else {
      //close
      totalProductCount.innerHTML = "";
      whenSearchDrawerClose();
    }
  });

  // Close drawer on Esc key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchDrawer.classList.contains("active")) {
      whenSearchDrawerClose();
    }
  });

  searchInputField.addEventListener("input", () => {
    toggleLoading(true);
    clearTimeout(debounceTimeout);
    searchResults.innerHTML = "";
    totalProductCount.innerHTML = "";

    debounceTimeout = setTimeout(() => {
      const query = searchInputField.value.trim();

      if (query.length < 1) {
        searchInputField.innerHTML = "";
        toggleLoading(false);
        return;
      }

      fetch(
        `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product`,
      )
        .then(async (res) => await window.handleFetchResponse(res))
        .then((data) => {
          const products = data.resources.results.products;

          if (products.length === 0) {
            toggleLoading(false);
            searchResults.innerHTML =
              "<p class='no-product-found'>No product found.</p>";
            return;
          }

          products.forEach((product) => {
            renderProductCard(product.handle).then((card) => {
              searchResults.appendChild(card.firstElementChild);
              // Initialize modal functionality for the newly added product card
              initializeModalsForSearchResults();
            });
          });

          setTimeout(() => {
            totalProductCount.innerHTML = `SHOWING ${products.length}  /  ${products.length}`;
          }, 500);
          toggleLoading(false);
        })
        .catch((err) => {
          console.error("Search failed:", err);
          window.showToast(err, "error");
          searchResults.innerHTML = "<p>Error loading search results.</p>";
          toggleLoading(false);
        });
    }, 300); // debounce delay in ms
  });

  // Function to clear dynamically added modals
  const clearDynamicModals = () => {
    // Remove only modals that were added during this search session
    document.querySelectorAll(".add-to-cart-modal-wrapper").forEach((modal) => {
      if (modal.dataset.searchDrawerModal) {
        modal.remove();
      }
    });
  };
});
