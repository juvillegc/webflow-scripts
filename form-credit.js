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

const formBlock = document.getElementById("credit_form");
const form = formBlock?.querySelector("form");

const inputPhoneNumber =
  document.getElementById("phone_number");

const selectDepartment =
  document.getElementById("department");

const selectCity =
  document.getElementById("city");

const creditImpactFields =
  document.getElementById("credit_impact_fields");

const textareaAdditionalComments =
  document.getElementById("additional_comments");

/**
 * @param {HTMLSelectElement|null} select
 * @returns {string}
 */
const getSelectedText = (select) => {
  if (!select || !select.value) return "";

  return (
    select.options[
      select.selectedIndex
    ]?.textContent?.trim() || ""
  );
};

/**
 * @param {string} value
 * @returns {string}
 */
const normalizeRadioValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

/**
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
    if (
      field.dataset.wasRequired === undefined
    ) {
      field.dataset.wasRequired =
        field.required ? "true" : "false";
    }

    field.required = enabled
      ? field.dataset.wasRequired === "true"
      : false;

    if (!enabled) {
      field.setCustomValidity("");
    }
  });
};

/**
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

/**
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

/**
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

      selectDepartment.appendChild(option);
    });
  } catch (error) {
    console.error(
      "Error cargando departamentos:",
      error
    );
  }
};

/**
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
 * @returns {Promise<void>}
 */
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

/**
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

    AdditionalComments:
      textareaAdditionalComments?.value
        .trim() || "",
  };
};

/**
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

/**
 * @returns {Promise<void>}
 */
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

  configurePhoneInput(
    "phone_number"
  );

  setupTextareaCounter({
    textareaId:
      "additional_comments",
    maxCharacters: 200,
    counterId:
      "additional_comments_counter",
  });

  if (selectCity) {
    removeAllOptions(selectCity);

    addFirstOption(
      "Selecciona primero un departamento",
      selectCity
    );

    selectCity.disabled = true;
  }

  toggleCreditImpactFields(false);

  await loadDepartments();

  selectDepartment?.addEventListener(
    "change",
    handleDepartmentChange
  );

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

  form.addEventListener(
    "submit",
    handleSubmit
  );
};

main();
