import { validPhoneNumber, validDocumentNumber, validateEmail } from './shared/utils.js';
import { inputEvent } from './shared/date-format.js';

const waitForElement = (id, callback) => {
    const element = document.getElementById(id);
    if (element) {
        callback(element);
    }
};

const validateInputs = () => {
    waitForElement('numero_celular', (input) => input.onkeypress = validPhoneNumber);
    waitForElement('fecha_nacimiento', (input) => input.oninput = inputEvent);
    waitForElement('numero_documento', (input) => input.onkeypress = validDocumentNumber);
    waitForElement('correo_electronico', (input) => input.oninput = validateEmail);
};

const main = async () => {
    validateInputs();
};

main();
