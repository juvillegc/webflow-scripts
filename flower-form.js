
import { validPhoneNumber, validDocumentNumber } from './shared/utils.js';


const inputPhoneNumber = document.getElementById('userPhone');
const inputDocumentNumber = document.getElementById('userEmail');


const validateInputs = () => {
    
    inputPhoneNumber.onkeypress = validPhoneNumber;
    

    inputDocumentNumber.onkeypress = validDocumentNumber;
    
}


const main = async () => {
    validateInputs();
}

main();
