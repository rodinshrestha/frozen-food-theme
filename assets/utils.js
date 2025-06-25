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
