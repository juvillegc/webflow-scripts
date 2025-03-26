import { validPhoneNumber, validateEmail, validDocumentNumber } from './shared/utils.js';

const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentMail = document.getElementById('correo_electronico');
const inputDocumentNumber = document.querySelectorAll('.numero_documento');

const validateInputs = () => {
    inputPhoneNumber?.addEventListener('input', validPhoneNumber);
    inputDocumentMail?.addEventListener('input', validateEmail);

    inputDocumentNumber.forEach((input) => {
        input.addEventListener('keypress', validDocumentNumber);
    });
};

const main = async () => {
    validateInputs();
};

main();
