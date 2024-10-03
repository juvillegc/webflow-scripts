import { validPhoneNumber, validDocumentNumber, handleKeyUpThousandSeparators, onlyNumberKey, removeAllOptions, addFirstOption } from './shared/utils.js';
import { getDepartments, getCities } from './services/location.service.js';


const selDepartments = document.querySelectorAll('.departamentos');
const selCities = document.querySelectorAll('.ciudades');
const inputPhoneNumber = document.querySelectorAll('.numero_celular');
const inputDocumentNumber = document.querySelectorAll('.numero_documento');

const validateInputs = () => {
    inputPhoneNumber.forEach((input) => {
        input.onkeypress = validPhoneNumber;
    });

    inputDocumentNumber.forEach((input) => {
        input.onkeypress = validDocumentNumber;
    });

}

const loadDepartments = async () => {
    const { deparments } = await getDepartments();

    selDepartments.forEach((selDepartment) => {
        addFirstOption('Seleccione el departamento', selDepartment);

        selDepartment.setAttribute('required', 'true');
        deparments.forEach(department => {
            const option = document.createElement('option');
            option.value = department.id;
            option.setAttribute('key', department.key);
            option.innerHTML = department.label;
            selDepartment.appendChild(option);
        });
    });
}

const loadCities = async (keyDepartment) => {
    selCities.forEach((selCity) => {
        removeAllOptions(selCity);
        addFirstOption('Seleccione la ciudad', selCity);
    });

    const cities = await getCities(keyDepartment);
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.id;
        option.innerHTML = city.label;
        selCities.forEach((selCity) => {
            selCity.appendChild(option.cloneNode(true));
        });
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
