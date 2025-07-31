import { validPhoneNumber, validateEmail } from './shared/utils.js';


const inputEmails = document.querySelectorAll('#userEmail');
const phoneInputs = Array.from(document.querySelectorAll('input')).filter(input =>
  input.classList.contains('userPhone')
);

const validateInputs = () => {
  phoneInputs.forEach((input) => {
    input.onpaste = (e) => e.preventDefault();
    input.oncopy  = (e) => e.preventDefault();
    input.onkeypress = validPhoneNumber;
  });

  inputEmails.forEach((input) => {
    input.onpaste = (e) => e.preventDefault();
    input.oncopy  = (e) => e.preventDefault();
    input.oninput = validateEmail;
  });
};

const main = () => {
  validateInputs();
};

main();
