import { validPhoneNumber, validDocumentNumber } from './shared/utils.js';

const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentNumber = document.getElementById('numero_documento');

// Creamos el mensaje de error
const phoneError = document.createElement('small');
phoneError.classList.add('error-message');
phoneError.textContent = ''; // empieza oculto

// Envolvemos el input en un contenedor para controlar mejor el layout
const wrapper = document.createElement('div');
wrapper.classList.add('input-wrapper');
inputPhoneNumber.parentNode.insertBefore(wrapper, inputPhoneNumber);
wrapper.appendChild(inputPhoneNumber);
wrapper.appendChild(phoneError);

const checkPhoneLength = () => {
  const phone = inputPhoneNumber.value.trim();

  if (phone.length === 0) {
    phoneError.textContent = '';
    inputPhoneNumber.classList.remove('input-error');
    return;
  }

  if (phone.length !== 10) {
    phoneError.textContent = 'Debe tener exactamente 10 dígitos.';
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
