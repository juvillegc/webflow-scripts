import { validPhoneNumber, validDocumentNumber } from './shared/utils.js';

const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentNumber = document.getElementById('numero_documento');

// Creamos un <small> para mostrar errores visuales
const phoneError = document.createElement('small');
phoneError.classList.add('error-message');
inputPhoneNumber.insertAdjacentElement('afterend', phoneError);

const checkPhoneLength = () => {
  const phone = inputPhoneNumber.value.trim();

  if (phone.length === 0) {
    phoneError.textContent = '';
    inputPhoneNumber.classList.remove('input-error');
    return;
  }

  if (phone.length !== 10) {
    phoneError.textContent = '📱 El número debe tener exactamente 10 dígitos.';
    inputPhoneNumber.classList.add('input-error');
  } else {
    phoneError.textContent = '';
    inputPhoneNumber.classList.remove('input-error');
  }
};

const validateInputs = () => {
  inputPhoneNumber.onkeypress = validPhoneNumber;
  inputDocumentNumber.onkeypress = validDocumentNumber;

  inputPhoneNumber.addEventListener('input', checkPhoneLength);
};

const main = async () => {
  validateInputs();
};

main();
