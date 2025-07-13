const imageGallery = (modal = null) => {
  // If modal is provided, look for galleries within that modal
  // Otherwise, look in the entire document (for main product page)
  const container = modal || document;

  const navigationSwiper = container.querySelector("#image-navigation-swiper");
  const mainImageSwiper = container.querySelector("#main-image-swiper");

  if (!navigationSwiper || !mainImageSwiper) {
    console.log("Image gallery elements not found");
    return;
  }

  const prevNavigation = navigationSwiper.querySelector(
    "#swiper-image-navigation-prev",
  );

  const nextNavigation = navigationSwiper.querySelector(
    "#swiper-image-navigation-next",
  );

  let isSyncing = false;

  const thumbSwiper = new Swiper(navigationSwiper, {
    spaceBetween: 10,
    slidesPerView: 7,
    freeMode: true,
    watchSlidesProgress: true,
    slideToClickedSlide: true, //
    navigation: {
      nextEl: nextNavigation,
      prevEl: prevNavigation,
    },
  });

  const mainSwiper = new Swiper(mainImageSwiper, {
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
    // mainSwiper.slideTo(thumbSwiper.activeIndex);
    isSyncing = false;
  });

  // Sync thumbnail swiper when main swiper changes (optional)
  mainSwiper.on("slideChange", function () {
    if (isSyncing) return;
    isSyncing = true;
    thumbSwiper.slideTo(mainSwiper.activeIndex);
    isSyncing = false;
  });
};
