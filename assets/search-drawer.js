document.addEventListener("DOMContentLoaded", () => {
  const searchDrawer = document.getElementById("search-drawer");
  const searchDrawerIcon = document.getElementById("search-drawer-icon");

  if (!searchDrawer || !searchDrawerIcon) return;
  window.portal(searchDrawer);

  searchDrawerIcon.addEventListener("click", () => {
    window.whenDrawerOpen();
    searchDrawer.classList.add("active");
  });

  document.addEventListener("click", (e) => {
    if (
      searchDrawer.classList.contains("active") &&
      !searchDrawer.contains(e.target) &&
      !e.target.closest("#search-drawer-icon")
    ) {
      searchDrawer.classList.remove("active");
      window.whenDrawerClose();
    }
  });
});
