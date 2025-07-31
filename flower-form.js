import { validPhoneNumber, validateEmail } from './shared/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const phoneInputs = document.querySelectorAll('.userPhone');
  const emailInput  = document.getElementById('userEmail');

  // ✅ Teléfonos
  phoneInputs.forEach((input) => {
    input.onpaste = (e) => e.preventDefault();
    input.oncopy  = (e) => e.preventDefault();
    input.onkeypress = validPhoneNumber;
  });

  // ✅ Email
  if (emailInput) {
    emailInput.onpaste = (e) => e.preventDefault();
    emailInput.oncopy  = (e) => e.preventDefault();
    emailInput.oninput = validateEmail;
  }
});

