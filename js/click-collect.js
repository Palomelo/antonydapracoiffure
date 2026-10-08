/**
 * Formulaire Click & Collect des fiches produit.
 * À l'envoi, prépare un e-mail adressé au salon avec les informations de
 * la commande (le paiement se fait au retrait en magasin).
 */

const SALON_EMAIL = "antonydapracoiffure@gmail.com";

document.querySelectorAll("[data-click-collect]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const productName = form.dataset.productName || "Produit Actyva";
    const quantity = String(data.get("quantity") || "1");
    const name = String(data.get("customerName") || "").trim();
    const email = String(data.get("customerEmail") || "").trim();
    const phone = String(data.get("customerPhone") || "").trim();

    const subject = `Commande Click & Collect : ${productName}`;
    const body = [
      "Bonjour,",
      "",
      "Je souhaite commander le produit suivant pour un retrait au salon :",
      `Produit : ${productName}`,
      `Quantité : ${quantity}`,
      "",
      `Nom : ${name}`,
      `E-mail : ${email}`,
      `Téléphone : ${phone}`,
      "Consentement au traitement de la demande : oui",
      "",
      "Je réglerai ma commande au retrait en magasin. Merci de me confirmer la disponibilité et le prix.",
    ].join("\n");

    const status = form.querySelector("[data-order-status]");
    if (status) {
      status.textContent =
        "Votre application de messagerie va s’ouvrir. Envoyez le message pour transmettre votre commande au salon.";
    }

    window.location.href =
      `mailto:${SALON_EMAIL}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  });
});
