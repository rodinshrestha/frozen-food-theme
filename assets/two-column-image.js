document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".two-column-image-section");

  if (!section) return;

  const animation = section.dataset.animation;

  if (animation === "true") {
    const contentWrapper = section.querySelectorAll(".image-wrapper");
    getParallaxAnimation(section, contentWrapper);
  }
});
