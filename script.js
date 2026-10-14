// DEMO SETUP: Replace the sample WhatsApp number in this file before showing the site to a client.
const DEMO_WHATSAPP_NUMBER = "2348000000000"; // digits only, international format, no + sign

function openWhatsApp(message) {
  const url = `https://wa.me/${DEMO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    openWhatsApp(link.dataset.whatsapp || "Hello, I'd like to make an enquiry.");
  });
});

const grid = document.getElementById("inventoryGrid");
const cards = Array.from(grid.querySelectorAll(".car-card"));
const searchText = document.getElementById("searchText");
const brandFilter = document.getElementById("brandFilter");
const priceFilter = document.getElementById("priceFilter");
const yearFilter = document.getElementById("yearFilter");
const sortFilter = document.getElementById("sortFilter");
const emptyState = document.getElementById("emptyState");

function updateInventory() {
  const query = searchText.value.trim().toLowerCase();
  const brand = brandFilter.value;
  const maxPrice = Number(priceFilter.value || Infinity);
  const minYear = Number(yearFilter.value || 0);
  let visibleCount = 0;

  cards.forEach(card => {
    const matches = (!query || `${card.dataset.search} ${card.innerText}`.toLowerCase().includes(query))
      && (!brand || card.dataset.brand === brand)
      && Number(card.dataset.price) <= maxPrice
      && Number(card.dataset.year) >= minYear;
    card.hidden = !matches;
    if (matches) visibleCount++;
  });

  const visibleCards = cards.filter(card => !card.hidden);
  visibleCards.sort((a, b) => {
    if (sortFilter.value === "low") return Number(a.dataset.price) - Number(b.dataset.price);
    if (sortFilter.value === "high") return Number(b.dataset.price) - Number(a.dataset.price);
    if (sortFilter.value === "new") return Number(b.dataset.year) - Number(a.dataset.year);
    return cards.indexOf(a) - cards.indexOf(b);
  });
  visibleCards.forEach(card => grid.appendChild(card));
  emptyState.hidden = visibleCount !== 0;
}

document.getElementById("searchButton").addEventListener("click", updateInventory);
[searchText, brandFilter, priceFilter, yearFilter, sortFilter].forEach(control => {
  control.addEventListener(control === searchText ? "input" : "change", updateInventory);
});
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});
document.querySelectorAll("#nav a").forEach(link => link.addEventListener("click", () => {
  document.getElementById("nav").classList.remove("open");
}));
document.getElementById("year").textContent = new Date().getFullYear();
