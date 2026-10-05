import {
  configurePhoneInput,
  readRadioValue,
  setupTextareaCounter,
  validateEmail,
} from "./shared/utils.js";

import {
  sendCleverTapEventEventOnly,
} from "./services/event.clevertap.eventOnly.js";

const EVENT_NAME = "form_datafono_web";

const formBlock =
  document.getElementById("datafono_form");

const form =
  formBlock?.querySelector("form");

const inputPhoneNumber =
  document.getElementById("phone_number");

const inputEmail =
  document.getElementById("email");

const textareaDatafonoReason =
  document.getElementById("datafono_reason");

const selectMonthlyCardSales =
  document.getElementById("monthly_card_sales");

const selectCardRequestsLast24h =
  document.getElementById(
    "card_requests_last_24h"
  );

const monthlyCardSalesField =
  document.getElementById(
    "monthly_card_sales_field"
  );

const cardRequestsLast24hField =
  document.getElementById(
    "card_requests_last_24h_field"
  );

const checkboxTerms =
  document.getElementById(
    "acepto_tratamiento_datos"
  );

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
 * @param {HTMLSelectElement|null} select
 * @returns {string}
 */
const getSelectedText = (select) => {
  if (!select || !select.value) {
    return "";
  }

  const selectedOption =
    select.options[
      select.selectedIndex
    ];

  return (
    selectedOption?.textContent?.trim() ||
    ""
  );
};

/**
 * @param {HTMLElement|null} container
 * @param {HTMLSelectElement|null} select
 * @param {boolean} show
 * @returns {void}
 */
const toggleConditionalField = (
  container,
  select,
  show
) => {
  if (!container || !select) {
    return;
  }

  container.style.display =
    show ? "" : "none";

  select.required = show;

  if (!show) {
    select.value = "";
    select.setCustomValidity("");
  }
};

/**
 * @returns {void}
 */
const handleCardPaymentsChange = () => {
  const receivesCardPayments =
    normalizeRadioValue(
      readRadioValue(
        "receives_card_payments"
      )
    );

  const answeredYes =
    receivesCardPayments === "yes";

  const answeredNo =
    receivesCardPayments === "no";

  toggleConditionalField(
    monthlyCardSalesField,
    selectMonthlyCardSales,
    answeredYes
  );

  toggleConditionalField(
    cardRequestsLast24hField,
    selectCardRequestsLast24h,
    answeredNo
  );
};

/**
 * @returns {Object}
 */
const buildEventProperties = () => {
  const phoneNumber =
    inputPhoneNumber?.value.trim() ||
    "";

  const email =
    inputEmail?.value.trim() ||
    "";

  const datafonoReason =
    textareaDatafonoReason?.value
      .trim() || "";

  const receivesCardPayments =
    normalizeRadioValue(
      readRadioValue(
        "receives_card_payments"
      )
    );

  const answeredYes =
    receivesCardPayments === "yes";

  const answeredNo =
    receivesCardPayments === "no";

  return {
    Phone: phoneNumber,

    Email: email,

    DatafonoReason:
      datafonoReason,

    ReceivesCardPayments:
      receivesCardPayments,

    MonthlyCardSales:
      answeredYes
        ? getSelectedText(
            selectMonthlyCardSales
          )
        : "",

    CardRequestsLast24h:
      answeredNo
        ? getSelectedText(
            selectCardRequestsLast24h
          )
        : "",

    AcceptTerms:
      checkboxTerms?.checked ||
      false,
  };
};

/**
 * @param {SubmitEvent} event
 * @returns {void}
 */
const handleSubmit = (event) => {
  if (!form) {
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
const configureEmailInput = () => {
  if (!inputEmail) {
    return;
  }

  inputEmail.oninput =
    validateEmail;
};

/**
 * @returns {void}
 */
const configureConditionalFields = () => {
  toggleConditionalField(
    monthlyCardSalesField,
    selectMonthlyCardSales,
    false
  );

  toggleConditionalField(
    cardRequestsLast24hField,
    selectCardRequestsLast24h,
    false
  );

  document
    .querySelectorAll(
      'input[name="receives_card_payments"]'
    )
    .forEach((radio) => {
      radio.addEventListener(
        "change",
        handleCardPaymentsChange
      );
    });
};

/**
 * @returns {Promise<void>}
 */
const main = async () => {
  if (!formBlock) {
    console.warn(
      "No se encontró #datafono_form"
    );

    return;
  }

  if (!form) {
    console.warn(
      "No se encontró el <form> dentro de #datafono_form"
    );

    return;
  }

  configurePhoneInput(
    "phone_number"
  );

  configureEmailInput();

  setupTextareaCounter({
    textareaId:
      "datafono_reason",

    maxCharacters: 300,

    counterId:
      "datafono_reason_counter",
  });

  configureConditionalFields();

  form.addEventListener(
    "submit",
    handleSubmit
  );
};

main();
