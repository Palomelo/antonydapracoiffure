/**
 * Page Nos conseils : tri des articles et défilement des rangées.
 *
 * - <select data-advice-sort> trie les cartes de chaque rangée.
 * - <button data-advice-scroll="-1|1" aria-controls="id-de-la-rangée">
 *   fait défiler la rangée correspondante.
 */

const sortSelect = document.querySelector("[data-advice-sort]");

const comparators = {
  recent: (a, b) => b.dataset.date.localeCompare(a.dataset.date),
  old: (a, b) => a.dataset.date.localeCompare(b.dataset.date),
  title: (a, b) => a.dataset.title.localeCompare(b.dataset.title, "fr"),
};

sortSelect?.addEventListener("change", () => {
  const compare = comparators[sortSelect.value] ?? comparators.recent;

  document.querySelectorAll("[data-advice-rail]").forEach((rail) => {
    const cards = [...rail.querySelectorAll("[data-advice-card]")];
    cards.sort(compare).forEach((card) => rail.append(card));
    rail.scrollTo({ left: 0, behavior: "auto" });
  });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll("[data-advice-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const rail = document.getElementById(button.getAttribute("aria-controls"));
    const direction = Number(button.dataset.adviceScroll);

    rail?.scrollBy({
      left: direction * rail.clientWidth * 0.8,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  });
});
