import { validPhoneNumber, validateEmail, validDocumentNumber, onlyNumberKey } from './shared/utils.js';

const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentMail = document.getElementById('correo_electronico');
const inputDocumentNumber = document.querySelectorAll('.numero_documento');



const validateInputs = () => {
    
   inputPhoneNumber.forEach((input) => {
        input.onkeypress = validPhoneNumber;
    });
    
    inputDocumentMail.oninput = validateEmail;

    inputDocumentNumber.onkeypress = validDocumentNumber;
    
}

const main = async () => {
    validateInputs();
};

main();


