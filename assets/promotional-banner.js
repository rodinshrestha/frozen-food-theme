document.addEventListener("DOMContentLoaded", function () {
  const swiper = document.getElementById("promotional-banner-swiper");

  if (!swiper) return;

  new Swiper(swiper, {
    loop: true,
    // autoplay: {
    //   delay: 4000,
    //   disableOnInteraction: true,
    // },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    slidesPerView: 1,
    spaceBetween: 0,
    effect: "slide", // Or "fade"
  });
});
