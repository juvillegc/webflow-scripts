import { validPhoneNumber, validDocumentNumber, handleKeyUpThousandSeparators, onlyNumberKey, removeAllOptions, addFirstOption, normalizeTex } from './shared/utils.js';
import { getDepartments, getCities } from './services/location.service.js';


// 🔹 Selección de elementos
const selDepartments = document.querySelectorAll('.departamentos');
const selCities = document.querySelectorAll('.ciudades');
const inputPhoneNumber = document.querySelectorAll('.numero_celular');
const inputDocumentNumber = document.querySelectorAll('.numero_documento');
const inputDocumentText = document.querySelectorAll('.input-form-text');
const form = document.querySelector("form");

// 🔹 Inputs de dirección en Webflow
const numero1 = form?.querySelector(".numero1");
const letra1 = form?.querySelector(".letra1");
const complemento1 = form?.querySelector(".complemento1");

const numero2 = form?.querySelector(".numero2");
const letra2 = form?.querySelector(".letra2");

const numero3 = form?.querySelector(".numero3");
const direccionCompleta = form?.querySelector(".direccion-completa"); // Campo oculto

/**
 * 📌 Ocultar `.direccion-completa` asegurando que Webflow lo detecte
 */
const setupDireccionCompleta = () => {
    if (!direccionCompleta) {
        console.error("❌ No se encontró el campo direccion-completa");
        return;
    }

    direccionCompleta.setAttribute("type", "hidden");
    direccionCompleta.style.opacity = "0";
    direccionCompleta.style.position = "absolute";
    direccionCompleta.style.left = "-9999px"; 
    direccionCompleta.style.height = "0px";
    direccionCompleta.style.width = "0px";
    direccionCompleta.style.visibility = "hidden";
};

/**
 * 📌 Quitar sufijos `_dep`, `_ant`, `_xyz` de los valores seleccionados
 */
const cleanText = (text) => {
    return text.replace(/_[a-zA-Z]+$/, ""); // Elimina cualquier sufijo con `_`
};

/**
 * 📌 Validaciones de input
 */
const validateInputs = () => {
    inputPhoneNumber.forEach((input) => {
        input.onkeypress = validPhoneNumber;
        input.onpaste = (event) => event.preventDefault();
    });

    inputDocumentNumber.forEach((input) => {
        input.onkeypress = validDocumentNumber;
        input.onpaste = (event) => event.preventDefault();
    });

    // ❌ Bloquear copiar y pegar en `.input-form-text`
    inputDocumentText.forEach((input) => {
        input.addEventListener("paste", (event) => event.preventDefault());
        input.addEventListener("copy", (event) => event.preventDefault());
        input.addEventListener("drop", (event) => event.preventDefault());
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
            .filter(department => !/bogotá|bogota|bogotá d.c|bogota d.c/i.test(department.label)) // ✅ ELIMINA Bogotá sin importar mayúsculas o variaciones
            .forEach(department => {
                const option = document.createElement('option');
                option.value = cleanText(department.id);
                option.setAttribute('key', department.key);
                option.innerHTML = department.label;
                selDepartment.appendChild(option);
            });
    });
};

/**
 * 📌 Cargar ciudades basadas en el departamento seleccionado
 */
const loadCities = async (keyDepartment) => {
    selCities.forEach((selCity) => {
        removeAllOptions(selCity);
        addFirstOption('Seleccione la ciudad', selCity);
        selCity.setAttribute('required', 'true');
    });

    let cities = await getCities(keyDepartment);

    // ✅ Si el usuario elige Cundinamarca, agregamos "BOGOTÁ" manualmente
    if (/cundinamarca/i.test(keyDepartment)) {
        cities.unshift({ id: "bogota", label: "BOGOTA" });
    }

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = cleanText(city.id);
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
 * 📌 Generar dirección completa en Webflow
 */
const generateAddress = () => {
    if (!direccionCompleta) {
        console.error("❌ No se encontró el campo direccion-completa");
        return;
    }

    let direccion = [];

    if (numero1?.value.trim()) {
        direccion.push(`${numero1.value} ${letra1?.value || ""} ${complemento1?.value || ""}`.trim());
    }
    if (numero2?.value.trim()) {
        direccion.push(`#${numero2.value} ${letra2?.value || ""}`.trim());
    }
    if (numero3?.value.trim()) {
        direccion.push(`- ${numero3.value}`.trim());
    }

    direccionCompleta.value = direccion.join(" ");

    direccionCompleta.dispatchEvent(new Event("input", { bubbles: true }));
    direccionCompleta.dispatchEvent(new Event("change", { bubbles: true }));

    console.log("✅ Dirección generada:", direccionCompleta.value);
};

/**
 * 📌 Inicializar eventos en el formulario
 */
const initFormHandlers = () => {
    if (!form) return;

    const submitButton = form.querySelector("input[type='submit']");
    if (!submitButton) {
        console.error("❌ No se encontró el botón de envío");
        return;
    }

    submitButton.addEventListener("click", () => {
        console.log("📩 Botón de envío clickeado, procesando dirección...");
        generateAddress();

        setTimeout(() => {
            direccionCompleta.focus();
            direccionCompleta.blur();
        }, 200);
    });
};

/**
 * 📌 Función principal
 */
const main = async () => {
    setupDireccionCompleta(); 
    validateInputs();
    await loadDepartments();
    
    selCities.forEach((selCity) => {
        addFirstOption('Seleccione la ciudad', selCity);
        selCity.setAttribute('required', 'true');
    });

    selDepartments.forEach((selDepartment) => {
        selDepartment.addEventListener('change', handleChangeDepartment);
    });

    initFormHandlers();
};

main();


