import { validPhoneNumber, validateEmail } from './shared/utils.js';

const inputPhoneNumber = document.getElementById('numero_celular');
const inputDocumentMail = document.getElementById('correo_electronico');

const validateInputs = () => {
    // Para el número celular: deshabilita copiar y pegar y valida cada tecla
    inputPhoneNumber.onpaste = (e) => e.preventDefault();
    inputPhoneNumber.oncopy = (e) => e.preventDefault();
    inputPhoneNumber.onkeypress = validPhoneNumber;
    
    // Para el correo electrónico: previene pegar y muestra alerta para obligar a digitar
    inputDocumentMail.onpaste = (e) => {
        e.preventDefault();
        alert("Por favor, digite el correo electrónico manualmente.");
    };
    inputDocumentMail.oncopy = (e) => e.preventDefault();
    
    // Validación de correo en cada cambio
    inputDocumentMail.oninput = validateEmail;
};

const main = async () => {
    validateInputs();
}

main();
