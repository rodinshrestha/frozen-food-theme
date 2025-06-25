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
