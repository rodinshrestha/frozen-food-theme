function getVisibleHeight(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, windowHeight);

  const visibleHeight = visibleBottom - visibleTop;

  return visibleHeight > 0 ? visibleHeight : 0;
}

document.addEventListener("DOMContentLoaded", function () {
  const sliderBanner = document.getElementById("slider-banner");

  if (!sliderBanner) {
    return;
  }

  const downIcon = sliderBanner.querySelectorAll("#banner-down-icon");

  downIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
      const activeBanner = sliderBanner.querySelector(".swiper-slide-active");
      const bannerHeight = getVisibleHeight(activeBanner);
      const headerHeight = document.getElementById("header");

      const offSet = headerHeight.classList.contains("sticky") ? 0 : 65;

      window.scrollBy({
        top: bannerHeight + offSet,
        left: 0,
        behavior: "smooth",
      });
    });
  });

  const swiper = document.getElementById("swiper-slider-banner");

  if (!swiper) return;

  new Swiper(swiper, {
    loop: true,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: true,
    // },
    pagination: {
      el: "#slider-banner-pagination",
      type: "bullets",
      clickable: true,
    },
    slidesPerView: 1,
    spaceBetween: 0,
    effect: "slide", // Or "fade"
  });
});
