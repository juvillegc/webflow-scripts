import { validPhoneNumber, validDocumentNumber } from './shared/utils.js';

// ==========================
//   Campos del formulario
// ==========================
const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentNumber = document.getElementById('numero_documento');
const selectRRSS = document.getElementById('select-rrss');
const inputURL = document.getElementById('url-rrss');

// Nuevos elementos
const divRRSS = document.getElementById('div-rrss');
const divWhatsapp = document.getElementById('div-whatsaap');
const phoneInputs = document.querySelectorAll('.numero_celular'); // Los dos inputs de cel

// ==========================
//   Validación celular (mismo comportamiento)
// ==========================
const phoneError = document.createElement('small');
phoneError.classList.add('error-message');
phoneError.textContent = '';

const wrapper = document.createElement('div');
wrapper.classList.add('input-wrapper');
inputPhoneNumber.parentNode.insertBefore(wrapper, inputPhoneNumber);
wrapper.appendChild(inputPhoneNumber);
wrapper.appendChild(phoneError);

const checkPhoneLength = (input) => {
  const phone = input.value.trim();

  // Limpia errores previos
  const errorMsg = input.parentNode.querySelector('.error-message');
  if (!errorMsg) return;

  if (phone.length === 0) {
    errorMsg.textContent = '';
    input.classList.remove('input-error');
    return;
  }

  if (phone.length !== 10) {
    errorMsg.textContent = 'Debe tener exactamente 10 dígitos.';
    input.classList.add('input-error');
  } else {
    errorMsg.textContent = '';
    input.classList.remove('input-error');
  }
};

// ==========================
//   Control de visibilidad y obligatoriedad
// ==========================
const handleRRSSChange = (event) => {
  const selectedValue = event.target.value.trim().toLowerCase();

  if (selectedValue === 'whatsapp') {
    // Mostrar campo de WhatsApp
    divRRSS.style.display = 'none';
    divWhatsapp.style.display = 'block';

    // Hacer obligatorio el input dentro de div-whatsaap
    const whatsappInput = divWhatsapp.querySelector('.numero_celular');
    if (whatsappInput) whatsappInput.required = true;

    // Desactivar obligatoriedad del otro campo
    const rrssInput = divRRSS.querySelector('.numero_celular');
    if (rrssInput) rrssInput.required = false;
  } else {
    // Volver al modo normal
    divRRSS.style.display = 'block';
    divWhatsapp.style.display = 'none';

    const rrssInput = divRRSS.querySelector('.numero_celular');
    if (rrssInput) rrssInput.required = true;

    const whatsappInput = divWhatsapp.querySelector('.numero_celular');
    if (whatsappInput) whatsappInput.required = false;
  }
};

// ==========================
//   Inicialización
// ==========================
const validateInputs = () => {
  inputPhoneNumber.onkeypress = validPhoneNumber;
  inputDocumentNumber.onkeypress = validDocumentNumber;

  // Validar ambos inputs de celular
  phoneInputs.forEach((input) => {
    input.addEventListener('input', () => checkPhoneLength(input));
  });

  // Controlar el cambio del select
  if (selectRRSS) {
    selectRRSS.addEventListener('change', handleRRSSChange);
  }

  // Estado inicial → mostrar RRSS y ocultar WhatsApp
  divRRSS.style.display = 'block';
  divWhatsapp.style.display = 'none';
};

const main = async () => {
  validateInputs();
};

main();
