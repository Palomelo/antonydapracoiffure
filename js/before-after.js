/**
 * Comparateur "avant / après" de la page La Boutique.
 * Le curseur (input range) pilote la variable CSS --reveal, qui découpe
 * la photo "après" par-dessus la photo "avant".
 */

document.querySelectorAll("[data-before-after]").forEach((comparison) => {
  const slider = comparison.querySelector("input[type='range']");
  if (!slider) return;

  const update = () => {
    comparison.style.setProperty("--reveal", `${slider.value}%`);
  };

  slider.addEventListener("input", update);
  update();
});
