document.addEventListener("DOMContentLoaded", () => {
  const categorySwiper = document.getElementById("category-list");

  if (!categorySwiper) return;

  const swiper = categorySwiper.querySelector("#category-swiper");

  const categoryList = categorySwiper.querySelectorAll(
    ".category-content-list",
  );

  const disableSlider = !isMobile() && categoryList.length <= 4;

  if (disableSlider) return;

  new Swiper(swiper, {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: "#category-next",
      prevEl: "#category-prev",
    },
    effect: "slide", // Or "fade"

    breakpoints: {
      0: { slidesPerView: 1 },
      616: { slidesPerView: 1 },
      871: { slidesPerView: 1 },
      884: { slidesPerView: 3 },
      1020: { slidesPerView: 3.5 },
      1200: { slidesPerView: 4 },
    },
  });
});
