document.addEventListener("DOMContentLoaded", () => {
  const categorySwiper = document.querySelectorAll("#category-list");

  if (!categorySwiper.length) return;

  categorySwiper.forEach((element) => {
    const swiper = element.querySelector("#category-swiper");

    const categoryList = element.querySelectorAll(".category-content-list");

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
      breakpoints: {
        0: { slidesPerView: 1 },
        616: { slidesPerView: 2 },
        884: { slidesPerView: 3 },
        1020: { slidesPerView: 3.5 },
        1200: { slidesPerView: 4 },
      },
    });
  });
});
