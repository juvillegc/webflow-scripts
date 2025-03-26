import { validPhoneNumber, validateEmail, validDocumentNumber, onlyNumberKey } from './shared/utils.js';

const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentMail = document.getElementById('correo_electronico');
const inputDocumentNumber = document.querySelectorAll('.numero_documento');

const validateInputs = () => {
    // Validar campo número de celular
    if (inputPhoneNumber) {
        inputPhoneNumber.addEventListener('paste', (e) => e.preventDefault());
        inputPhoneNumber.addEventListener('copy', (e) => e.preventDefault());
        inputPhoneNumber.addEventListener('keypress', validPhoneNumber);
    }

    // Validar campo de correo electrónico
    if (inputDocumentMail) {
        inputDocumentMail.addEventListener('paste', (e) => e.preventDefault());
        inputDocumentMail.addEventListener('copy', (e) => e.preventDefault());
        inputDocumentMail.addEventListener('input', validateEmail);
    }

    // Validar campos de número de documento
    if (inputDocumentNumber.length > 0) {
        inputDocumentNumber.forEach((input) => {
            input.addEventListener('keypress', (e) => {
                validDocumentNumber(e);
                onlyNumberKey(e);
            });
        });
    }
};

const main = async () => {
    validateInputs();
};

main();
