document.addEventListener("DOMContentLoaded", function () {
  const swiper = document.getElementById("promotional-banner-swiper");

  if (!swiper) return;

  new Swiper(swiper, {
    loop: true,
    autoplay: {
      delay: 10000,
      disableOnInteraction: true,
    },
    navigation: {
      nextEl: "#promotional-banner-next",
      prevEl: "#promotional-banner-prev",
    },
    slidesPerView: 1,
    spaceBetween: 0,
    effect: "slide", // Or "fade"
  });
});
