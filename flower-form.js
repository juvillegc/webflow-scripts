import { validPhoneNumber, validateEmail } from './shared/utils.js';

const inputEmail = document.getElementById('userEmail');
const phoneInputs = document.querySelectorAll('.userPhone');

const validateInputs = () => {
  phoneInputs.forEach((input) => {
    input.onpaste = (e) => e.preventDefault();
    input.oncopy = (e) => e.preventDefault();
    input.onkeypress = validPhoneNumber;
  });

  if (inputEmail) {
    inputEmail.onpaste = (e) => e.preventDefault();
    inputEmail.oncopy = (e) => e.preventDefault();
    inputEmail.oninput = validateEmail;
  }
};

const main = () => {
  validateInputs();
};

main();
