document.addEventListener("DOMContentLoaded", () => {
  const footer = document.getElementById("footer");

  if (!footer) return;

  footer
    .querySelectorAll(".footer-navigation-link-wrapper")
    .forEach((wrapper) => {
      const title = wrapper.querySelector(".footer-title-wrapper");
      const content = wrapper.querySelector(".footer-link-content");

      title.addEventListener("click", () => {
        content.classList.toggle("active");
        title.classList.toggle("active");
      });
    });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer.classList.add("dark-bg");
        } else {
          footer.classList.remove("dark-bg");
        }
      });
    },
    {
      root: null, // viewport
      rootMargin: "0px 0px -75px 0px",
      threshold: 0.1, // 10% of footer must be visible to trigger
    },
  );

  if (footer) {
    observer.observe(footer);
  }
});
