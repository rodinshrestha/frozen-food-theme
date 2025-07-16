document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".two-column-image-section");

  if (!section) return;

  const animation = section.dataset.animation;

  let parallaxScrollTrigger = null;

  const animationInit = () => {
    if (parallaxScrollTrigger) {
      parallaxScrollTrigger.kill();
      parallaxScrollTrigger = null;
    }

    // Recreate only if enabled and not in mobile
    if (animation === "true" && !isMobile()) {
      const contentWrapper = section.querySelectorAll(".image-wrapper");
      parallaxScrollTrigger = getParallaxAnimation(section, contentWrapper);
    }
  };

  animationInit();
  window.addEventListener("resize", animationInit);
});
