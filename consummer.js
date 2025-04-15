import { onlyNumberKey, handleKeyUpThousandSeparators, validPhoneNumber, validateEmail, validDocumentNumber, removeAllOptions, addFirstOption, setTodayAsDefaultDate, setMaxFileSizeListeners } from './shared/utils.js';
import { getDepartments, getCities } from './services/location.service.js';

const inputDocumentNumber = document.getElementById('numero_documento');
const inputDocumentMail = document.getElementById('correo_electronico');
const inputPhoneNumber = document.getElementById('numero_celular');
const selDepartments = document.querySelector('#departamentos');
const selCities = document.querySelector('#ciudades');
const customPrice = document.querySelectorAll('.custom_price');
const inputDate = document.querySelector('input[type="date"]');
const fileInputs = document.querySelectorAll('input[type="file"]');

const validateInputs = () => {
  inputPhoneNumber.onkeypress = validPhoneNumber;

  customPrice.forEach((input) => {
    input.onkeyup = handleKeyUpThousandSeparators;
    input.onkeypress = onlyNumberKey;
  });

  inputDocumentMail.oninput = validateEmail;
  inputDocumentNumber.onkeypress = validDocumentNumber;

  setTodayAsDefaultDate(inputDate);

  setMaxFileSizeListeners(fileInputs);
};

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
