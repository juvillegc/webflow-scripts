import { validPhoneNumber, validDocumentNumber, handleKeyUpThousandSeparators, onlyNumberKey, removeAllOptions, addFirstOption } from './shared/utils.js';
import { getDepartments, getCities } from './services/location.service.js';

const selDepartments = document.querySelectorAll('.departamentos');
const selCities = document.querySelectorAll('.ciudades');
const inputPhoneNumber = document.querySelectorAll('.numero_celular');
const inputDocumentNumber = document.querySelectorAll('.numero_documento');
const inputDocumentText = document.querySelectorAll('.input-form-text');

const validateInputs = () => {
    inputPhoneNumber.forEach((input) => {
        input.onkeypress = validPhoneNumber;
         input.onpaste = (event) => {
            event.preventDefault();
        };
    });

    inputDocumentNumber.forEach((input) => {
        input.onkeypress = validDocumentNumber;
         input.onpaste = (event) => {
            event.preventDefault();
        };
    });
};



const handleNormalizeInput = (event) => {
    event.target.value = normalizeTex(event.target.value);
};

// Agregar el evento a cada input con la clase `.input-form-text`
inputDocumentText.forEach((input) => {
    input.addEventListener("input", handleNormalizeInput);
});



const loadDepartments = async () => {
    const { deparments } = await getDepartments();

    selDepartments.forEach((selDepartment) => {
        addFirstOption('Seleccione el departamento', selDepartment);
        selDepartment.setAttribute('required', 'true'); // Hacer obligatorio

        deparments.forEach(department => {
            const option = document.createElement('option');
            option.value = normalizeTex(department.id);
            option.setAttribute('key', department.key);
            option.innerHTML = department.label;
            selDepartment.appendChild(option);
        });
    });
};

const loadCities = async (keyDepartment) => {
    selCities.forEach((selCity) => {
        removeAllOptions(selCity);
        addFirstOption('Seleccione la ciudad', selCity);
        selCity.setAttribute('required', 'true'); // Hacer obligatorio
    });

    const cities = await getCities(keyDepartment);
    cities.forEach(city => {
        const option = document.createElement('option');
         option.value = normalizeTex(city.id);
        option.innerHTML = city.label;
        selCities.forEach((selCity) => {
            selCity.appendChild(option.cloneNode(true));
        });
    });
};

const handleChangeDepartment = async (event) => {
    const selDepartment = event.target;
    const keyDepartment = selDepartment.options[selDepartment.selectedIndex].getAttribute('key');
    await loadCities(keyDepartment);
};

const main = async () => {
    validateInputs();
    await loadDepartments();
    
    selCities.forEach((selCity) => {
        addFirstOption('Seleccione la ciudad', selCity);
        selCity.setAttribute('required', 'true'); // Asegurar que el campo esté obligatorio al inicio
    });

    selDepartments.forEach((selDepartment) => {
        selDepartment.addEventListener('change', handleChangeDepartment);
    });
};

main();
