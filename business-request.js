import { validPhoneNumber, validDocumentNumber, handleKeyUpThousandSeparators, onlyNumberKey, removeAllOptions, addFirstOption, normalizeTex } from './shared/utils.js';
import { getDepartments, getCities } from './services/location.service.js';

const selDepartments = document.querySelectorAll('.departamentos');
const selCities = document.querySelectorAll('.ciudades');
const inputPhoneNumber = document.querySelectorAll('.numero_celular');
const inputDocumentNumber = document.querySelectorAll('.numero_documento');
const inputDocumentText = document.querySelectorAll('.input-form-text');
const forms = document.querySelectorAll("form");

/**
 * 📌 Bloquear caracteres especiales, tildes y ñ en `.input-form-text`
 */
const restrictSpecialCharacters = (event) => {
    const invalidChars = /[^a-zA-Z0-9\s]/; // ❌ Bloquea caracteres especiales y tildes
    if (invalidChars.test(event.key)) {
        event.preventDefault();
    }
};

/**
 * 📌 Bloquear caracteres especiales y letras en inputs numéricos
 */
const restrictToNumbers = (event) => {
    if (!/^\d$/.test(event.key)) {
        event.preventDefault();
    }
};

/**
 * 📌 Bloquear copiar, pegar y auto-rellenado en campos específicos
 */
const blockCopyPasteAndAutocomplete = (input) => {
    input.addEventListener("paste", (event) => event.preventDefault());
    input.addEventListener("copy", (event) => event.preventDefault());
    input.addEventListener("drop", (event) => event.preventDefault());
    input.setAttribute("autocomplete", "off"); // ❌ Bloquea auto-rellenado
    input.setAttribute("autocorrect", "off");
    input.setAttribute("spellcheck", "false");
};

/**
 * 📌 Ocultar `.direccion-completa` asegurando que Webflow lo detecte
 */
const setupDireccionCompleta = (form) => {
    const direccionCompleta = form.querySelector(".direccion-completa");
    if (!direccionCompleta) return;

    direccionCompleta.setAttribute("type", "hidden");
    direccionCompleta.style.opacity = "0";
    direccionCompleta.style.position = "absolute";
    direccionCompleta.style.left = "-9999px"; 
    direccionCompleta.style.height = "0px";
    direccionCompleta.style.width = "0px";
    direccionCompleta.style.visibility = "hidden";
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
    errorMsg.innerText = "El número debe tener 10 dígitos.";

    input.parentNode.insertBefore(errorMsg, input.nextSibling);

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
 * 📌 Validaciones de input (teléfono, documento y texto)
 */
const validateInputs = () => {
    inputPhoneNumber.forEach((input) => {
        input.onkeypress = validPhoneNumber;
        blockCopyPasteAndAutocomplete(input);
        validatePhoneNumber(input);
    });

    inputDocumentNumber.forEach((input) => {
        input.onkeypress = validDocumentNumber;
        blockCopyPasteAndAutocomplete(input);
    });

    // ❌ Bloquear copiar, pegar, caracteres especiales y tildes en `.input-form-text`
    inputDocumentText.forEach((input) => {
        input.addEventListener("keypress", restrictSpecialCharacters);
        blockCopyPasteAndAutocomplete(input);
    });

    // ❌ Aplicar restricciones a los campos de dirección
    forms.forEach((form) => {
        ["numero1", "numero2", "numero3"].forEach((className) => {
            const input = form.querySelector(`.${className}`);
            if (input) {
                input.addEventListener("keypress", restrictToNumbers);
                blockCopyPasteAndAutocomplete(input);
            }
        });
    });
};

/**
 * 📌 Cargar departamentos desde la API (Eliminar Bogotá)
 */
const loadDepartments = async () => {
    const { deparments } = await getDepartments();
    
    selDepartments.forEach((selDepartment) => {
        addFirstOption('Seleccione el departamento', selDepartment);
        selDepartment.setAttribute('required', 'true');

        deparments
            .filter(department => !/bogotá|bogota|bogotá d.c|bogota d.c/i.test(department.label)) 
            .forEach(department => {
                const option = document.createElement('option');
                option.value = department.id.replace(/_[a-zA-Z]+$/, "");
                option.setAttribute('key', department.key);
                option.innerHTML = department.label;
                selDepartment.appendChild(option);
            });
    });

    // 🔥 Asegurar que el placeholder de ciudad siempre esté visible
    selCities.forEach((selCity) => {
        removeAllOptions(selCity);
        addFirstOption('Seleccione la ciudad', selCity, true);
    });
};

/**
 * 📌 Cargar ciudades basadas en el departamento seleccionado
 */
const loadCities = async (keyDepartment) => {
    selCities.forEach((selCity) => {
        removeAllOptions(selCity);
        addFirstOption('Seleccione la ciudad', selCity, true); // 🔥 Placeholder fijo
        selCity.setAttribute('required', 'true');
    });

    let cities = await getCities(keyDepartment);

    if (/cundinamarca/i.test(keyDepartment)) {
        cities.unshift({ id: "bogota", label: "BOGOTA" });
    }

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.id.replace(/_[a-zA-Z]+$/, "");
        option.innerHTML = city.label;
        selCities.forEach((selCity) => {
            selCity.appendChild(option.cloneNode(true));
        });
    });
};

/**
 * 📌 Manejo del cambio de departamento
 */
const handleChangeDepartment = async (event) => {
    const selDepartment = event.target;
    const keyDepartment = selDepartment.options[selDepartment.selectedIndex].getAttribute('key');
    await loadCities(keyDepartment);
};

/**
 * 📌 Función principal
 */
const main = async () => {
    validateInputs();
    await loadDepartments();
    selDepartments.forEach((selDepartment) => selDepartment.addEventListener('change', handleChangeDepartment));
    forms.forEach(setupDireccionCompleta);
};

main();


