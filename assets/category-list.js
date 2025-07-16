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
      420: { slidesPerView: 1 },
      600: { slidesPerView: 1.5 },
      871: { slidesPerView: 2 },
      884: { slidesPerView: 2.5 },
      1020: { slidesPerView: 3 },
      1200: { slidesPerView: 3.5 },
      1300: { slidesPerView: 4 },
    },
  });
});
