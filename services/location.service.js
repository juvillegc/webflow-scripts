import { config } from '../config/config.js'
export const getDepartments = async () => {
    return new Promise((resolve, reject) => {
        fetch(`${config.apiUrlCities}/z_departaments.json`)
        .then(response => response.json())
        .then((data) => resolve(data))
        .catch(error => reject(error));
    });
}

export const getCities = async (keyDepartment) => {
    return new Promise((resolve, reject) => {
        fetch(`${config.apiUrlCities}/${keyDepartment}.json`)
        .then((response) => response.json())
        .then((json) => {
            const arrLabelCities = Object.keys(json.cities);
            const arrIdCities = Object.values(json.cities);
            const formattedArray = arrLabelCities.map((label, index) => {
                return {
                    id: arrIdCities[index],
                    label
                };
            });
            resolve(formattedArray);
        })
        .catch(error => reject(error));
    });
}