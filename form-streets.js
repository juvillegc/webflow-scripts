import {
  configurePhoneInput,
  validDocumentNumber,
  removeAllOptions,
  addFirstOption,
  removeAccents,
} from "./shared/utils.js";

import {
  getDepartments,
  getCities,
} from "./services/location.service.js";

import {
  sendCleverTapEventEventOnly,
} from "./services/event.clevertap.eventOnly.js";

const EVENT_NAME = "form_callejeando_web";

const inputFullName =
  document.getElementById("full_name");

const inputPhoneNumber =
  document.getElementById("phone_number");

const selectDocumentType =
  document.getElementById("document_type");

const inputDocumentNumber =
  document.getElementById("document_number");

const selectDepartment =
  document.getElementById("department");

const selectCity =
  document.getElementById("city");

const checkboxTerms =
  document.getElementById("tyc");

/**
 * @param {Event} event
 * @returns {void}
 */
const handleNormalizeText = (event) => {
  event.target.value = removeAccents(
    event.target.value
  );
};

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
 * @returns {Promise<void>}
 */
const loadDepartments = async () => {
  if (!selectDepartment) return;

  const { deparments } = await getDepartments();

  removeAllOptions(selectDepartment);

  addFirstOption(
    "Seleccione el departamento",
    selectDepartment
  );

  deparments.forEach((department) => {
    const option = document.createElement("option");

    option.value = department.id;
    option.setAttribute("key", department.key);
    option.textContent = department.label;

    selectDepartment.appendChild(option);
  });
};

/**
 * @param {string} departmentKey
 * @returns {Promise<void>}
 */
const loadCities = async (departmentKey) => {
  if (!selectCity) return;

  removeAllOptions(selectCity);

  addFirstOption(
    "Seleccione la ciudad",
    selectCity
  );

  if (!departmentKey) {
    selectCity.disabled = true;
    return;
  }

  const cities = await getCities(departmentKey);

  cities.forEach((city) => {
    const option = document.createElement("option");

    option.value = city.id;
    option.textContent = city.label;

    selectCity.appendChild(option);
  });

  selectCity.disabled = false;
};

/**
 * @returns {Promise<void>}
 */
const handleChangeDepartment = async () => {
  if (!selectDepartment) return;

  const selectedOption =
    selectDepartment.options[
      selectDepartment.selectedIndex
    ];

  const departmentKey =
    selectedOption?.getAttribute("key") || "";

  await loadCities(departmentKey);
};

/**
 * @returns {{
 *   Phone: string,
 *   FullName: string,
 *   DocumentType: string,
 *   DocumentNumber: string,
 *   Department: string,
 *   City: string,
 *   AcceptedTerms: boolean
 * }}
 */
const buildEventProperties = () => ({
  Phone: inputPhoneNumber?.value.trim() || "",

  FullName:
    inputFullName?.value.trim() || "",

  DocumentType:
    getSelectedText(selectDocumentType),

  DocumentNumber:
    inputDocumentNumber?.value.trim() || "",

  Department:
    getSelectedText(selectDepartment),

  City:
    getSelectedText(selectCity),

  AcceptedTerms:
    checkboxTerms?.checked || false,
});

/**
 * @param {SubmitEvent} event
 * @returns {void}
 */
const handleSubmit = (event) => {
  const form = event.currentTarget;

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  if (!form.checkValidity()) {
    event.preventDefault();
    form.reportValidity();
    return;
  }

  const eventProperties =
    buildEventProperties();

  console.log(
    "CleverTap Event:",
    EVENT_NAME,
    eventProperties
  );

  sendCleverTapEventEventOnly(
    EVENT_NAME,
    eventProperties
  );
};

/**
 * @returns {void}
 */
const setupValidations = () => {
  configurePhoneInput("phone_number");

  if (inputFullName) {
    inputFullName.addEventListener(
      "input",
      handleNormalizeText
    );
  }

  if (inputDocumentNumber) {
    inputDocumentNumber.onkeypress =
      validDocumentNumber;
  }
};

/**
 * @returns {Promise<void>}
 */
const main = async () => {
  setupValidations();

  await loadDepartments();

  if (selectCity) {
    removeAllOptions(selectCity);

    addFirstOption(
      "Seleccione la ciudad",
      selectCity
    );

    selectCity.disabled = true;
  }

  selectDepartment?.addEventListener(
    "change",
    handleChangeDepartment
  );

  const form =
    inputPhoneNumber?.closest("form");

  form?.addEventListener(
    "submit",
    handleSubmit
  );
};

main();
