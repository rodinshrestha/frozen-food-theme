// Show/hide cart loading state
const toggleWishlistLoading = (isLoading) => {
  const loader = document.getElementById("wishlist-loader");
  const contentWrapper = document.getElementById("wishlist-content-wrapper");

  if (!loader || !contentWrapper) return;

  loader.classList.toggle("hidden", !isLoading);
  contentWrapper.style.display = isLoading ? "none" : "flex";
};

document.addEventListener("DOMContentLoaded", () => {
  const wishlistDrawer = document.getElementById("wishlist-drawer");
  const wishlistIcon = document.getElementById("wishlist-icon");

  if (!wishlistDrawer || !wishlistIcon) return;
  window.portal(wishlistDrawer);

  wishlistIcon.addEventListener("click", () => {
    // toggleWishlistLoading(true);
    window.whenDrawerOpen();
    wishlistDrawer.classList.add("active");

    // fetch(window.location.pathname + "?sections=cart-drawer")
    //   .then((res) => res.json())
    //   .then((data) => reBuildCartDrawer(data["cart-drawer"]))
    //   .catch((err) => console.error("Failed to load cart:", err))
    //   .finally(() => toggleWishlistLoading(false));
  });

  document.addEventListener("click", (e) => {
    if (
      wishlistDrawer.classList.contains("active") &&
      !wishlistDrawer.contains(e.target) &&
      !e.target.closest("#wishlist-icon")
    ) {
      wishlistDrawer.classList.remove("active");
      window.whenDrawerClose();
    }
  });
});
