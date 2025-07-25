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

  const subscribeBtn = footer.querySelector('.newsletter-form-wrapper .btn');
  const emailInput = footer.querySelector('.contact-email');

  if (subscribeBtn && emailInput) {
    // Create and insert toaster
    let toaster = document.createElement('div');
    toaster.className = 'footer-toaster';
    // Only control visibility in JS
    toaster.style.display = 'none';
    subscribeBtn.parentNode.style.position = 'relative';
    subscribeBtn.parentNode.appendChild(toaster);

    function showToaster(message, type) {
      toaster.textContent = message;
      toaster.classList.remove('success', 'error');
      toaster.classList.add(type);
      toaster.style.display = 'block';
      setTimeout(() => {
        toaster.style.display = 'none';
      }, 2500);
    }
    function validateEmail(email) {
      return /^\S+@\S+\.\S+$/.test(email);
    }
    subscribeBtn.addEventListener('click', function () {
      const email = emailInput.value.trim();
      if (!validateEmail(email)) {
        showToaster('Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
      }
      showToaster('Thank you for subscribing', 'success');
      emailInput.value = '';
    });
  }
});
