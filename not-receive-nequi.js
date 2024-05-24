import { validPhoneNumber, handleKeyUpThousandSeparators, onlyNumberKey, removeAllOptions, addFirstOption } from './shared/utils.js';
import { getDepartments, getCities } from './services/location.service.js';

const selDepartments = document.querySelectorAll('.departamentos'); 
const selCities = document.querySelectorAll('.ciudades');
const inputPhoneNumber = document.querySelectorAll('.numero_celular');

const validateInputs = () => {
    inputPhoneNumber.forEach((input) => {
        input.addEventListener('keypress', validPhoneNumber);
    });
}

const loadDepartments = async () => {
    const { departments } = await getDepartments(); // Corrección en el nombre de la variable
    addFirstOption('Seleccione el departamento', selDepartments);
    departments.forEach(department => {
        const option = document.createElement('option');
        option.value = department.id;
        option.setAttribute('key', department.key);
        option.innerHTML = department.label;
        selDepartments.forEach(select => {
            select.appendChild(option); // Corrección aquí, usar forEach para agregar a todos los select
        });
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
        selCities.forEach(select => {
            select.appendChild(option); // Corrección aquí, usar forEach para agregar a todos los select
        });
    });
}

const handleChangeDepartment = async () => {
    const departmentSelected = selDepartments.options[selDepartments.selectedIndex].getAttribute('key'); // Corrección en el nombre de la variable
    await loadCities(departmentSelected);
}

const main = async () => {
    validateInputs();
    await loadDepartments();
    selDepartments.forEach(select => {
        select.addEventListener('change', handleChangeDepartment); // Corrección aquí, usar forEach para agregar el listener a todos los select
    });
}

main();
