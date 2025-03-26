import { validPhoneNumber, validateEmail, validDocumentNumber } from './shared/utils.js';

const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentMail = document.getElementById('correo_electronico');
const inputDocumentNumber = document.getElementById('numero_documento');

const validateInputs = () => {
    inputPhoneNumber?.addEventListener('keypress', validPhoneNumber);     
    inputDocumentMail?.addEventListener('input', validateEmail);          
    inputDocumentNumber?.addEventListener('keypress', validDocumentNumber); 
};

const main = async () => {
    validateInputs();
};

main();
