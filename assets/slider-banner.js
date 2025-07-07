document.addEventListener("DOMContentLoaded", function () {
  const sliderBanner = document.getElementById("slider-banner");

  if (!sliderBanner) {
    return;
  }

  const downIcon = sliderBanner.querySelectorAll("#banner-down-icon");

  downIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
      const bannerHeight = sliderBanner.offsetHeight;

      window.scrollBy({
        top: bannerHeight,
        left: 0,
        behavior: "smooth",
      });
    });
  });

  const swiper = document.getElementById("swiper-slider-banner");

  if (!swiper) return;

  new Swiper(swiper, {
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: true,
    },
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
