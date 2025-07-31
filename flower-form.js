import { validPhoneNumber, validateEmail } from './shared/utils.js';

const emailInput = document.getElementById('userEmail');
const phoneInputs = document.querySelectorAll('.flower-form-input-phone');

const validateInputs = () => {
  if (phoneInputs.length) {
    phoneInputs.forEach((input) => {
      input.onpaste = (e) => e.preventDefault();
      input.oncopy = (e) => e.preventDefault();
      input.onkeypress = validPhoneNumber;
    });
  }


  if (emailInput) {
    emailInput.onpaste = (e) => e.preventDefault();
    emailInput.oncopy = (e) => e.preventDefault();
    emailInput.oninput = validateEmail;
  }
};


document.addEventListener('DOMContentLoaded', () => {
  validateInputs();
});
