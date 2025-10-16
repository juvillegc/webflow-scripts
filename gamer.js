import { validPhoneNumber, validDocumentNumber } from './shared/utils.js';

// ==========================
//   Campos del formulario
// ==========================
const inputDocumentNumber = document.getElementById('numero_documento');
const selectRRSS = document.getElementById('select-rrss');
const inputURL = document.getElementById('url-rrss');

const divRRSS = document.getElementById('div-rrss');
const divWhatsapp = document.getElementById('div-whatsaap');
const phoneInputs = document.querySelectorAll('.numero_celular');

// ==========================
//   Validación celular global
// ==========================
const setupPhoneValidation = (input) => {
  // Crear mensaje de error si no existe
  if (!input.parentNode.querySelector('.error-message')) {
    const phoneError = document.createElement('small');
    phoneError.classList.add('error-message');
    phoneError.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.classList.add('input-wrapper');

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(phoneError);
  }

  // Asignar validaciones
  input.addEventListener('input', () => {
    const phoneError = input.parentNode.querySelector('.error-message');
    const phone = input.value.trim();

    if (phone.length === 0) {
      phoneError.textContent = '';
      input.classList.remove('input-error');
      return;
    }

    if (phone.length !== 10) {
      phoneError.textContent = 'Debe tener exactamente 10 dígitos.';
      input.classList.add('input-error');
    } else {
      phoneError.textContent = '';
      input.classList.remove('input-error');
    }
  });

  input.onkeypress = validPhoneNumber;
};

// ==========================
//   Control de visibilidad y obligatoriedad
// ==========================
const handleRRSSChange = (event) => {
  const selectedValue = event.target.value.trim().toLowerCase();

  const rrssInput = divRRSS ? divRRSS.querySelector('.numero_celular') : null;
  const whatsappInput = divWhatsapp ? divWhatsapp.querySelector('.numero_celular') : null;

  // --- Caso: WhatsApp ---
  if (selectedValue === 'whatsapp') {
    if (divRRSS) divRRSS.style.display = 'none';
    if (divWhatsapp) divWhatsapp.style.display = 'block';

    if (whatsappInput) whatsappInput.required = true;
    if (rrssInput) rrssInput.required = false;

    // 👇 URL no aplica, quitamos el required
    if (inputURL) inputURL.required = false;
    if (inputURL) inputURL.value = 'N/A';
    inputURL.setAttribute('readonly', true);

  } else {
    // --- Caso: otra red ---
    if (divRRSS) divRRSS.style.display = 'block';
    if (divWhatsapp) divWhatsapp.style.display = 'none';

    if (rrssInput) rrssInput.required = true;
    if (whatsappInput) whatsappInput.required = false;

    // 👇 Volvemos a activar el campo URL
    if (inputURL) {
      inputURL.required = true;
      inputURL.removeAttribute('readonly');
      inputURL.value = '';
    }
  }
};

// ==========================
//   Inicialización
// ==========================
const validateInputs = () => {
  // Validar documento
  if (inputDocumentNumber) inputDocumentNumber.onkeypress = validDocumentNumber;

  // Configurar validación en todos los inputs de celular
  phoneInputs.forEach((input) => setupPhoneValidation(input));

  // Controlar el cambio del select
  if (selectRRSS) selectRRSS.addEventListener('change', handleRRSSChange);

  // Estado inicial
  if (divRRSS) divRRSS.style.display = 'block';
  if (divWhatsapp) divWhatsapp.style.display = 'none';
};

const main = async () => {
  validateInputs();
};

main();
