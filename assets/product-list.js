document.addEventListener("DOMContentLoaded", function () {
  const productListWrappers = document.querySelectorAll(
    "#product-slider-wrapper",
  );
  if (!productListWrappers.length) return;

  productListWrappers.forEach((wrapper, index) => {
    const isSliderEnable =
      wrapper.getAttribute("data-product-slider") === "true";

    if (!isSliderEnable) {
      console.log("Slider disabled or not enough products.");
      const productWrapper = wrapper.querySelector(".swiper-wrapper");
      if (productWrapper) {
        productWrapper.classList.add("product-list-wrapper");
      }
      return;
    }

    const productSliderWrapper = wrapper.querySelector(".swiper");
    if (!productSliderWrapper) return;

    const uniqueID = `product-slider-${index}`;
    productSliderWrapper.id = uniqueID;

    const slideNextBtn = document.createElement("div");
    slideNextBtn.id = `${uniqueID}-next`;
    slideNextBtn.classList.add("swiper-button-next");

    const slidePrevBtn = document.createElement("div");
    slidePrevBtn.id = `${uniqueID}-prev`;
    slidePrevBtn.classList.add("swiper-button-prev");

    wrapper.appendChild(slideNextBtn);
    wrapper.appendChild(slidePrevBtn);

    new Swiper(`#${uniqueID}`, {
      slidesPerView: 4,
      spaceBetween: 10,
      loop: true,
      navigation: {
        nextEl: `#${uniqueID}-next`,
        prevEl: `#${uniqueID}-prev`,
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        616: { slidesPerView: 1 },
        871: { slidesPerView: 1 },
        884: { slidesPerView: 3 },
        1020: { slidesPerView: 3.5 },
        1200: { slidesPerView: 3.7 },
      },
    });
  });
});
