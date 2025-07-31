import { validPhoneNumber, validateEmail, validatePhoneError } from './shared/utils.js';

const emailInput = document.getElementById('userEmail');
const phoneInputs = document.querySelectorAll('.flower-form-input-phone');

const validateInputs = () => {
  phoneInputs.forEach((input) => {
    input.onpaste = (e) => e.preventDefault();
    input.oncopy = (e) => e.preventDefault();
    input.onkeypress = validPhoneNumber;
    
    // ✅ Mensaje de error visual personalizado
    validatePhoneError(input);
  });

  if (emailInput) {
    emailInput.onpaste = (e) => e.preventDefault();
    emailInput.oncopy = (e) => e.preventDefault();
    emailInput.oninput = validateEmail;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  validateInputs();
});
