/**
 * Carrousel de produits de la page d'accueil.
 *
 * Cinq produits sont visibles : celui du centre est le plus grand, les
 * autres rétrécissent en s'éloignant. Le carrousel tourne en boucle,
 * avance seul toutes les 5 secondes et se met en pause au survol et au
 * focus. Il se pilote aussi avec les flèches, le clavier et le glissement
 * du doigt sur mobile.
 *
 * Markup attendu : voir la section "Nos produits" de index.html.
 * Chaque <figure data-product-slide> porte les attributs data-name,
 * data-description et data-usage, affichés sous le produit central.
 */

const AUTOPLAY_DELAY = 5000;
const COPY_FADE_DELAY = 180;
const SWIPE_THRESHOLD = 40;
const VISIBLE_SLIDES = 5;

/** Taille d'un produit selon sa distance au centre (1 = taille maximale). */
const sizeFactor = (distance) => {
  if (distance < 0.5) return 1;
  if (distance < 1.5) return 0.8;
  return 0.62;
};

function initCarousel(carousel) {
  const viewport = carousel.querySelector(".product-viewport");
  const track = carousel.querySelector(".product-track");
  const slides = [...carousel.querySelectorAll("[data-product-slide]")];
  const previousButton = carousel.querySelector(".carousel-arrow--previous");
  const nextButton = carousel.querySelector(".carousel-arrow--next");
  const copy = carousel.parentElement.querySelector("[data-product-copy]");
  const nameElement = copy.querySelector("[data-product-name]");
  const descriptionElement = copy.querySelector("[data-product-description]");
  const usageElement = copy.querySelector("[data-product-usage]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const count = slides.length;
  let position = Number(carousel.dataset.initialPosition) || 0;
  let autoplayTimer = 0;
  let copyTimer = 0;
  let isHovered = false;
  let hasFocus = false;
  let swipeStartX = null;

  const normalize = (index) => ((index % count) + count) % count;

  /** Distance signée la plus courte entre un produit et le centre (boucle). */
  const signedDistance = (index, center) =>
    ((((index - center + count / 2) % count) + count) % count) - count / 2;

  /** Positionne et dimensionne chaque produit autour du produit central. */
  const layout = (animate = true) => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const slideWidth = Math.max(0, (viewport.clientWidth - gap * (VISIBLE_SLIDES - 1)) / VISIBLE_SLIDES);
    const step = slideWidth + gap;
    const centerHeight = parseFloat(getComputedStyle(carousel).getPropertyValue("--produit-centre")) || 400;
    const center = normalize(Math.round(position));
    const transition = animate && !reducedMotion.matches
      ? "transform 0.6s ease, height 0.6s ease, opacity 0.6s ease"
      : "none";

    track.style.width = `${viewport.clientWidth}px`;
    track.style.height = `${centerHeight}px`;
    track.style.transform = "none";

    slides.forEach((slide, index) => {
      const distance = signedDistance(index, center);
      const absDistance = Math.abs(distance);

      slide.style.position = "absolute";
      slide.style.bottom = "0";
      slide.style.left = "50%";
      slide.style.width = `${slideWidth}px`;
      slide.style.marginLeft = `${-slideWidth / 2}px`;
      slide.style.height = `${centerHeight * sizeFactor(absDistance)}px`;
      slide.style.transition = transition;
      slide.style.transform = `translate3d(${distance * step}px, 0, 0)`;
      slide.style.opacity = absDistance <= 2.5 ? "1" : "0";

      slide.classList.toggle("is-active", absDistance < 0.5);
      slide.setAttribute("aria-hidden", String(absDistance > 2.5));
    });
  };

  /** Met à jour le texte sous le produit central, avec un léger fondu. */
  const updateCopy = (fade = true) => {
    const active = slides[normalize(Math.round(position))];
    window.clearTimeout(copyTimer);
    if (fade) copy.classList.add("is-fading");

    copyTimer = window.setTimeout(() => {
      nameElement.textContent = active.dataset.name;
      descriptionElement.textContent = active.dataset.description;
      usageElement.textContent = active.dataset.usage;
      copy.classList.remove("is-fading");
    }, fade ? COPY_FADE_DELAY : 0);
  };

  const scheduleNext = () => {
    window.clearTimeout(autoplayTimer);
    if (isHovered || hasFocus || reducedMotion.matches) return;
    autoplayTimer = window.setTimeout(() => move(1), AUTOPLAY_DELAY);
  };

  const move = (step) => {
    position = normalize(position + step);
    layout();
    updateCopy();
    scheduleNext();
  };

  previousButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));

  // Pause au survol et au focus
  carousel.addEventListener("pointerenter", () => {
    isHovered = true;
    scheduleNext();
  });
  carousel.addEventListener("pointerleave", () => {
    isHovered = false;
    scheduleNext();
  });
  carousel.addEventListener("focusin", () => {
    hasFocus = true;
    scheduleNext();
  });
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      hasFocus = false;
      scheduleNext();
    }
  });

  // Flèches du clavier lorsque le carrousel a le focus
  carousel.addEventListener("keydown", (event) => {
    if (event.target !== carousel) return;
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });

  // Glissement du doigt sur mobile
  carousel.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") swipeStartX = event.clientX;
  }, { passive: true });

  carousel.addEventListener("pointerup", (event) => {
    if (swipeStartX === null) return;
    const distance = event.clientX - swipeStartX;
    swipeStartX = null;
    if (Math.abs(distance) > SWIPE_THRESHOLD) move(distance < 0 ? 1 : -1);
  }, { passive: true });

  carousel.addEventListener("pointercancel", () => {
    swipeStartX = null;
  });

  reducedMotion.addEventListener("change", () => {
    layout(false);
    scheduleNext();
  });

  window.addEventListener("resize", () => layout(false), { passive: true });

  layout(false);
  updateCopy(false);
  scheduleNext();
}

document.querySelectorAll("[data-product-carousel]").forEach(initCarousel);
