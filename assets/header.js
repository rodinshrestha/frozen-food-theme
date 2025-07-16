document.addEventListener("DOMContentLoaded", () => {
  const subMenuWrapper = document.getElementById("sub-navigation-wrapper");
  const header = document.getElementById("header");
  const promoBanner = document.getElementById("promotional-banner");
  const extraHeight = document.getElementById("extra-header-height");
  const hamburger = document.getElementById("hamburger");

  // Opens the header sub menu
  subMenuWrapper.addEventListener("mouseenter", () => {
    const submenu = document.getElementById("sub-menu-wrapper");

    submenu.style.visibility = "visible";
    submenu.style.height = submenu.scrollHeight + "px";
  });

  // closes the header sub menu
  subMenuWrapper.addEventListener("mouseleave", () => {
    const submenu = document.getElementById("sub-menu-wrapper");

    submenu.style.height = "0";
    setTimeout(() => {
      submenu.style.visibility = "hidden";
    }, 300); // match the transition duration
  });

  const updateStickyHeader = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const bannerHeight = promoBanner ? promoBanner.offsetHeight : 0;

    if (scrollTop > bannerHeight) {
      header.classList.add("sticky");
      extraHeight.classList.add("extra-header-height");
    } else {
      header.classList.remove("sticky");
      extraHeight.classList.remove("extra-header-height");
    }
  };

  // Use passive scroll listener for better mobile performance
  window.addEventListener("scroll", updateStickyHeader, { passive: true });

  hamburger.addEventListener("click", function () {
    const mobileMenu = document.getElementById("mobile-menu-drawer");
    const headerWrapper = document.getElementById("header");

    const isMenuActive = this.classList.contains("active");
    const isStickyInHeader = headerWrapper.classList.contains("sticky");

    if (!isMenuActive) {
      this.classList.add("active");
      mobileMenu.classList.add("active");
      window.whenDrawerOpen();

      const headerHeight = headerWrapper.offsetHeight;

      if (isStickyInHeader) {
        mobileMenu.style.top = headerHeight;
      } else {
        const promotionalBannerHeight =
          document.getElementById("promotional-banner");
        if (!promotionalBannerHeight) {
          mobileMenu.style.top = headerHeight;
          return;
        }

        const totalHeight = headerHeight + promotionalBannerHeight.offsetHeight;
        mobileMenu.style.top = totalHeight - 0.5;
      }
    } else {
      window.whenDrawerClose();
      this.classList.remove("active");
      header.classList.remove("mobile-navigation-menu");
      mobileMenu.classList.remove("active");
    }
  });
});
