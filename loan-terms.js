import { validPhoneNumber, validDocumentNumber } from './shared/utils.js';


const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentNumber = document.getElementById('numero_documento_loan');


const validateInputs = () => {
    
    inputPhoneNumber.onkeypress = validPhoneNumber;
    
    inputDocumentNumber.onkeypress = validDocumentNumber;
    
}


const main = async () => {
    validateInputs();
}

main();
