document.addEventListener("DOMContentLoaded", function () {
  let isSyncing = false;

  const thumbSwiper = new Swiper("#image-navigation-swiper", {
    spaceBetween: 10,
    slidesPerView: 5,
    freeMode: true,
    watchSlidesProgress: true,
    slideToClickedSlide: true, //
    navigation: {
      nextEl: "#swiper-image-navigation-next",
      prevEl: "#swiper-image-navigation-prev",
    },
  });

  const mainSwiper = new Swiper("#main-image-swiper", {
    loop: true,
    spaceBetween: 10,
    thumbs: {
      swiper: thumbSwiper,
    },
  });

  // Sync main swiper when thumbnail swiper changes (but prevent loop)
  thumbSwiper.on("slideChange", function () {
    if (isSyncing) return;
    isSyncing = true;
    mainSwiper.slideTo(thumbSwiper.activeIndex);
    isSyncing = false;
  });

  // Sync thumbnail swiper when main swiper changes (optional)
  mainSwiper.on("slideChange", function () {
    if (isSyncing) return;
    isSyncing = true;
    thumbSwiper.slideTo(mainSwiper.activeIndex);
    isSyncing = false;
  });
});
