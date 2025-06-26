const mainOverlay = document.querySelector(".main-overlay");
const body = document.getElementById("body");

window.whenDrawerOpen = () => {
  if (mainOverlay) {
    mainOverlay.classList.remove("disable-overlay");
  }
  body.style.overflow = "hidden";
};

window.whenDrawerClose = () => {
  if (mainOverlay) {
    mainOverlay.classList.add("disable-overlay");
  }
  body.style.overflow = "scroll";
};

// Moves element directly under the body tag
window.portal = (element) => {
  if (element) {
    document.body.append(element);
  }
};

// get cookie
window.getCookie = (name) => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null; // Cookie not found
};

window.updateCartCount = async () => {
  return fetch("/cart.js")
    .then((res) => res.json())
    .then((cart) => {
      const itemCount = document.getElementById("cart-item-count");
      if (itemCount) {
        itemCount.textContent = cart.item_count;
      }
    })
    .catch((err) => {
      alert("Error, view console for logs");
      console.error(err);
    });
};

window.showToast = (message, status = "success") => {
  const colors = {
    success: "#4CAF50", // green
    error: "#f44336", // red
    info: "#2196F3", // blue
  };

  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top", // 'top' or 'bottom'
    position: "right", // 'left', 'center' or 'right'
    backgroundColor: colors[status] || "#333",
    stopOnFocus: true,
  }).showToast();
};

window.handleFetchResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    const msg = data?.description || data?.message || "Something went wrong";
    throw new Error(msg);
  }

  return data;
};
