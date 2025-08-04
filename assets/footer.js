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
    toaster.style.display = 'none';
    subscribeBtn.parentNode.style.position = 'relative';
    subscribeBtn.parentNode.appendChild(toaster);

    // Create error message element
    let errorMsg = document.createElement('div');
    errorMsg.className = 'newsletter-error-msg';
    errorMsg.style.display = 'none';
    errorMsg.textContent = 'Please enter a valid email address.';
    emailInput.parentNode.appendChild(errorMsg);

    function showToaster(message) {
      toaster.textContent = message;
      toaster.classList.remove('success');
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
        emailInput.classList.add('error');
        errorMsg.style.display = 'block';
        return;
      }
      showToaster('Thank you for subscribing');
      emailInput.value = '';
      emailInput.classList.remove('error');
      errorMsg.style.display = 'none';
    });
    emailInput.addEventListener('input', function () {
      if (emailInput.classList.contains('error') || errorMsg.style.display === 'block') {
        emailInput.classList.remove('error');
        errorMsg.style.display = 'none';
      }
    });
  }
});
