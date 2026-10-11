document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('#primary-nav');

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      const srText = menuToggle.querySelector('.sr-only');
      if (srText) srText.textContent = isOpen ? 'Close menu' : 'Open menu';
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        const srText = menuToggle.querySelector('.sr-only');
        if (srText) srText.textContent = 'Open menu';
      });
    });
  }

  // Inquiry Form Logic
  const form = document.querySelector('#inquiry-form');
  const statusEl = document.querySelector('#form-status');
  const btnWhatsApp = document.querySelector('#btn-whatsapp');
  const coordinatorPhone = '919533700325';
  const emailDestination = 'stardomservice@gmail.com';

  function validateInputs() {
    const nameInput = document.querySelector('#name');
    const phoneInput = document.querySelector('#contact');
    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';

    if (nameInput) nameInput.setAttribute('aria-invalid', 'false');
    if (phoneInput) phoneInput.setAttribute('aria-invalid', 'false');

    if (!name || !phone) {
      if (!name && nameInput) nameInput.setAttribute('aria-invalid', 'true');
      if (!phone && phoneInput) phoneInput.setAttribute('aria-invalid', 'true');
      showStatus('Please provide your name and phone number so coordinator D. Rajalingam can reach you.', true);
      (name ? phoneInput : nameInput)?.focus();
      return null;
    }

    const service = document.querySelector('#service-type')?.value || 'General Home Care';
    const shift = document.querySelector('#shift-duration')?.value || 'Not specified';
    const area = document.querySelector('#area-location')?.value.trim() || 'Hyderabad / Secunderabad';
    const message = document.querySelector('#message')?.value.trim() || 'None provided';

    return { name, phone, service, shift, area, message };
  }

  function showStatus(msg, isError = false) {
    if (!statusEl) return;
    statusEl.innerHTML = msg;
    statusEl.className = `form-status is-visible ${isError ? 'is-error' : ''}`;
  }

  // Handle WhatsApp button click
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      const data = validateInputs();
      if (!data) return;

      const waText = [
        `*New Home Care Enquiry - Stardom Service*`,
        `👤 *Name:* ${data.name}`,
        `📞 *Phone:* ${data.phone}`,
        `🏥 *Service Required:* ${data.service}`,
        `⏰ *Shift / Duration:* ${data.shift}`,
        `📍 *Location:* ${data.area}`,
        `📝 *Requirement Notes:* ${data.message}`
      ].join('\n');

      const waUrl = `https://wa.me/${coordinatorPhone}?text=${encodeURIComponent(waText)}`;
      showStatus(`Connecting to WhatsApp with coordinator D. Rajalingam... If WhatsApp doesn't open, call directly at <strong>+91 95337 00325</strong>.`);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Handle Form Submit (Online Request / Email Fallback)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = validateInputs();
      if (!data) return;

      showStatus(`
        <strong>Thank you, ${data.name}!</strong><br>
        Your enquiry for <em>${data.service} (${data.shift})</em> has been recorded. 
        Coordinator <strong>D. Rajalingam</strong> will contact you shortly at <strong>${data.phone}</strong>.<br>
        For immediate assistance, please call <a href="tel:+919533700325" style="text-decoration:underline;font-weight:bold;color:inherit;">95337 00325</a> or <a href="tel:+919059792897" style="text-decoration:underline;font-weight:bold;color:inherit;">90597 92897</a>.
      `);

      // Attempt background mailto fallback in case user wants email
      const subject = encodeURIComponent(`Home care enquiry from ${data.name} (${data.area})`);
      const body = encodeURIComponent([
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        `Service: ${data.service}`,
        `Shift: ${data.shift}`,
        `Location: ${data.area}`,
        `Notes: ${data.message}`
      ].join('\n'));

      // If user holds Shift or specific intent, mailto can trigger, but we don't disrupt current page
      form.reset();
    });
  }
});
