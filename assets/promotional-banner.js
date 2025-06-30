document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector("#promotional-banner");

  if (slider && slider.classList.contains("swiper")) {
    new Swiper("#promotional-banner", {
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: true,
      },
      navigation: {
        nextEl: "#promotional-banner .swiper-button-next",
        prevEl: "#promotional-banner .swiper-button-prev",
      },
      slidesPerView: 1,
      spaceBetween: 0,
      effect: "slide", // Or "fade"
    });
  }
});
