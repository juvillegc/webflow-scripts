import { validPhoneNumber, validDocumentNumber, validateEmail } from './shared/utils.js';
import { inputEvent } from './shared/date-format.js';

const waitForElement = (id, callback) => {
    const element = document.getElementById(id);
    if (element) {
        callback(element);
    }
};

const validatePhoneNumber = (event) => {
    const input = event.target;
    const regex = /^[0-9]$/; // Solo permite un solo número por tecla presionada
    const maxLength = 8;

    // Bloquear caracteres que no sean números o sean espacios
    if (!regex.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
    }

    // Restringir la longitud a 8 caracteres
    if (input.value.length >= maxLength && event.key !== "Backspace") {
        event.preventDefault();
    }
};

const handlePhoneInput = (event) => {
    const input = event.target;
    const maxLength = 8;

    // Remover espacios automáticamente
    input.value = input.value.replace(/\s+/g, '');

    // Si el usuario ingresa más de 8 números, cortar el exceso
    if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
    }

    // Mostrar alerta si el número no tiene exactamente 8 caracteres
    if (input.value.length < maxLength) {
        input.setCustomValidity("El número debe tener exactamente 8 dígitos.");
    } else {
        input.setCustomValidity("");
    }
};

const disablePaste = (event) => {
    event.preventDefault();
};

const validateInputs = () => {
    waitForElement('numero_celular', (input) => {
        input.onkeypress = validatePhoneNumber;
        input.oninput = handlePhoneInput;
        input.onpaste = disablePaste;
        input.oncut = disablePaste;
        input.ondrop = disablePaste;
        input.onkeydown = (event) => {
            if (event.key === " ") event.preventDefault(); // Evita que se escriban espacios con la barra espaciadora
        };
    });

    waitForElement('fecha_nacimiento', (input) => input.oninput = inputEvent);
    waitForElement('numero_documento', (input) => input.onkeypress = validDocumentNumber);
    waitForElement('correo_electronico', (input) => input.oninput = validateEmail);
};

const main = async () => {
    validateInputs();
};

main();
