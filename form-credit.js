import {
  configurePhoneInput,
  removeAllOptions,
  addFirstOption,
  readRadioValue,
  setupTextareaCounter,
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

const creditImpactFields =
  document.getElementById("credit_impact_fields");

const textareaAdditionalComments =
  document.getElementById("additional_comments");


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
 * Normaliza los valores de radio.
 *
 * @param {string} value
 * @returns {string}
 */
const normalizeRadioValue = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};


/**
 * Activa o desactiva required de los campos
 * contenidos dentro de un elemento.
 *
 * Conserva cuáles campos originalmente
 * eran obligatorios.
 *
 * @param {HTMLElement|null} container
 * @param {boolean} enabled
 * @returns {void}
 */
const toggleRequiredFields = (
  container,
  enabled
) => {
  if (!container) return;

  const fields = container.querySelectorAll(
    "input, select, textarea"
  );

  fields.forEach((field) => {
    /*
     * Guardamos una sola vez si el campo
     * era required originalmente.
     */
    if (
      field.dataset.wasRequired === undefined
    ) {
      field.dataset.wasRequired =
        field.required ? "true" : "false";
    }

    if (enabled) {
      field.required =
        field.dataset.wasRequired === "true";
    } else {
      field.required = false;

      /*
       * Elimina posibles errores nativos
       * mientras el campo está oculto.
       */
      field.setCustomValidity("");
    }
  });
};


/**
 * Limpia los campos que quedan ocultos
 * para no enviar respuestas antiguas.
 *
 * @param {HTMLElement|null} container
 * @returns {void}
 */
const clearHiddenFields = (container) => {
  if (!container) return;

  const fields = container.querySelectorAll(
    "input, select, textarea"
  );

  fields.forEach((field) => {
    if (
      field.type === "radio" ||
      field.type === "checkbox"
    ) {
      field.checked = false;
      return;
    }

    field.value = "";
  });
};


/* ==================================================
   CONDITIONAL CREDIT QUESTIONS
================================================== */

/**
 * Muestra u oculta las preguntas relacionadas
 * con afectación del crédito.
 *
 * YES:
 * - Muestra preguntas
 * - Restablece required
 *
 * NO:
 * - Oculta preguntas
 * - Quita required
 * - Limpia respuestas anteriores
 *
 * @param {boolean} show
 * @returns {void}
 */
const toggleCreditImpactFields = (show) => {
  if (!creditImpactFields) return;

  if (show) {
    creditImpactFields.style.display = "";

    toggleRequiredFields(
      creditImpactFields,
      true
    );

    return;
  }

  toggleRequiredFields(
    creditImpactFields,
    false
  );

  clearHiddenFields(
    creditImpactFields
  );

  creditImpactFields.style.display = "none";
};


/**
 * Reacciona a Sí / No en:
 * active_nequi_credit
 *
 * @returns {void}
 */
const handleActiveCreditChange = () => {
  const activeCredit =
    normalizeRadioValue(
      readRadioValue(
        "active_nequi_credit"
      )
    );

  toggleCreditImpactFields(
    activeCredit === "yes"
  );
};


/* ==================================================
   DEPARTMENTS
================================================== */

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


const handleDepartmentChange = async () => {
  if (!selectDepartment || !selectCity) {
    return;
  }

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

const buildEventProperties = () => {
  const phoneNumber =
    inputPhoneNumber?.value.trim() || "";

  const activeNequiCredit =
    normalizeRadioValue(
      readRadioValue(
        "active_nequi_credit"
      )
    );

  /*
   * Solo tomamos estas respuestas
   * cuando tiene crédito activo.
   */
  const hasActiveCredit =
    activeNequiCredit === "yes";

  return {
    Phone: phoneNumber,

    Department:
      getSelectedText(selectDepartment),

    City:
      getSelectedText(selectCity),

    ActiveNequiCredit:
      activeNequiCredit,

    PaymentCapacityAffected:
      hasActiveCredit
        ? normalizeRadioValue(
            readRadioValue(
              "payment_capacity_affected"
            )
          )
        : "",

    IncomeSourceAffected:
      hasActiveCredit
        ? normalizeRadioValue(
            readRadioValue(
              "income_source_affected"
            )
          )
        : "",

    ImpactDuration:
      hasActiveCredit
        ? selectImpactDuration?.value || ""
        : "",

    AdditionalComments:
      textareaAdditionalComments?.value
        .trim() || "",
  };
};


/* ==================================================
   SUBMIT
================================================== */

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
   * Teléfono
   */
  configurePhoneInput(
    "phone_number"
  );

  /*
   * Textarea:
   * máximo 200 caracteres
   * contador automático 0/200
   */
  setupTextareaCounter({
    textareaId:
      "additional_comments",

    maxCharacters: 200,

    counterId:
      "additional_comments_counter",
  });

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
   * Inicialmente ocultamos las preguntas
   * dependientes hasta que seleccione Sí.
   */
  toggleCreditImpactFields(false);

  /*
   * Departamentos.
   */
  await loadDepartments();

  /*
   * Departamento → ciudad
   */
  selectDepartment?.addEventListener(
    "change",
    handleDepartmentChange
  );

  /*
   * Crédito activo Sí / No
   */
  document
    .querySelectorAll(
      'input[name="active_nequi_credit"]'
    )
    .forEach((radio) => {
      radio.addEventListener(
        "change",
        handleActiveCreditChange
      );
    });

  /*
   * Submit.
   */
  form.addEventListener(
    "submit",
    handleSubmit
  );
};


main();
