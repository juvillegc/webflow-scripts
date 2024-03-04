import { onlyNumberKey, handleKeyUpThousandSeparators, validPhoneNumber, validateEmail, validDocumentNumber, removeAllOptions, addFirstOption } from './shared/utils.js';
import { inputEvent } from './shared/date-format.js';
import { getDepartments, getCities } from './services/location.service.js';

const inputPhoneNumber = document.getElementById('numero_celular');
const customPrice = document.querySelectorAll('.custom-price');
const inputDateTakeMoney = document.getElementById('fecha_recarga');
const selDepartments = document.querySelector('#departamentos');
const selCities = document.querySelector('#ciudades');
const inputDocumentMail = document.getElementById('email-2');
const inputDocumentNumber = document.querySelectorAll('.numero_documento');

const validateInputs = () => {
    
    inputPhoneNumber.onkeypress = validPhoneNumber;
    
    customPrice.forEach((input) => {
        input.onkeyup = handleKeyUpThousandSeparators;
        input.onkeypress = onlyNumberKey;
    });
    
    inputDateTakeMoney.oninput = inputEvent;
    
    inputDocumentMail.oninput = validateEmail;
    
    inputDocumentNumber.onkeypress = validDocumentNumber;
}



const loadDepartments = async () => {
    const { deparments } = await getDepartments();
    addFirstOption('Seleccione el departamento', selDepartments);
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
    const cities = await getCities(keyDepartment);
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.id;
        option.innerHTML = city.label;
        selCities.appendChild(option);
    });
}

const handleChangeDepartment = async () => {
    const deparmentSelected = selDepartments.options[selDepartments.selectedIndex].getAttribute('key');
    await loadCities(deparmentSelected);
}

const main = async () => {
    validateInputs();
    await loadDepartments();
    addFirstOption('Seleccione la ciudad', selCities);
    selDepartments.addEventListener('change', handleChangeDepartment);
}

main();
