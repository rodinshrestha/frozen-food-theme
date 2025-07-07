document.addEventListener("DOMContentLoaded", function () {
  const faqWrappers = document.querySelectorAll(".faq-list-wrapper");

  faqWrappers.forEach((wrapper) => {
    const title = wrapper.querySelector(".faq-list-title");
    title.addEventListener("click", () => {
      // Close others (optional for accordion behavior)
      faqWrappers.forEach((w) => {
        if (w !== wrapper) w.classList.remove("active");
      });
      // Toggle current
      wrapper.classList.toggle("active");
    });
  });
});
