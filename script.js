const PRICES = {
  laundry: 80,
  cleaning: 80,
  complete: 135,
  extraBasket: 15,
  addons: {
    bed: 50,
    fridge: 50,
    microwave: 20,
    pet: 25,
    kitchen: 25,
    deep: 80
  }
};

const LABELS = {
  en: {
    services: {
      laundry: "Laundry",
      cleaning: "Trailer Cleaning",
      complete: "Complete Refresh"
    },
    addons: {
      bed: "Bed Refresh",
      fridge: "Refrigerator Cleaning",
      microwave: "Microwave Cleaning",
      pet: "Pet Hair Removal",
      kitchen: "Kitchen Organization",
      deep: "Deep Clean Upgrade"
    }
  },
  es: {
    services: {
      laundry: "Lavandería",
      cleaning: "Limpieza de Tráiler",
      complete: "Paquete Completo"
    },
    addons: {
      bed: "Servicio de Cama",
      fridge: "Limpieza de Refrigerador",
      microwave: "Limpieza de Microondas",
      pet: "Eliminación de Pelo de Mascota",
      kitchen: "Organización de Cocina",
      deep: "Limpieza Profunda"
    }
  }
};

let currentLang = "en";

function translatePage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-en][data-es]").forEach(el => {
    el.textContent = el.dataset[lang];
  });

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  const name = document.getElementById("name");
  if (name) {
    name.placeholder = lang === "es" ? "Su nombre" : "Your name";
    document.getElementById("phone").placeholder = lang === "es" ? "Su número de teléfono" : "Your phone number";
    document.getElementById("address").placeholder = lang === "es" ? "Lugar del servicio" : "Service location";
    document.getElementById("notes").placeholder = lang === "es"
      ? "Instrucciones de acceso, condición, horario o solicitudes especiales"
      : "Access instructions, condition, timing, or special requests";
  }
}

document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => translatePage(btn.dataset.lang));
});

const form = document.getElementById("bookingForm");

if (form) {
  const basketSection = document.getElementById("basketSection");
  const basketsInput = document.getElementById("baskets");
  const totalElement = document.getElementById("estimatedTotal");
  const deepClean = document.getElementById("deepClean");

  function selectedService() {
    return document.querySelector('input[name="service"]:checked')?.value || "";
  }

  function calculateTotal() {
    const service = selectedService();
    let total = service ? PRICES[service] : 0;
    const baskets = Math.max(1, Number(basketsInput.value || 1));

    if (service === "laundry" || service === "complete") {
      total += Math.max(0, baskets - 1) * PRICES.extraBasket;
    }

    document.querySelectorAll(".addon-choice input:checked").forEach(input => {
      total += PRICES.addons[input.value];
    });

    totalElement.textContent = `$${total}`;
    return total;
  }

  function updateBasketSection() {
    const service = selectedService();
    const visible = service === "laundry" || service === "complete";
    basketSection.style.display = visible ? "grid" : "none";

    if (!visible) {
      basketsInput.value = 1;
    }

    calculateTotal();
  }

  document.querySelectorAll(".service-choice").forEach(choice => {
    const input = choice.querySelector('input[name="service"]');

    choice.addEventListener("click", event => {
      if (input.checked) {
        event.preventDefault();
        input.checked = false;
        updateBasketSection();
      } else {
        setTimeout(updateBasketSection, 0);
      }
    });

    input.addEventListener("change", updateBasketSection);
  });

  basketsInput.addEventListener("input", calculateTotal);

  document.querySelectorAll(".addon-choice input").forEach(input => {
    input.addEventListener("change", calculateTotal);
  });

  deepClean.addEventListener("change", () => {
    ["bed", "fridge", "microwave"].forEach(value => {
      const input = document.querySelector(`.addon-choice input[value="${value}"]`);

      if (deepClean.checked) {
        input.checked = false;
      }

      input.disabled = deepClean.checked;
    });

    calculateTotal();
  });

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get("service");

  if (requestedService && PRICES[requestedService]) {
    const input = document.querySelector(`input[name="service"][value="${requestedService}"]`);
    if (input) input.checked = true;
  }

  updateBasketSection();

  form.addEventListener("submit", event => {
    event.preventDefault();

    const service = selectedService();

    if (!service) {
      alert(currentLang === "es" ? "Seleccione un servicio." : "Please select a service.");
      return;
    }

    const total = calculateTotal();
    const baskets = Math.max(1, Number(basketsInput.value || 1));
    const addons = [...document.querySelectorAll(".addon-choice input:checked")]
      .map(input => LABELS[currentLang].addons[input.value]);

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
      "Hi Casa Nova! I would like to request a quote.",
      "",
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      `Location: ${values.address || "Not provided"}`,
      `Service: ${LABELS.en.services[service]}`,
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
    ];

    const linesEs = [
      "¡Hola Casa Nova! Quiero solicitar una cotización.",
      "",
      `Nombre: ${values.name}`,
      `Teléfono: ${values.phone}`,
      `Lugar: ${values.address || "No proporcionado"}`,
      `Servicio: ${LABELS.es.services[service]}`,
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
    ];

    const message = (currentLang === "es" ? linesEs : linesEn).join("\n");
    window.location.href = `sms:+19562722071?&body=${encodeURIComponent(message)}`;
  });
}