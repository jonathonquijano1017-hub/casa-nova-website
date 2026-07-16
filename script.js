const PRICES = {
  laundry: 80,
  cleaning: 80,
  complete: 135,
  extraBasket: 15,
  addons: { bed: 50, fridge: 50, microwave: 20, pet: 25, kitchen: 25, deep: 80 }
};

const TEXT = {
  en: {
    services: { laundry: "Laundry Service", cleaning: "Trailer Cleaning", complete: "Complete Refresh" },
    addons: { bed: "Bed Refresh", fridge: "Refrigerator Cleaning", microwave: "Microwave Cleaning", pet: "Pet Hair Removal", kitchen: "Kitchen Organization", deep: "Deep Clean Upgrade" }
  },
  es: {
    services: { laundry: "Servicio de Lavandería", cleaning: "Limpieza de Tráiler", complete: "Paquete Completo" },
    addons: { bed: "Servicio de Cama", fridge: "Limpieza de Refrigerador", microwave: "Limpieza de Microondas", pet: "Pelo de Mascota", kitchen: "Organización de Cocina", deep: "Limpieza Profunda" }
  }
};

let currentLang = "en";

function translatePage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-en][data-es]").forEach(el => {
    el.textContent = el.dataset[lang];
  });
  document.querySelectorAll(".lang-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.lang === lang));

  const name = document.getElementById("name");
  if (name) {
    name.placeholder = lang === "es" ? "Su nombre" : "Your name";
    document.getElementById("phone").placeholder = lang === "es" ? "Su teléfono" : "Your phone number";
    document.getElementById("address").placeholder = lang === "es" ? "Lugar del servicio" : "Service location";
    document.getElementById("notes").placeholder = lang === "es" ? "Acceso, condición, horario o solicitudes especiales" : "Access instructions, condition, timing, or special requests";
  }
}

document.querySelectorAll(".lang-btn").forEach(btn => btn.addEventListener("click", () => translatePage(btn.dataset.lang)));

const form = document.getElementById("bookingForm");

if (form) {
  const basketSection = document.getElementById("basketSection");
  const basketInput = document.getElementById("baskets");
  const totalEl = document.getElementById("estimatedTotal");
  const packageSubtotalEl = document.getElementById("packageSubtotal");
  const laundrySubtotalEl = document.getElementById("laundrySubtotal");
  const addonsSubtotalEl = document.getElementById("addonsSubtotal");
  const frequencyDiscountEl = document.getElementById("frequencyDiscount");
  const deepClean = document.getElementById("deepClean");
  const clearPackageButton = document.getElementById("clearPackage");
  const clearAddonsButton = document.getElementById("clearAddons");
  const selectedServiceInput = document.getElementById("selectedService");
  const serviceButtons = [...document.querySelectorAll(".service-package")];

  function selectedService() {
    return selectedServiceInput.value;
  }

  function setSelectedService(service) {
    selectedServiceInput.value = service || "";
    serviceButtons.forEach(button => {
      button.classList.toggle("selected", button.dataset.service === service);
    });
    updateBasketVisibility();
  }

  function getAddonsSubtotal() {
    return [...document.querySelectorAll(".addon input:checked")]
      .reduce((sum, input) => sum + Number(PRICES.addons[input.value] || 0), 0);
  }

  function selectedFrequency() {
    return document.querySelector('input[name="frequency"]:checked')?.value || "one-time";
  }

  function getFrequencyDiscount() {
    const frequency = selectedFrequency();
    if (frequency === "weekly") return 10;
    if (frequency === "biweekly") return 5;
    return 0;
  }

  function calculateTotal() {
    const service = selectedService();
    const packageSubtotal = service ? Number(PRICES[service] || 0) : 0;
    const baskets = Math.max(1, Number(basketInput.value || 1));
    const laundrySubtotal =
      service === "laundry" || service === "complete"
        ? Math.max(0, baskets - 1) * Number(PRICES.extraBasket)
        : 0;
    const addonsSubtotal = getAddonsSubtotal();
    const frequencyDiscount = service ? getFrequencyDiscount() : 0;
    const total = Math.max(0, packageSubtotal + laundrySubtotal + addonsSubtotal - frequencyDiscount);

    packageSubtotalEl.textContent = `$${packageSubtotal}`;
    laundrySubtotalEl.textContent = `$${laundrySubtotal}`;
    addonsSubtotalEl.textContent = `$${addonsSubtotal}`;
    frequencyDiscountEl.textContent = `-$${frequencyDiscount}`;
    totalEl.textContent = `$${total}`;

    clearPackageButton.classList.toggle("active", !service);
    clearAddonsButton.classList.toggle(
      "active",
      document.querySelectorAll(".addon input:checked").length === 0
    );

    return total;
  }

  function updateBasketVisibility() {
    const service = selectedService();
    const show = service === "laundry" || service === "complete";
    basketSection.style.display = show ? "grid" : "none";
    if (!show) basketInput.value = 1;
    calculateTotal();
  }

  serviceButtons.forEach(button => {
    button.addEventListener("click", () => {
      const service = button.dataset.service;
      setSelectedService(selectedService() === service ? "" : service);
    });
  });

  clearPackageButton.addEventListener("click", () => setSelectedService(""));

  function clearAllAddons() {
    document.querySelectorAll(".addon input").forEach(input => {
      input.checked = false;
      input.disabled = false;
    });
    deepClean.checked = false;
    calculateTotal();
  }

  clearAddonsButton.addEventListener("click", clearAllAddons);
  basketInput.addEventListener("input", calculateTotal);

  document.querySelectorAll('input[name="frequency"]').forEach(input => {
    input.addEventListener("change", calculateTotal);
  });

  document.querySelectorAll(".addon input").forEach(input => {
    input.addEventListener("change", calculateTotal);
  });

  deepClean.addEventListener("change", () => {
    ["bed", "fridge", "microwave"].forEach(value => {
      const input = document.querySelector(`.addon input[value="${value}"]`);
      if (deepClean.checked) input.checked = false;
      input.disabled = deepClean.checked;
    });
    calculateTotal();
  });

  const params = new URLSearchParams(window.location.search);
  const preselected = params.get("service");
  setSelectedService(preselected && PRICES[preselected] ? preselected : "");

  form.addEventListener("submit", event => {
    event.preventDefault();
    const service = selectedService();

    if (!service) {
      alert(currentLang === "es" ? "Seleccione un paquete." : "Please select a package.");
      return;
    }

    const total = calculateTotal();
    const baskets = Number(basketInput.value || 1);
    const addons = [...document.querySelectorAll(".addon input:checked")]
      .map(input => TEXT[currentLang].addons[input.value]);

    const values = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      bedrooms: document.getElementById("bedrooms").value,
      bathrooms: document.getElementById("bathrooms").value,
      pets: document.getElementById("pets").value,
      date: document.getElementById("date").value,
      detergent: document.getElementById("detergent").value,
      notes: document.getElementById("notes").value.trim(),
      frequency: selectedFrequency()
    };

    const messageEn = [
      "Hi Casa Nova! I would like to request a quote.",
      "",
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Location: ${values.address || "Not provided"}`,
      `Package: ${TEXT.en.services[service]}`,
      `Service frequency: ${values.frequency === "weekly" ? "Weekly" : values.frequency === "biweekly" ? "Every 2 Weeks" : values.frequency === "monthly" ? "Monthly" : "One-Time Service"}`,
      `Recurring discount: $${getFrequencyDiscount()}`,
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
      "I understand this is a quote request and is not confirmed until Casa Nova responds."
    ].join("\n");

    const messageEs = [
      "¡Hola Casa Nova! Quiero solicitar una cotización.",
      "",
      `Nombre: ${values.name}`,
      `Teléfono: ${values.phone}`,
      `Lugar: ${values.address || "No proporcionado"}`,
      `Paquete: ${TEXT.es.services[service]}`,
      `Frecuencia: ${values.frequency === "weekly" ? "Semanal" : values.frequency === "biweekly" ? "Cada 2 Semanas" : values.frequency === "monthly" ? "Mensual" : "Una Sola Vez"}`,
      `Descuento recurrente: $${getFrequencyDiscount()}`,
      `Canastas: ${(service === "laundry" || service === "complete") ? baskets : "No aplica"}`,
      `Extras: ${addons.length ? addons.join(", ") : "Ninguno"}`,
      `Total estimado: $${total}`,
      `Recámaras: ${values.bedrooms}`,
      `Baños: ${values.bathrooms}`,
      `Mascotas: ${values.pets === "Yes" ? "Sí" : "No"}`,
      `Detergente: ${values.detergent}`,
      `Fecha preferida: ${values.date || "Flexible"}`,
      `Notas: ${values.notes || "Ninguna"}`,
      "",
      "Entiendo que esta es una solicitud y no queda confirmada hasta que Casa Nova responda."
    ].join("\n");

    window.location.href =
      `sms:+19562722071?&body=${encodeURIComponent(currentLang === "es" ? messageEs : messageEn)}`;
  });
}
