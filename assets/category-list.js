document.addEventListener("DOMContentLoaded", () => {
  const categorySwiper = document.querySelectorAll("#category-list");

  if (!categorySwiper.length) return;

  categorySwiper.forEach((element) => {
    const swiper = element.querySelector("#category-swiper");

    const categoryList = element.querySelectorAll(".category-content-list");

    const disableSlider = !isMobile() && categoryList.length <= 4;

    if (disableSlider) return;

    // Create navigation buttons if they don't exist
    let nextBtn = element.querySelector("#category-next");
    if (!nextBtn) {
      nextBtn = document.createElement("div");
      nextBtn.id = "category-next";
      nextBtn.classList.add("swiper-button-next", "category-swiper-navigation");
      element.appendChild(nextBtn);
    }

    let prevBtn = element.querySelector("#category-prev");
    if (!prevBtn) {
      prevBtn = document.createElement("div");
      prevBtn.id = "category-prev";
      prevBtn.classList.add("swiper-button-prev", "category-swiper-navigation");
      element.appendChild(prevBtn);
    }

    new Swiper(swiper, {
      slidesPerView: 4,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: "#category-next",
        prevEl: "#category-prev",
      },
      effect: "slide",
      observeParents: true,
      observeSlideChildren: true,
      speed: 300, // Smooth transition speed
      touchRatio: 1, // Enable touch/swipe
      allowTouchMove: true, // Allow touch movement
      breakpoints: {
                0: { 
           slidesPerView: 1,
           spaceBetween: 0,
           allowTouchMove: true,
           touchRatio: 1
         },
        600: { 
          slidesPerView: 1.5,
          spaceBetween: 15,
          allowTouchMove: true,
          touchRatio: 1
        },
        871: { 
          slidesPerView: 2,
          spaceBetween: 20,
          allowTouchMove: true,
          touchRatio: 1
        },
        884: { 
          slidesPerView: 2.5,
          spaceBetween: 20,
          allowTouchMove: true,
          touchRatio: 1
        },
        1020: { 
          slidesPerView: 3,
          spaceBetween: 20,
          allowTouchMove: true,
          touchRatio: 1
        },
        1200: { 
          slidesPerView: 3.5,
          spaceBetween: 20,
          allowTouchMove: true,
          touchRatio: 1
        },
        1300: { 
          slidesPerView: 4,
          spaceBetween: 20,
          allowTouchMove: true,
          touchRatio: 1
        },
      },
    });
  });
});

// Helper function to check if mobile
function isMobile() {
  return window.innerWidth <= 768;
}
