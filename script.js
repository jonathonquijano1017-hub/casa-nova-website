const PRICES = {
  laundry: 80,
  cleaning: 80,
  complete: 135,
  extraBasket: 15,
  addons: { bed: 50, fridge: 50, microwave: 20, pet: 25, kitchen: 25, deep: 80 }
};

const labels = {
  en: {
    services: { laundry: "Laundry Service", cleaning: "Standard Trailer Cleaning", complete: "Complete Refresh Package" },
    addons: { bed: "Bed Refresh", fridge: "Refrigerator Cleaning", microwave: "Microwave Cleaning", pet: "Pet Hair Removal", kitchen: "Kitchen Organization", deep: "Deep Clean Upgrade" },
    yes: "Yes", no: "No", none: "None", flexible: "Flexible"
  },
  es: {
    services: { laundry: "Servicio de Lavandería", cleaning: "Limpieza Estándar de Tráiler", complete: "Paquete Completo Casa Nova" },
    addons: { bed: "Servicio de Cama", fridge: "Limpieza de Refrigerador", microwave: "Limpieza de Microondas", pet: "Eliminación de Pelo de Mascota", kitchen: "Organización de Cocina", deep: "Limpieza Profunda" },
    yes: "Sí", no: "No", none: "Ninguno", flexible: "Flexible"
  }
};

let currentLang = "en";

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

function translatePage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-en][data-es]").forEach(el => {
    el.textContent = el.dataset[lang];
  });
  document.querySelectorAll(".lang-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.lang === lang));
  document.getElementById("name").placeholder = lang === "es" ? "Su nombre" : "Your name";
  document.getElementById("phone").placeholder = lang === "es" ? "Su número de teléfono" : "Your phone number";
  document.getElementById("address").placeholder = lang === "es" ? "Lugar del servicio" : "Service location";
  document.getElementById("notes").placeholder = lang === "es" ? "Instrucciones de acceso, condición, horario o solicitudes especiales" : "Access instructions, condition, timing, or special requests";
}

document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => translatePage(btn.dataset.lang));
});

function selectedService() {
  return document.querySelector('input[name="service"]:checked')?.value || "";
}

function calculateTotal() {
  const service = selectedService();
  let total = service ? PRICES[service] : 0;
  const baskets = Math.max(1, Number(document.getElementById("baskets").value || 1));
  if (service === "laundry" || service === "complete") {
    total += Math.max(0, baskets - 1) * PRICES.extraBasket;
  }
  document.querySelectorAll(".addon input:checked").forEach(input => {
    total += PRICES.addons[input.value];
  });
  document.getElementById("estimatedTotal").textContent = `$${total}`;
  return total;
}

function updateBasketVisibility() {
  const service = selectedService();
  const section = document.getElementById("basketSection");
  const relevant = service === "laundry" || service === "complete";
  section.style.display = relevant ? "grid" : "none";
  if (!relevant) document.getElementById("baskets").value = 1;
  calculateTotal();
}

document.querySelectorAll('input[name="service"]').forEach(input => {
  input.addEventListener("change", updateBasketVisibility);
});

document.getElementById("baskets").addEventListener("input", calculateTotal);
document.querySelectorAll(".addon input").forEach(input => input.addEventListener("change", calculateTotal));

const deepClean = document.getElementById("deepClean");
const includedByDeep = ["bed", "fridge", "microwave"];
deepClean.addEventListener("change", () => {
  includedByDeep.forEach(value => {
    const input = document.querySelector(`.addon input[value="${value}"]`);
    if (deepClean.checked) input.checked = false;
    input.disabled = deepClean.checked;
  });
  calculateTotal();
});

document.querySelectorAll(".select-service").forEach(button => {
  button.addEventListener("click", () => {
    const radio = document.querySelector(`input[name="service"][value="${button.dataset.service}"]`);
    radio.checked = true;
    updateBasketVisibility();
    document.getElementById("book").scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("bookingForm").addEventListener("submit", event => {
  event.preventDefault();
  const service = selectedService();
  if (!service) return;

  const total = calculateTotal();
  const baskets = Number(document.getElementById("baskets").value || 1);
  const addons = [...document.querySelectorAll(".addon input:checked")].map(input => labels[currentLang].addons[input.value]);

  const values = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
    bedrooms: document.getElementById("bedrooms").value,
    bathrooms: document.getElementById("bathrooms").value,
    pets: document.getElementById("pets").value,
    date: document.getElementById("date").value,
    detergent: document.getElementById("detergent").value,
    notes: document.getElementById("notes").value.trim()
  };

  const linesEn = [
    "Hi Casa Nova! I would like to request an appointment.",
    "",
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    `Location: ${values.address || "Not provided"}`,
    `Service: ${labels.en.services[service]}`,
    `Laundry baskets: ${(service === "laundry" || service === "complete") ? baskets : "N/A"}`,
    `Add-ons: ${addons.length ? addons.join(", ") : "None"}`,
    `Estimated total: $${total}`,
    `Bedrooms: ${values.bedrooms}`,
    `Bathrooms: ${values.bathrooms}`,
    `Pets: ${values.pets}`,
    `Detergent: ${values.detergent}`,
    `Preferred date: ${values.date || "Flexible"}`,
    `Notes: ${values.notes || "None"}`,
    "",
    "I understand this is a request and is not confirmed until Casa Nova responds with availability and final pricing."
  ];

  const linesEs = [
    "¡Hola Casa Nova! Quiero solicitar una cita.",
    "",
    `Nombre: ${values.name}`,
    `Teléfono: ${values.phone}`,
    `Lugar: ${values.address || "No proporcionado"}`,
    `Servicio: ${labels.es.services[service]}`,
    `Canastas de ropa: ${(service === "laundry" || service === "complete") ? baskets : "No aplica"}`,
    `Servicios adicionales: ${addons.length ? addons.join(", ") : "Ninguno"}`,
    `Total estimado: $${total}`,
    `Recámaras: ${values.bedrooms}`,
    `Baños: ${values.bathrooms}`,
    `Mascotas: ${values.pets === "Yes" ? "Sí" : "No"}`,
    `Detergente: ${values.detergent}`,
    `Fecha preferida: ${values.date || "Flexible"}`,
    `Notas: ${values.notes || "Ninguna"}`,
    "",
    "Entiendo que esta es una solicitud y no queda confirmada hasta que Casa Nova responda con disponibilidad y precio final."
  ];

  const message = (currentLang === "es" ? linesEs : linesEn).join("\n");
  window.location.href = `sms:+19562722071?&body=${encodeURIComponent(message)}`;
});

document.getElementById("year").textContent = new Date().getFullYear();
updateBasketVisibility();
calculateTotal();
