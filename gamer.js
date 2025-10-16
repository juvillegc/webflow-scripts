import { validPhoneNumber, validDocumentNumber } from './shared/utils.js';

const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentNumber = document.getElementById('numero_documento');

// --- Función para validar longitud del número ---
const checkPhoneLength = () => {
  const phone = inputPhoneNumber.value.trim();

  if (phone.length !== 10) {
    alert('📱 El número de celular debe tener exactamente 10 dígitos.');
    inputPhoneNumber.focus();
    return false;
  }

  return true;
};

// --- Inicializa validaciones de campos ---
const validateInputs = () => {
  inputPhoneNumber.onkeypress = validPhoneNumber;
  inputDocumentNumber.onkeypress = validDocumentNumber;

  // Al salir del campo o enviar formulario, validamos
  inputPhoneNumber.addEventListener('blur', checkPhoneLength);
};

// --- Punto de entrada principal ---
const main = async () => {
  validateInputs();
};

main();
