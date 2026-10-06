import {
  configurePhoneInput,
  readRadioValue,
  setupTextareaCounter,
} from "./shared/utils.js";

import {
  sendCleverTapEventEventOnly,
} from "./services/event.clevertap.eventOnly.js";

const formBlock = document.getElementById("reactivation_form");
const form = formBlock?.querySelector("form");

const inputPhoneNumber =
  document.getElementById("phone_number");

const inputBusinessName =
  document.getElementById("business_name");

const inputEmail =
  document.getElementById("email");

const inputSocialNetwork =
  document.getElementById("social_network");

const inputWebsite =
  document.getElementById("website");

const inputGoogleMapsUrl =
  document.getElementById("google_maps_url");

const selectBusinessCategory =
  document.getElementById("business_category");

const inputBusinessLogo =
  document.getElementById("business_logo");

const textareaBusinessDescription =
  document.getElementById("business_description");

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
 * @param {string} value
 * @returns {string}
 */
const normalizeRadioValue = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

/**
 * @returns {boolean}
 */
const validateBusinessLogo = () => {
  if (!inputBusinessLogo) return true;

  const file = inputBusinessLogo.files?.[0];

  if (!file) {
    inputBusinessLogo.setCustomValidity("");
    return true;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/svg+xml",
  ];

  if (!allowedTypes.includes(file.type)) {
    inputBusinessLogo.setCustomValidity(
      "Adjunta tu logo en formato JPG, PNG o SVG."
    );

    return false;
  }

  inputBusinessLogo.setCustomValidity("");

  return true;
};

/**
 * @returns {Object}
 */
const buildEventProperties = () => {
  const salesScope =
    normalizeRadioValue(
      readRadioValue("sales_scope")
    );

  return {
    Phone:
      getInputValue(inputPhoneNumber),

    BusinessName:
      getInputValue(inputBusinessName),

    Email:
      getInputValue(inputEmail),

    SocialNetwork:
      getInputValue(inputSocialNetwork),

    Website:
      getInputValue(inputWebsite),

    GoogleMapsUrl:
      getInputValue(inputGoogleMapsUrl),

    BusinessCategory:
      getSelectValue(selectBusinessCategory),

    BusinessDescription:
      textareaBusinessDescription?.value
        .trim() || "",

    SalesScope:
      salesScope,

    SalesChannel:
      getSelectValue(selectSalesChannel),

    AcceptTerms:
      checkboxAcceptTerms?.checked || false,
  };
};

/**
 * @param {SubmitEvent} event
 * @returns {void}
 */
const handleSubmit = (event) => {
  if (!form) return;

  const isLogoValid =
    validateBusinessLogo();

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
    "CleverTap Event:",
    "form_reactivacion_web",
    eventProperties
  );

  sendCleverTapEventEventOnly(
    "form_reactivacion_web",
    eventProperties
  );
};

/**
 * @returns {void}
 */
const configureBusinessLogo = () => {
  if (!inputBusinessLogo) return;

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

  setupTextareaCounter({
    textareaId:
      "business_description",

    maxCharacters: 300,

    counterId:
      "business_description_counter",
  });

  configureBusinessLogo();

  form.addEventListener(
    "submit",
    handleSubmit
  );
};

main();
