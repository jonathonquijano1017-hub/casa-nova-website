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
  const deepClean = document.getElementById("deepClean");
  const clearPackageButton = document.getElementById("clearPackage");
  const clearAddonsButton = document.getElementById("clearAddons");

  function selectedService() {
    return document.querySelector('input[name="service"]:checked')?.value || "";
  }

  function getAddonsSubtotal() {
    let subtotal = 0;
    document.querySelectorAll(".addon input:checked").forEach(input => {
      subtotal += PRICES.addons[input.value];
    });
    return subtotal;
  }

  function calculateTotal() {
    const service = selectedService();
    const packageSubtotal = service ? PRICES[service] : 0;
    const baskets = Math.max(1, Number(basketInput.value || 1));
    const laundrySubtotal =
      service === "laundry" || service === "complete"
        ? Math.max(0, baskets - 1) * PRICES.extraBasket
        : 0;
    const addonsSubtotal = getAddonsSubtotal();
    const total = packageSubtotal + laundrySubtotal + addonsSubtotal;

    packageSubtotalEl.textContent = `$${packageSubtotal}`;
    laundrySubtotalEl.textContent = `$${laundrySubtotal}`;
    addonsSubtotalEl.textContent = `$${addonsSubtotal}`;
    totalEl.textContent = `$${total}`;

    clearPackageButton.classList.toggle("active", !service);
    const hasAddons = document.querySelectorAll(".addon input:checked").length > 0;
    clearAddonsButton.classList.toggle("active", !hasAddons);

    return total;
  }

  function updateBasketVisibility() {
    const service = selectedService();
    const show = service === "laundry" || service === "complete";
    basketSection.style.display = show ? "grid" : "none";
    if (!show) basketInput.value = 1;
    calculateTotal();
  }

  function clearPackageSelection() {
    document.querySelectorAll('input[name="service"]').forEach(input => {
      input.checked = false;
    });
    updateBasketVisibility();
  }

  document.querySelectorAll(".package-card:not(.package-none)").forEach(card => {
    const input = card.querySelector('input[name="service"]');
    let wasSelected = false;

    card.addEventListener("pointerdown", () => {
      wasSelected = input.checked;
    });

    card.addEventListener("click", event => {
      event.preventDefault();

      document.querySelectorAll('input[name="service"]').forEach(serviceInput => {
        serviceInput.checked = false;
      });

      if (!wasSelected) {
        input.checked = true;
      }

      updateBasketVisibility();
    });
  });

  clearPackageButton.addEventListener("click", clearPackageSelection);

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

  document.querySelectorAll(".addon input").forEach(input => {
    input.addEventListener("change", () => {
      if (input !== deepClean && input.checked) {
        clearAddonsButton.classList.remove("active");
      }
      calculateTotal();
    });
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
  if (preselected && PRICES[preselected]) {
    const input = document.querySelector(`input[name="service"][value="${preselected}"]`);
    if (input) input.checked = true;
  }

  updateBasketVisibility();
  calculateTotal();

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
      notes: document.getElementById("notes").value.trim()
    };

    const messageEn = [
      "Hi Casa Nova! I would like to request a quote.",
      "",
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Location: ${values.address || "Not provided"}`,
      `Package: ${TEXT.en.services[service]}`,
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
