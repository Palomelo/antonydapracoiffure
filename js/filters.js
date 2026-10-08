/**
 * Filtres par catégorie (pages Nos prestations et Nos produits).
 *
 * Markup attendu :
 *   <div data-filter-group data-filter-target="#liste .element" data-filter-mode="single|toggle">
 *     <button data-category="Homme">Homme</button>   (data-category vide = tout afficher)
 *   </div>
 *   <li class="element" data-category="Homme">...</li>
 *
 * - mode "single" : un bouton est toujours sélectionné.
 * - mode "toggle" : un second clic sur le bouton actif retire le filtre.
 */

document.querySelectorAll("[data-filter-group]").forEach((group) => {
  const items = document.querySelectorAll(group.dataset.filterTarget);
  const canToggleOff = group.dataset.filterMode === "toggle";
  const buttons = group.querySelectorAll("button");

  const showCategory = (category) => {
    items.forEach((item) => {
      item.hidden = Boolean(category) && item.dataset.category !== category;
    });
  };

  const setPressed = (activeButton) => {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button === activeButton));
    });
  };

  group.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || !group.contains(button)) return;

    const wasPressed = button.getAttribute("aria-pressed") === "true";

    if (canToggleOff && wasPressed) {
      setPressed(null);
      showCategory("");
      return;
    }

    setPressed(button);
    showCategory(button.dataset.category);
  });
});
