
import { validPhoneNumber, validateEmail } from './shared/utils.js';


const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentMail = document.getElementById('correo_electronico');


const validateInputs = () => {
    
    inputPhoneNumber.onkeypress = validPhoneNumber;
    
    inputDocumentMail.oninput = validateEmail;
    
}


const main = async () => {
    validateInputs();
}

main();
