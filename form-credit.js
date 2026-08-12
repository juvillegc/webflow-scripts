import {
  configurePhoneInput,
  removeAllOptions,
  addFirstOption,
  readRadioValue,
} from "./shared/utils.js";

import {
  getDepartments,
  getCities,
} from "./services/location.service.js";

import {
  sendCleverTapEventEventOnly,
} from "./services/event.clevertap.eventOnly.js";


/* ==================================================
   FORM
================================================== */

const formBlock = document.getElementById("credit_form");
const form = formBlock?.querySelector("form");

const inputPhoneNumber = document.getElementById("phone_number");

const selectDepartment = document.getElementById("department");
const selectCity = document.getElementById("city");

const selectImpactDuration =
  document.getElementById("impact_duration");


/* ==================================================
   HELPERS
================================================== */

/**
 * Retorna el texto visible del select.
 *
 * @param {HTMLSelectElement|null} select
 * @returns {string}
 */
const getSelectedText = (select) => {
  if (!select || !select.value) return "";

  const selectedOption =
    select.options[select.selectedIndex];

  return selectedOption?.textContent?.trim() || "";
};


/**
 * Normaliza el valor de los radio buttons.
 *
 * @param {string} value
 * @returns {string}
 */
const normalizeRadioValue = (value) =>
  String(value || "").trim().toLowerCase();


/* ==================================================
   DEPARTMENTS
================================================== */

/**
 * Carga los departamentos.
 *
 * @returns {Promise<void>}
 */
const loadDepartments = async () => {
  if (!selectDepartment) return;

  try {
    removeAllOptions(selectDepartment);

    addFirstOption(
      "Selecciona el departamento",
      selectDepartment
    );

    const { deparments } = await getDepartments();

    deparments.forEach((department) => {
      const option = document.createElement("option");

      option.value = department.id;
      option.setAttribute("key", department.key);
      option.textContent = department.label;

      selectDepartment.appendChild(option);
    });
  } catch (error) {
    console.error(
      "Error cargando departamentos:",
      error
    );
  }
};


/* ==================================================
   CITIES
================================================== */

/**
 * Carga las ciudades según el departamento.
 *
 * @param {string} departmentKey
 * @returns {Promise<void>}
 */
const loadCities = async (departmentKey) => {
  if (!selectCity || !departmentKey) return;

  try {
    selectCity.disabled = true;

    removeAllOptions(selectCity);

    addFirstOption(
      "Selecciona la ciudad",
      selectCity
    );

    const cities = await getCities(departmentKey);

    cities.forEach((city) => {
      const option = document.createElement("option");

      option.value = city.id;
      option.textContent = city.label;

      selectCity.appendChild(option);
    });

    selectCity.disabled = false;
  } catch (error) {
    console.error(
      "Error cargando ciudades:",
      error
    );
  }
};


/**
 * Maneja el cambio de departamento.
 *
 * @returns {Promise<void>}
 */
const handleDepartmentChange = async () => {
  if (!selectDepartment || !selectCity) return;

  const selectedOption =
    selectDepartment.options[
      selectDepartment.selectedIndex
    ];

  const departmentKey =
    selectedOption?.getAttribute("key");

  if (!departmentKey) {
    removeAllOptions(selectCity);

    addFirstOption(
      "Selecciona primero un departamento",
      selectCity
    );

    selectCity.disabled = true;

    return;
  }

  await loadCities(departmentKey);
};


/* ==================================================
   CLEVERTAP
================================================== */

/**
 * Construye las propiedades del evento.
 *
 * @returns {Object}
 */
const buildEventProperties = () => {
  const phoneNumber =
    inputPhoneNumber?.value.trim() || "";

  return {
    Phone: phoneNumber,

    Department:
      getSelectedText(selectDepartment),

    City:
      getSelectedText(selectCity),

    ActiveNequiCredit:
      normalizeRadioValue(
        readRadioValue("active_nequi_credit")
      ),

    PaymentCapacityAffected:
      normalizeRadioValue(
        readRadioValue("payment_capacity_affected")
      ),

    IncomeSourceAffected:
      normalizeRadioValue(
        readRadioValue("income_source_affected")
      ),

    ImpactDuration:
      selectImpactDuration?.value || "",
  };
};


/**
 * Envía el evento a CleverTap.
 *
 * @param {SubmitEvent} event
 * @returns {void}
 */
const handleSubmit = (event) => {
  if (!form) return;

  /*
   * Si el formulario no es válido,
   * dejamos que el navegador/Webflow
   * muestre sus validaciones.
   */
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const eventProperties =
    buildEventProperties();

  console.log(
    "CleverTap event:",
    "form_credito_sismo",
    eventProperties
  );

  sendCleverTapEventEventOnly(
    "form_credito_sismo",
    eventProperties
  );
};


/* ==================================================
   INITIALIZATION
================================================== */

const main = async () => {
  if (!formBlock) {
    console.warn(
      "No se encontró #credit_form"
    );

    return;
  }

  if (!form) {
    console.warn(
      "No se encontró el <form> dentro de #credit_form"
    );

    return;
  }

  /*
   * Teléfono:
   * - Solo números
   * - Máximo 10
   * - Bloquea pegar
   * - Valida longitud
   */
  configurePhoneInput("phone_number");

  /*
   * Ciudad inicia deshabilitada.
   */
  if (selectCity) {
    removeAllOptions(selectCity);

    addFirstOption(
      "Selecciona primero un departamento",
      selectCity
    );

    selectCity.disabled = true;
  }

  /*
   * Carga departamentos.
   */
  await loadDepartments();

  /*
   * Eventos.
   */
  selectDepartment?.addEventListener(
    "change",
    handleDepartmentChange
  );

  form.addEventListener(
    "submit",
    handleSubmit
  );
};


main();
