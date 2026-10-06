import {
  configurePhoneInput,
  validDocumentNumber,
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

const EVENT_NAME = "form_reactivacion_web";

const formBlock =
  document.getElementById("reactivation_form");

const form =
  formBlock?.querySelector("form");

const inputPhoneNumber =
  document.getElementById("phone_number");

const selectDocumentType =
  document.getElementById("document_type");

const inputDocumentNumber =
  document.getElementById("document_number");

const inputBusinessName =
  document.getElementById("business_name");

const inputEmail =
  document.getElementById("email");

const selectDepartment =
  document.getElementById("department");

const selectCity =
  document.getElementById("city");

const inputSocialNetwork =
  document.getElementById("social_network");

const inputWebsite =
  document.getElementById("website");

const inputGoogleMapsUrl =
  document.getElementById("google_maps_url");

const selectBusinessCategory =
  document.getElementById("business_category");

const businessLogoElement =
  document.getElementById("business_logo");

const inputBusinessLogo =
  businessLogoElement?.matches('input[type="file"]')
    ? businessLogoElement
    : businessLogoElement?.querySelector(
        'input[type="file"]'
      );

const textareaBusinessDescription =
  document.getElementById(
    "business_description"
  );

const selectSalesChannel =
  document.getElementById("sales_channel");

const checkboxAcceptTerms =
  document.getElementById("accept_terms");

/**
 * @param {HTMLInputElement|null} input
 * @returns {string}
 */
const getInputValue = (input) => {
  return input?.value.trim() || "";
};

/**
 * @param {HTMLSelectElement|null} select
 * @returns {string}
 */
const getSelectValue = (select) => {
  return select?.value || "";
};

/**
 * @param {HTMLSelectElement|null} select
 * @returns {string}
 */
const getSelectedText = (select) => {
  if (!select || !select.value) {
    return "";
  }

  const selectedOption =
    select.options[select.selectedIndex];

  return (
    selectedOption?.textContent?.trim() ||
    ""
  );
};

/**
 * @param {string} value
 * @returns {string}
 */
const normalizeRadioValue = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
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

/**
 * @param {string} departmentKey
 * @returns {Promise<void>}
 */
const loadCities = async (
  departmentKey
) => {
  if (
    !selectCity ||
    !departmentKey
  ) {
    return;
  }

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

      selectCity.appendChild(
        option
      );
    });

    selectCity.disabled = false;
  } catch (error) {
    console.error(
      "Error cargando ciudades:",
      error
    );

    selectCity.disabled = true;
  }
};

/**
 * @returns {Promise<void>}
 */
const handleDepartmentChange =
  async () => {
    if (
      !selectDepartment ||
      !selectCity
    ) {
      return;
    }

    const selectedOption =
      selectDepartment.options[
        selectDepartment.selectedIndex
      ];

    const departmentKey =
      selectedOption?.getAttribute(
        "key"
      );

    if (!departmentKey) {
      removeAllOptions(selectCity);

      addFirstOption(
        "Selecciona primero un departamento",
        selectCity
      );

      selectCity.disabled = true;

      return;
    }

    await loadCities(
      departmentKey
    );
  };

/**
 * @returns {boolean}
 */
const validateBusinessLogo = () => {
  if (!inputBusinessLogo) {
    return true;
  }

  const file =
    inputBusinessLogo.files?.[0];

  if (!file) {
    inputBusinessLogo.setCustomValidity(
      ""
    );

    return true;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/svg+xml",
  ];

  if (
    !allowedTypes.includes(file.type)
  ) {
    inputBusinessLogo.setCustomValidity(
      "Adjunta tu logo en formato JPG, PNG o SVG."
    );

    return false;
  }

  inputBusinessLogo.setCustomValidity(
    ""
  );

  return true;
};

/**
 * @returns {{
 *   Phone: string,
 *   DocumentType: string,
 *   DocumentNumber: string,
 *   BusinessName: string,
 *   Email: string,
 *   Department: string,
 *   City: string,
 *   SocialNetwork: string,
 *   Website: string,
 *   GoogleMapsUrl: string,
 *   BusinessCategory: string,
 *   BusinessDescription: string,
 *   SalesScope: string,
 *   SalesChannel: string,
 *   AcceptTerms: boolean
 * }}
 */
const buildEventProperties = () => {
  return {
    Phone:
      getInputValue(
        inputPhoneNumber
      ),

    DocumentType:
      getSelectValue(
        selectDocumentType
      ),

    DocumentNumber:
      getInputValue(
        inputDocumentNumber
      ),

    BusinessName:
      getInputValue(
        inputBusinessName
      ),

    Email:
      getInputValue(
        inputEmail
      ),

    Department:
      getSelectedText(
        selectDepartment
      ),

    City:
      getSelectedText(
        selectCity
      ),

    SocialNetwork:
      getInputValue(
        inputSocialNetwork
      ),

    Website:
      getInputValue(
        inputWebsite
      ),

    GoogleMapsUrl:
      getInputValue(
        inputGoogleMapsUrl
      ),

    BusinessCategory:
      getSelectValue(
        selectBusinessCategory
      ),

    BusinessDescription:
      textareaBusinessDescription
        ?.value.trim() || "",

    SalesScope:
      normalizeRadioValue(
        readRadioValue(
          "sales_scope"
        )
      ),

    SalesChannel:
      getSelectValue(
        selectSalesChannel
      ),

    AcceptTerms:
      checkboxAcceptTerms
        ?.checked || false,
  };
};

/**
 * @param {SubmitEvent} event
 * @returns {void}
 */
const handleSubmit = (event) => {
  if (!form) return;

  console.log(
    "[Reactivación] Submit detectado"
  );

  const isLogoValid =
    validateBusinessLogo();

  console.log(
    "[Reactivación] Logo válido:",
    isLogoValid
  );

  console.log(
    "[Reactivación] Form válido:",
    form.checkValidity()
  );

  if (
    !isLogoValid ||
    !form.checkValidity()
  ) {
    event.preventDefault();

    form.reportValidity();

    return;
  }

  const eventProperties =
    buildEventProperties();

  console.log(
    "[Reactivación] Enviando CleverTap:",
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
const configureBusinessLogo = () => {
  if (!inputBusinessLogo) {
    console.warn(
      "[Reactivación] No se encontró el input del logo"
    );

    return;
  }

  inputBusinessLogo.setAttribute(
    "accept",
    ".jpg,.jpeg,.png,.svg"
  );

  inputBusinessLogo.addEventListener(
    "change",
    validateBusinessLogo
  );
};

/**
 * @returns {void}
 */
const configureDocumentNumber = () => {
  if (!inputDocumentNumber) {
    return;
  }

  inputDocumentNumber.onkeypress =
    validDocumentNumber;
};

/**
 * @returns {Promise<void>}
 */
const main = async () => {
  if (!formBlock) {
    console.warn(
      "No se encontró #reactivation_form"
    );

    return;
  }

  if (!form) {
    console.warn(
      "No se encontró el <form> dentro de #reactivation_form"
    );

    return;
  }

  configurePhoneInput(
    "phone_number"
  );

  configureDocumentNumber();

  setupTextareaCounter({
    textareaId:
      "business_description",

    maxCharacters: 300,

    counterId:
      "business_description_counter",
  });

  configureBusinessLogo();

  if (selectCity) {
    removeAllOptions(
      selectCity
    );

    addFirstOption(
      "Selecciona primero un departamento",
      selectCity
    );

    selectCity.disabled = true;
    selectCity.required = true;
  }

  if (selectDepartment) {
    selectDepartment.required = true;
  }

  await loadDepartments();

  selectDepartment?.addEventListener(
    "change",
    handleDepartmentChange
  );

  form.addEventListener(
    "submit",
    handleSubmit
  );

  console.log(
    "[Reactivación] Formulario inicializado"
  );
};

main();
