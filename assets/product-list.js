const forceSlider = () => document.documentElement.clientWidth <= 1035;

document.addEventListener("DOMContentLoaded", function () {
  const productListWrappers = document.querySelectorAll(
    "#product-slider-wrapper",
  );
  if (!productListWrappers.length) return;

  const swiperInstances = new Map(); // Track Swiper instances by ID

  const productListInit = () => {
    productListWrappers.forEach((wrapper, index) => {
      const isSliderEnable =
        wrapper.getAttribute("data-product-slider") === "true";
      const productWrapper = wrapper.querySelector(".swiper-wrapper");

      const productList = wrapper.querySelectorAll(
        ".featured-product-inner-wrapper",
      );

      const isSlider = isSliderEnable && productList.length > 4;

      const uniqueID = `product-slider-${index}`;

      if (isSlider || forceSlider()) {
        const productSliderWrapper = wrapper.querySelector(".swiper");
        if (!productSliderWrapper) return;

        // Destroy previous instance if it exists
        if (swiperInstances.has(uniqueID)) {
          swiperInstances.get(uniqueID).destroy(true, true);
          swiperInstances.delete(uniqueID);
        }

        productSliderWrapper.id = uniqueID;

        productWrapper.classList.remove("product-list-wrapper");

        // Create navigation buttons if not present
        let slideNextBtn = wrapper.querySelector(`#${uniqueID}-next`);
        if (!slideNextBtn) {
          slideNextBtn = document.createElement("div");
          slideNextBtn.id = `${uniqueID}-next`;
          slideNextBtn.classList.add("swiper-button-next");
          wrapper.appendChild(slideNextBtn);
        }

        let slidePrevBtn = wrapper.querySelector(`#${uniqueID}-prev`);
        if (!slidePrevBtn) {
          slidePrevBtn = document.createElement("div");
          slidePrevBtn.id = `${uniqueID}-prev`;
          slidePrevBtn.classList.add("swiper-button-prev");
          wrapper.appendChild(slidePrevBtn);
        }

        const swiperInstance = new Swiper(`#${uniqueID}`, {
          slidesPerView: 4,
          spaceBetween: 20,
          loop: true,
          navigation: {
            nextEl: `#${uniqueID}-next`,
            prevEl: `#${uniqueID}-prev`,
          },
          breakpoints: {
            0: { slidesPerView: 1 },
            616: { slidesPerView: 2 },
            884: { slidesPerView: 3 },
            1020: { slidesPerView: 3.5 },
            1200: { slidesPerView: 4 },
          },
        });

        swiperInstances.set(uniqueID, swiperInstance);

        return;
      }

      productWrapper.classList.add("product-list-wrapper");
      productWrapper.style.opacity = "1";
      const nextBtn = wrapper.querySelector(`#${uniqueID}-next`);
      const prevBtn = wrapper.querySelector(`#${uniqueID}-prev`);
      if (nextBtn) nextBtn.remove();
      if (prevBtn) prevBtn.remove();
    });
  };

  productListInit();

  // Debounced resize
  window.addEventListener("resize", productListInit);
});
