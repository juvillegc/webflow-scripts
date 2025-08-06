import { validPhoneNumber, validatePhoneError } from './shared/utils.js';

const phoneInputs = document.querySelectorAll('.flower-form-input-phone');

const validatePhoneInputs = () => {
  phoneInputs.forEach((input) => {
    // Bloquear pegar/copy
    input.onpaste = (e) => e.preventDefault();
    input.oncopy = (e) => e.preventDefault();

    input.onkeypress = validPhoneNumber;
    validatePhoneError(input);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  validatePhoneInputs();
});
