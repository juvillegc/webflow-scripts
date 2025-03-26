import { validPhoneNumber, validateEmail, validDocumentNumber } from './shared/utils.js';

const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentMail = document.getElementById('correo_electronico');
const inputDocumentNumber = document.getElementById('numero_documento');

const validateInputs = () => {
    inputPhoneNumber?.addEventListener('keypress', (e) => {
        if (!validPhoneNumber(e)) {
            e.preventDefault();
        }
    });

    inputDocumentMail?.addEventListener('input', validateEmail);

    inputDocumentNumber?.addEventListener('keypress', (e) => {
        if (!validDocumentNumber(e)) {
            e.preventDefault();
        }
    });
};

const main = async () => {
    validateInputs();
};

main();
