import { validPhoneNumber, validateEmail } from './shared/utils.js';


const inputPhoneNumber = document.getElementById('numero_celular_love');


const validateInputs = () => {
    
    inputPhoneNumber.onkeypress = validPhoneNumber;
    
}


const main = async () => {
    validateInputs();
}

main();
