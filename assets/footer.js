document.addEventListener("DOMContentLoaded", () => {
  const footer = document.getElementById("footer");

  if (!footer) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer.classList.add("dark-bg");
          console.log("Footer is in view!  @@@");
          // You can trigger animations, lazy load, etc. here
        } else {
          footer.classList.remove("dark-bg");

          console.log("Footer is out of view!  @@@");
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
