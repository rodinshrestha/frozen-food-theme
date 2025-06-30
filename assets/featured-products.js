document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("product-slider-wrapper");
  if (!wrapper) {
    console.log("No product slider wrapper found");
    return;
  }

  const isSliderEnable = wrapper.getAttribute("data-product-slider") || false;

  if (isSliderEnable) {
    // Wait for Swiper to be available
    const initSwiper = () => {
      if (typeof Swiper === "undefined") {
        setTimeout(initSwiper, 100);
        return;
      }

      // Add Swiper slide classes
      wrapper.classList.add("swiper-wrapper");

      const slides = wrapper.querySelectorAll(".product-slide");
      slides.forEach((slide) => {
        slide.classList.add("swiper-slide");
        slide.classList.remove("col-3");
      });

      // Create Swiper container
      const swiperContainer = document.createElement("div");
      swiperContainer.classList.add("swiper", "featured-products-swiper");
      wrapper.parentNode.insertBefore(swiperContainer, wrapper);
      swiperContainer.appendChild(wrapper);

      // Create navigation buttons with unique IDs
      const nextBtn = document.createElement("div");
      nextBtn.classList.add("swiper-button-next");
      nextBtn.id = "featured-products-next";

      const prevBtn = document.createElement("div");
      prevBtn.classList.add("swiper-button-prev");
      prevBtn.id = "featured-products-prev";

      swiperContainer.appendChild(nextBtn);
      swiperContainer.appendChild(prevBtn);

      // Determine if we should use loop based on slide count
      const shouldLoop = slides.length > 4;

      // Initialize Swiper
      new Swiper(".featured-products-swiper", {
        slidesPerView: 4,
        spaceBetween: 20,
        loop: true,
        loopedSlides: slides.length, // Ensure proper loop with all slides
        // autoplay: shouldLoop
        //   ? {
        //       delay: 3000,
        //       disableOnInteraction: false,
        //     }
        //   : false,
        navigation: {
          nextEl: "#featured-products-next",
          prevEl: "#featured-products-prev",
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
  } else {
    console.log("Not enough products for slider, showing as grid");
  }
});
