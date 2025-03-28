import { validPhoneNumber, validDocumentNumber, handleKeyUpThousandSeparators, onlyNumberKey, removeAllOptions, addFirstOption, normalizeTex } from './shared/utils.js';
import { getDepartments, getCities } from './services/location.service.js';

const selDepartments = document.querySelectorAll('.departamentos');
const selCities = document.querySelectorAll('.ciudades');
const inputPhoneNumber = document.querySelectorAll('.numero_celular');
const inputDocumentNumber = document.querySelectorAll('.numero_documento');
const inputDocumentText = document.querySelectorAll('.input-form-text');
const forms = document.querySelectorAll("form");

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
const blockCopyPaste = (input) => {
    input.addEventListener("paste", (event) => event.preventDefault());
    input.addEventListener("copy", (event) => event.preventDefault());
    input.addEventListener("drop", (event) => event.preventDefault());
    input.setAttribute("autocomplete", "off");
    input.setAttribute("autocorrect", "off");
    input.setAttribute("spellcheck", "false");
};

/**
 * 📌 Normalizar `.input-form-text` (eliminar tildes y ñ)
 */
const normalizeInputText = (event) => {
    event.target.value = normalizeTex(event.target.value);
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
        blockCopyPaste(input);
        validatePhoneNumber(input);
    });

    inputDocumentNumber.forEach((input) => {
        input.onkeypress = validDocumentNumber;
        blockCopyPaste(input);
    });

    // ❌ Bloquear copiar, pegar y normalizar caracteres en `.input-form-text`
    inputDocumentText.forEach((input) => {
        input.addEventListener("input", normalizeInputText);
        blockCopyPaste(input);
    });

    // ❌ Aplicar restricciones a los campos de dirección
    forms.forEach((form) => {
        ["numero1", "numero2", "numero3"].forEach((className) => {
            const input = form.querySelector(`.${className}`);
            if (input) {
                input.addEventListener("keypress", restrictToNumbers);
                blockCopyPaste(input);
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
                option.value = normalizeTex(department.id.replace(/_[a-zA-Z]+$/, "")); // 🔥 Normalización
                option.setAttribute('key', department.key);
                option.innerHTML = normalizeTex(department.label); // 🔥 Normalización
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
        option.value = normalizeTex(city.id.replace(/_[a-zA-Z]+$/, "")); // 🔥 Normalización
        option.innerHTML = normalizeTex(city.label); // 🔥 Normalización
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
 * 📌 Generar dirección completa en Webflow
 */
const generateAddress = (form) => {
    const direccionCompleta = form.querySelector(".direccion-completa");
    if (!direccionCompleta) return;

    let direccion = [];
    const numero1 = form.querySelector(".numero1");
    const letra1 = form.querySelector(".letra1");
    const complemento1 = form.querySelector(".complemento1");

    const numero2 = form.querySelector(".numero2");
    const letra2 = form.querySelector(".letra2");
    const complemento2 = form.querySelector(".complemento2");

    const numero3 = form.querySelector(".numero3");

    if (numero1?.value.trim()) {
        direccion.push(`${numero1.value} ${letra1?.value || ""} ${complemento1?.value || ""}`.trim());
    }
    if (numero2?.value.trim()) {
        direccion.push(`#${numero2.value} ${letra2?.value || ""} ${complemento2?.value || ""}`.trim());
    }
    if (numero3?.value.trim()) {
        direccion.push(`- ${numero3.value}`.trim());
    }

    direccionCompleta.value = direccion.join(" ");
    direccionCompleta.dispatchEvent(new Event("input", { bubbles: true }));
    direccionCompleta.dispatchEvent(new Event("change", { bubbles: true }));
};

/**
 * 📌 Inicializar eventos en cada formulario
 */
const initFormHandlers = () => {
    forms.forEach((form) => {
        setupDireccionCompleta(form);
        const submitButton = form.querySelector("input[type='submit']");
        if (!submitButton) return;
        submitButton.addEventListener("click", () => generateAddress(form));
    });
};

/**
 * 📌 Función principal
 */
const main = async () => {
    validateInputs();
    await loadDepartments();
    selDepartments.forEach((selDepartment) => selDepartment.addEventListener('change', handleChangeDepartment));
    initFormHandlers();
};

main();

