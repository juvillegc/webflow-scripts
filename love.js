import { validPhoneNumber, validateEmail } from './shared/utils.js';


const inputPhoneNumber = document.querySelectorAll('.numero_celular_love');



const validateInputs = () => {
    
     inputPhoneNumber.forEach((input) => {
        input.onkeypress = inputPhoneNumber;
    });
    
}
 


const main = async () => {
    validateInputs();
}

main();
