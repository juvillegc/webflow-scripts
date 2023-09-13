import { validPhoneNumber, validateEmail } from './shared/utils.js';


const inputPhoneNumber = document.getElementById('.form-love-input__box-number');



const validateInputs = () => {
    
    inputPhoneNumber.onkeypress = validPhoneNumber;
    
}


const main = async () => {
    validateInputs();
}

main();
