const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav-links');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});

document.querySelectorAll('.select-service').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('service').value = button.dataset.service;
    document.getElementById('book').scrollIntoView({behavior:'smooth'});
  });
});

document.getElementById('bookingForm').addEventListener('submit', event => {
  event.preventDefault();
  const addons = [...document.querySelectorAll('.addon input:checked')].map(x => x.value);
  const values = {
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    service: document.getElementById('service').value,
    baskets: document.getElementById('baskets').value,
    pets: document.getElementById('pets').value,
    date: document.getElementById('date').value,
    notes: document.getElementById('notes').value.trim()
  };
  const message = [
    'Hi Casa Nova! I would like to request a booking.',
    '',
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    `Location: ${values.address || 'Not provided'}`,
    `Service: ${values.service}`,
    `Laundry baskets: ${values.baskets}`,
    `Pets: ${values.pets}`,
    `Preferred date: ${values.date || 'Flexible'}`,
    `Add-ons: ${addons.length ? addons.join(', ') : 'None'}`,
    `Notes: ${values.notes || 'None'}`
  ].join('\n');
  window.location.href = `sms:+19562722071?&body=${encodeURIComponent(message)}`;
});

document.getElementById('year').textContent = new Date().getFullYear();
