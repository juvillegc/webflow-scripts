
import { validPhoneNumber, handleKeyUpThousandSeparators, onlyNumberKey, removeAllOptions, addFirstOption } from './shared/utils.js';
import { getDepartments, getCities } from './services/location.service.js';


const selDepartments = document.getElementsByClassName('.departamentos'); 
const selCities = document.getElementsByClassName('.ciudades');
const inputPhoneNumber = document.querySelectorAll('.numero_celular');



const validateInputs = () => {
    
     inputPhoneNumber.forEach((input) => {
        input.onkeypress = validPhoneNumber;
    });
    
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
