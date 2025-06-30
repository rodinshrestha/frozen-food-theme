document.addEventListener("DOMContentLoaded", function () {
  const wrappers = document.querySelectorAll(".product-slider-wrapper");

  wrappers.forEach((wrapper, index) => {
    const isSliderEnable =
      wrapper.getAttribute("data-product-slider") === "true";

    if (!isSliderEnable) {
      console.log("Slider disabled or not enough products.");
      return;
    }

    // Wait for Swiper to be available
    const initSwiper = () => {
      if (typeof Swiper === "undefined") {
        setTimeout(initSwiper, 100);
        return;
      }

      // Add Swiper classes
      wrapper.classList.add("swiper-wrapper");
      const slides = wrapper.querySelectorAll(".product-slide");

      slides.forEach((slide) => {
        slide.classList.add("swiper-slide");
        slide.classList.remove("col-3");
      });

      // Create unique container for this slider
      const swiperContainer = document.createElement("div");
      swiperContainer.classList.add("swiper", "featured-products-swiper");
      const uniqueID = `product-slider-${index}`;
      swiperContainer.id = uniqueID;

      wrapper.parentNode.insertBefore(swiperContainer, wrapper);
      swiperContainer.appendChild(wrapper);

      // Create navigation buttons
      const nextBtn = document.createElement("div");
      nextBtn.classList.add("swiper-button-next");
      nextBtn.id = `${uniqueID}-next`;

      const prevBtn = document.createElement("div");
      prevBtn.classList.add("swiper-button-prev");
      prevBtn.id = `${uniqueID}-prev`;

      swiperContainer.appendChild(nextBtn);
      swiperContainer.appendChild(prevBtn);

      // Determine loop setting
      const shouldLoop = slides.length > 4;

      // Initialize Swiper
      new Swiper(`#${uniqueID}`, {
        slidesPerView: 4,
        spaceBetween: 20,
        loop: shouldLoop,
        loopedSlides: slides.length,
        navigation: {
          nextEl: `#${uniqueID}-next`,
          prevEl: `#${uniqueID}-prev`,
        },
        breakpoints: {
          0: {
            slidesPerView: 1.2,
          },
          768: {
            slidesPerView: 2.5,
          },
          940: {
            slidesPerView: 3.5,
          },
          1024: {
            slidesPerView: 4.5,
          },
        },
      });
    };

    initSwiper();
  });
});
