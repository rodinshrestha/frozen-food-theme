document.addEventListener("DOMContentLoaded", () => {
  const bannerWrapper = document.querySelectorAll(".banner-section");

  bannerWrapper.forEach((ele) => {
    if (!ele) return;
    const parallaxAnimation = ele.dataset.animation;

    if (parallaxAnimation === "true") {
      const contentWrapper = ele.querySelector(".banner-wrapper");
      // Defination can be in utils
      getParallaxAnimation(ele, [contentWrapper]);
    }
  });
});
