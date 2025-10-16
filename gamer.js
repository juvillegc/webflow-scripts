import { validPhoneNumber, validDocumentNumber } from './shared/utils.js';

// ==========================
//   Campos del formulario
// ==========================
const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentNumber = document.getElementById('numero_documento');
const selectRRSS = document.getElementById('select-rrss');
const inputURL = document.getElementById('url-rrss');

// ==========================
//   Validación celular
// ==========================

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

// ==========================
//   Autocompletar red social
// ==========================
const handleRRSSChange = (event) => {
  const selectedValue = event.target.value.trim().toLowerCase();

  if (selectedValue === 'whatsapp') {
    inputURL.value = 'N/A';
    inputURL.setAttribute('readonly', true);

    //Fuerza a Webflow a reconocer el cambio como válido
    const inputEvent = new Event('input', { bubbles: true });
    inputURL.dispatchEvent(inputEvent);
  } else {
    inputURL.value = '';
    inputURL.removeAttribute('readonly');
  }
};

// ==========================
//   Inicialización
// ==========================
const validateInputs = () => {
  inputPhoneNumber.onkeypress = validPhoneNumber;
  inputDocumentNumber.onkeypress = validDocumentNumber;

  inputPhoneNumber.addEventListener('input', checkPhoneLength);

  if (selectRRSS && inputURL) {
    selectRRSS.addEventListener('change', handleRRSSChange);
  }
};

const main = async () => {
  validateInputs();
};

main();
