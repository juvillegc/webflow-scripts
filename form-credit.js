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

const inputPhoneNumber =
  document.getElementById("phone_number");

const selectDepartment =
  document.getElementById("department");

const selectCity =
  document.getElementById("city");

const selectImpactDuration =
  document.getElementById("impact_duration");

const selectPreferredAlternative =
  document.getElementById("preferred_alternative");


/* ==================================================
   HELPERS
================================================== */

/**
 * Retorna el texto visible de una opción seleccionada.
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
 * Normaliza valores de radio buttons.
 *
 * @param {string} value
 * @returns {string}
 */
const normalizeRadioValue = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};


/* ==================================================
   DEPARTMENTS
================================================== */

/**
 * Carga departamentos.
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

    const { deparments } =
      await getDepartments();

    deparments.forEach((department) => {
      const option =
        document.createElement("option");

      option.value = department.id;

      option.setAttribute(
        "key",
        department.key
      );

      option.textContent =
        department.label;

      selectDepartment.appendChild(
        option
      );
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
 * Carga ciudades según el departamento.
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

    const cities =
      await getCities(departmentKey);

    cities.forEach((city) => {
      const option =
        document.createElement("option");

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
   CLEVERTAP EVENT
================================================== */

/**
 * Construye las propiedades del evento
 * form_credito_sismo.
 *
 * @returns {Object}
 */
const buildEventProperties = () => {
  const phoneNumber =
    inputPhoneNumber?.value.trim() || "";

  const activeNequiCredit =
    normalizeRadioValue(
      readRadioValue(
        "active_nequi_credit"
      )
    );

  const paymentCapacityAffected =
    normalizeRadioValue(
      readRadioValue(
        "payment_capacity_affected"
      )
    );

  const incomeSourceAffected =
    normalizeRadioValue(
      readRadioValue(
        "income_source_affected"
      )
    );

  return {
    Phone: phoneNumber,

    Department:
      getSelectedText(selectDepartment),

    City:
      getSelectedText(selectCity),

    ActiveNequiCredit:
      activeNequiCredit,

    PaymentCapacityAffected:
      paymentCapacityAffected,

    IncomeSourceAffected:
      incomeSourceAffected,

    ImpactDuration:
      selectImpactDuration?.value || "",

    PreferredAlternative:
      selectPreferredAlternative?.value || "",
  };
};


/* ==================================================
   SUBMIT
================================================== */

/**
 * Envía el evento a CleverTap
 * si el formulario es válido.
 *
 * El submit nativo de Webflow continúa normalmente.
 *
 * @param {SubmitEvent} event
 * @returns {void}
 */
const handleSubmit = (event) => {
  if (!form) return;

  if (!form.checkValidity()) {
    event.preventDefault();
    form.reportValidity();
    return;
  }

  const eventProperties =
    buildEventProperties();

  console.log(
    "CleverTap Event:",
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
   * - Máximo 10 dígitos
   * - Bloquea pegar
   * - Validación visual
   */
  configurePhoneInput(
    "phone_number"
  );

  /*
   * Ciudad inicia bloqueada
   * hasta seleccionar departamento.
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
