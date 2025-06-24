document.getElementById("cart-icon").addEventListener("click", function () {
  document.getElementById("cart-drawer").classList.add("active");
});

document.getElementById("close-cart").addEventListener("click", function () {
  document.getElementById("cart-drawer").classList.remove("active");
});

document.addEventListener("click", function (e) {
  const drawer = document.getElementById("cart-drawer");
  if (!drawer.contains(e.target) && !e.target.closest("#cart-icon")) {
    drawer.classList.remove("active");
  }
});
