import { validPhoneNumber, validDocumentNumber, handleKeyUpThousandSeparators, onlyNumberKey, removeAllOptions, addFirstOption } from './shared/utils.js';
import { getDepartments, getCities } from './services/location.service.js';


const selDepartments = document.querySelectorAll('.departamentos');
const selCities = document.querySelectorAll('.ciudades');
const inputPhoneNumber = document.querySelectorAll('.numero_celular');
const inputDocumentNumber = document.querySelectorAll('.numero_documento');

const validateInputs = () => {
    inputPhoneNumber.forEach((input) => {
        input.onkeypress = validPhoneNumber;
        input.addEventListener("input", validPhoneNumber); // Validar en tiempo real
    });

    inputDocumentNumber.forEach((input) => {
        input.onkeypress = validDocumentNumber;
    });

}
document.addEventListener("DOMContentLoaded", validateInputs);

const loadDepartments = async () => {
    const { deparments } = await getDepartments();
    
    addFirstOption('Seleccione el departamento', selDepartments);
    selDepartments.setAttribute('required', 'true'); // ← Hacer obligatorio

    deparments.forEach(department => {
        const option = document.createElement('option');
        option.value = department.id;
        option.setAttribute('key', department.key);
        option.innerHTML = department.label;
        selDepartments.appendChild(option);
    });
}

const loadCities = async (keyDepartment) => {
    removeAllOptions(selCities);
    addFirstOption('Seleccione la ciudad', selCities);
    selCities.setAttribute('required', 'true'); // ← Hacer obligatorio

    const cities = await getCities(keyDepartment);
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.id;
        option.innerHTML = city.label;
        selCities.appendChild(option);
    });
}
const handleChangeDepartment = async (event) => {
    const selDepartment = event.target;
    const keyDepartment = selDepartment.options[selDepartment.selectedIndex].getAttribute('key');
    await loadCities(keyDepartment);
}

const main = async () => {
    validateInputs();
    await loadDepartments();
    selCities.forEach((selCity) => {
        addFirstOption('Seleccione la ciudad', selCity);
    });
    selDepartments.forEach((selDepartment) => {
        selDepartment.addEventListener('change', handleChangeDepartment);
    });
}

main();
