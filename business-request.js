import { validPhoneNumber, validDocumentNumber, handleKeyUpThousandSeparators, onlyNumberKey, removeAllOptions, addFirstOption, normalizeTex } from './shared/utils.js';
import { getDepartments, getCities } from './services/location.service.js';

import { 
    validPhoneNumber, 
    validDocumentNumber, 
    removeAllOptions, 
    addFirstOption, 
    normalizeTex 
} from './shared/utils.js';

import { getDepartments, getCities } from './services/location.service.js';

// 🔹 Selección de elementos
const selDepartments = document.querySelectorAll('.departamentos');
const selCities = document.querySelectorAll('.ciudades');
const inputPhoneNumber = document.querySelectorAll('.numero_celular');
const inputDocumentNumber = document.querySelectorAll('.numero_documento');
const inputDocumentText = document.querySelectorAll('.input-form-text');
const forms = document.querySelectorAll("form");

/**
 * 📌 Bloquear caracteres especiales y letras en inputs de número
 */
const restrictToNumbers = (event) => {
    if (!/^\d$/.test(event.key)) {
        event.preventDefault();
    }
};

/**
 * 📌 Bloquear copiar y pegar en campos de números
 */
const blockCopyPaste = (input) => {
    input.addEventListener("paste", (event) => event.preventDefault());
    input.addEventListener("copy", (event) => event.preventDefault());
    input.addEventListener("drop", (event) => event.preventDefault());
};

/**
 * 📌 Validar que el número de celular tenga 10 dígitos y mostrar error
 */
const validatePhoneNumber = (input) => {
    let errorMsg = document.createElement("span");
    errorMsg.classList.add("error-msg");
    errorMsg.style.color = "red";
    errorMsg.style.fontSize = "12px";
    errorMsg.style.display = "none";
    errorMsg.innerText = "El número debe tener 10 dígitos";

    input.parentNode.insertBefore(errorMsg, input.nextSibling); // Insertar debajo del input

    input.addEventListener("input", () => {
        if (input.value.length < 10) {
            input.style.border = "2px solid red";
            errorMsg.style.display = "block";
            input.setCustomValidity("El número debe tener 10 dígitos.");
        } else {
            input.style.border = "";
            errorMsg.style.display = "none";
            input.setCustomValidity("");
        }
    });
};

/**
 * 📌 Validaciones de input (teléfono y documento)
 */
const validateInputs = () => {
    inputPhoneNumber.forEach((input) => {
        input.onkeypress = validPhoneNumber;
        blockCopyPaste(input);
        validatePhoneNumber(input);
    });

    inputDocumentNumber.forEach((input) => {
        input.onkeypress = validDocumentNumber;
        blockCopyPaste(input);
    });

    // ❌ Bloquear copiar y pegar en `.input-form-text`
    inputDocumentText.forEach(blockCopyPaste);
};

/**
 * 📌 Inicializar eventos en cada formulario
 */
const initFormHandlers = () => {
    forms.forEach((form, index) => {
        console.log(`🔹 Configurando formulario #${index + 1}`);

        const submitButton = form.querySelector("input[type='submit']");
        if (!submitButton) {
            console.error(`❌ No se encontró el botón de envío en el formulario #${index + 1}`);
            return;
        }

        // ✅ Aplicar restricciones en campos de número
        const numeros = form.querySelectorAll(".numero1, .numero2, .numero3");
        numeros.forEach(input => {
            if (!input) return;
            input.addEventListener("keypress", restrictToNumbers);
            blockCopyPaste(input);
        });
    });
};

/**
 * 📌 Función principal
 */
const main = async () => {
    validateInputs();
    initFormHandlers();
};

main();

