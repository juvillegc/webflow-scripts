import { validPhoneNumber,  validateEmail, validDocumentNumber, onlyNumberKey } from './shared/utils.js';

const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentMail = document.getElementById('correo_electronico');
const inputDocumentNumber = document.getElementById('numero_documento');

const validateInputs = () => {
    // Deshabilitar copiar y pegar en el campo de celular
    inputPhoneNumber.onpaste = (e) => e.preventDefault();
    inputPhoneNumber.oncopy = (e) => e.preventDefault();
    inputPhoneNumber.onkeypress = validPhoneNumber;
    
    // Deshabilitar copiar y pegar en el campo de correo electrónico y validar
    inputDocumentMail.onpaste = (e) => e.preventDefault();
    inputDocumentMail.oncopy = (e) => e.preventDefault();
    inputDocumentMail.oninput = validateEmail;

    inputDocumentNumber.onkeypress = (e) => {
        validDocumentNumber(e);
        onlyNumberKey(e);
    };
};

const main = async () => {
    validateInputs();
};

main();
