document.addEventListener("DOMContentLoaded", function () {
  console.log("Featured products script loaded");

  const wrapper = document.querySelector(".product-slider-wrapper");
  if (!wrapper) {
    console.log("No product slider wrapper found");
    return;
  }

  const productCount = parseInt(wrapper.dataset.productCount, 10);
  console.log("Product count:", productCount);

  // Check if we have enough products to make a slider worthwhile
  const shouldBeSlider = productCount > 4;

  if (shouldBeSlider) {
    // Wait for Swiper to be available
    const initSwiper = () => {
      if (typeof Swiper === "undefined") {
        setTimeout(initSwiper, 100);
        return;
      }

      console.log("Initializing Swiper...");

      // Add Swiper slide classes
      wrapper.classList.add("swiper-wrapper");

      const slides = wrapper.querySelectorAll(".product-slide");
      slides.forEach((slide) => {
        slide.classList.add("swiper-slide");
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

      console.log("Navigation buttons created:", {
        next: nextBtn,
        prev: prevBtn,
      });

      // Determine if we should use loop based on slide count
      const shouldLoop = slides.length > 4;
      console.log(
        "Should use loop:",
        shouldLoop,
        "Slide count:",
        slides.length,
      );

      // Initialize Swiper
      const swiper = new Swiper(".featured-products-swiper", {
        slidesPerView: 4,
        spaceBetween: 20,
        loop: true,
        loopedSlides: slides.length, // Ensure proper loop with all slides
        autoplay: shouldLoop
          ? {
              delay: 3000,
              disableOnInteraction: false,
            }
          : false,
        navigation: {
          nextEl: "#featured-products-next",
          prevEl: "#featured-products-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: 1.2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        },
      });

      // Add click event listeners as backup
      nextBtn.addEventListener("click", function () {
        console.log("Next button clicked");
        console.log("Before slideNext - Active index:", swiper.activeIndex);
        console.log("Before slideNext - Real index:", swiper.realIndex);
        console.log("Before slideNext - Navigation state:", {
          isBeginning: swiper.isBeginning,
          isEnd: swiper.isEnd,
          allowSlideNext: swiper.allowSlideNext,
          allowSlidePrev: swiper.allowSlidePrev,
        });

        // Force enable next navigation and reset end state
        if (!swiper.allowSlideNext || swiper.isEnd) {
          console.log(
            "Next navigation was disabled or at end, forcing enable...",
          );
          swiper.allowSlideNext = true;
          swiper.isEnd = false;
        }

        // Try alternative method if slideNext doesn't work
        try {
          swiper.slideNext();
          console.log("slideNext() called successfully");
        } catch (error) {
          console.error("Error with slideNext:", error);
          // Try alternative approach
          console.log("Trying alternative slide method...");
          swiper.slideTo(swiper.activeIndex + 1);
        }

        console.log("After slideNext - Active index:", swiper.activeIndex);
        console.log("After slideNext - Real index:", swiper.realIndex);
        console.log("After slideNext - Navigation state:", {
          isBeginning: swiper.isBeginning,
          isEnd: swiper.isEnd,
          allowSlideNext: swiper.allowSlideNext,
          allowSlidePrev: swiper.allowSlidePrev,
        });
      });

      prevBtn.addEventListener("click", function () {
        console.log("Prev button clicked");
        console.log("Before slidePrev - Active index:", swiper.activeIndex);
        console.log("Before slidePrev - Real index:", swiper.realIndex);
        swiper.slidePrev();
        console.log("After slidePrev - Active index:", swiper.activeIndex);
        console.log("After slidePrev - Real index:", swiper.realIndex);
      });

      // Monitor navigation state changes and force loop
      setInterval(() => {
        const nextBtn = document.querySelector("#featured-products-next");
        if (nextBtn) {
          const isDisabled = nextBtn.classList.contains(
            "swiper-button-disabled",
          );
          if (isDisabled) {
            console.log("Next button is disabled, trying to re-enable...");
            nextBtn.classList.remove("swiper-button-disabled");
            // Force reset swiper state
            swiper.allowSlideNext = true;
            swiper.isEnd = false;
          }
        }
      }, 1000);

      console.log("Swiper initialized successfully");
    };

    initSwiper();
  } else {
    console.log("Not enough products for slider, showing as grid");
  }
});
