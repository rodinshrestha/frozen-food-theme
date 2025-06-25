document.addEventListener("DOMContentLoaded", function () {
  const cartDrawer = document.querySelector(".cart-drawer");
  window.portal(cartDrawer);

  document.getElementById("cart-icon").addEventListener("click", function () {
    document.getElementById("cart-drawer").classList.add("active");
    window.whenDrawerOpen();
  });

  document.getElementById("close-cart").addEventListener("click", function () {
    document.getElementById("cart-drawer").classList.remove("active");
    window.whenDrawerClose();
  });

  document.addEventListener("click", function (e) {
    const drawer = document.getElementById("cart-drawer");
    if (
      !drawer.contains(e.target) &&
      !e.target.closest("#cart-icon") &&
      drawer.classList.contains("active")
    ) {
      drawer.classList.remove("active");
      window.whenDrawerClose();
    }
  });
});
