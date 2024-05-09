import { validPhoneNumber,  validDocumentNumber, validateEmail } from './shared/utils.js';
import { inputEvent } from './shared/date-format.js';


const inputPhoneNumber = document.getElementById('numero_celular');
const inputDateTakeMoney = document.getElementById('fecha_nacimiento');
const inputDocumentNumber = document.getElementById('numero_documento');
const inputDocumentMail = document.getElementById('correo_electronico');



const validateInputs = () => {
    
    inputDocumentNumber.onkeypress = validDocumentNumber;
    inputDateTakeMoney.oninput = inputEvent;
    inputDocumentMail.oninput = validateEmail;
    inputPhoneNumber.onkeypress = validPhoneNumber;
  
    
}


const main = async () => {
    validateInputs();
}

main();
