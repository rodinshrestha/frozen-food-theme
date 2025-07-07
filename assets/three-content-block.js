document.addEventListener("DOMContentLoaded", () => {
  const enableSlider = () => {
    return document.documentElement.clientWidth <= 856;
  };

  const threeContentBlockWrapper = document.getElementById(
    "three-content-block",
  );
  if (!threeContentBlockWrapper) return;

  const innerWrapper = threeContentBlockWrapper.querySelector(
    "#three-content-inner-wrapper",
  );

  if (!innerWrapper) return;

  const blockWrapper =
    threeContentBlockWrapper.querySelectorAll(".block-wrapper");

  if (!innerWrapper || !blockWrapper.length) return;

  let cloneBackUp = [];

  if (!cloneBackUp.length) {
    cloneBackUp = Array.from(blockWrapper).map((el) => el.cloneNode(true));
  }

  let swiperInstance = null;

  const appendSlider = () => {
    innerWrapper.innerHTML = "";

    const existingSwiperEl = innerWrapper.querySelector(".swiper");
    if (existingSwiperEl) {
      existingSwiperEl.remove();
    }
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }

    const swiperElement = document.createElement("div");
    swiperElement.classList.add("swiper");

    if (!enableSlider()) {
      swiperElement.remove();
      cloneBackUp.forEach((node) => {
        innerWrapper.appendChild(node);
      });
      return;
    }

    const swiperWrapper = document.createElement("div");
    swiperWrapper.classList.add("swiper-wrapper");

    blockWrapper.forEach((element) => {
      element.classList.add("swiper-slide");
      swiperWrapper.appendChild(element);
    });

    swiperElement.appendChild(swiperWrapper);

    const pagination = document.createElement("div");
    pagination.classList.add("swiper-pagination");
    swiperElement.appendChild(pagination);

    innerWrapper.appendChild(swiperElement);

    new Swiper(swiperElement, {
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: true,
      },
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
      slidesPerView: 1,
      effect: "slide",
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 1,
        },
        940: {
          slidesPerView: 3,
        },
      },
    });
  };

  appendSlider();
  window.addEventListener("resize", () => {
    appendSlider(); // re-run slider logic on resize
  });
});
