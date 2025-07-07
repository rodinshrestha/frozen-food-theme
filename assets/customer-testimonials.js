document.addEventListener("DOMContentLoaded", function () {
  const customerTestimonialWrapper = document.getElementById(
    "customer-testimonials",
  );

  if (!customerTestimonialWrapper) return;

  const swiper = customerTestimonialWrapper.querySelector(
    "#customer-testimonial-slider",
  );

  new Swiper(swiper, {
    slidesPerView: 3,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: true,
    },
    navigation: {
      nextEl: "#testimonial-btn-next",
      prevEl: "#testimonial-btn-prev",
    },
    spaceBetween: 20,
    effect: "slide", // Or "fade"
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      616: {
        slidesPerView: 2,
      },
      871: {
        slidesPerView: 2.5,
      },
      884: {
        slidesPerView: 3,
      },
    },
  });
});
