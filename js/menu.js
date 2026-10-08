/**
 * Menu mobile : ouvre et ferme la navigation principale.
 * Chargé sur toutes les pages.
 */

const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("nav");

if (toggle && nav) {
  const setOpen = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  };

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  // La touche Échap referme le menu
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}
