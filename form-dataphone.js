import {
  configurePhoneInput,
  validateEmail,
  readRadioValue,
  setupTextareaCounter,
} from "./shared/utils.js";

import {
  sendCleverTapEventEventOnly,
} from "./services/event.clevertap.eventOnly.js";

const EVENT_NAME = "form_datafono_web";

const inputPhoneNumber =
  document.getElementById("phone_number");

const inputEmail =
  document.getElementById("email");

const textareaDataphoneReason =
  document.getElementById("dataphone_reason");

const selectMonthlyCardSales =
  document.getElementById("monthly_card_sales");

const selectCardRequestsLast24h =
  document.getElementById("card_requests_last_24h");

const checkboxTerms =
  document.getElementById("tyc");

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
    select.options[select.selectedIndex];

  return selectedOption?.textContent?.trim() || "";
};

/**
 * @returns {{
 *   Phone: string,
 *   Email: string,
 *   DataphoneReason: string,
 *   ReceivesCardPayments: string,
 *   MonthlyCardSales: string,
 *   CardRequestsLast24h: string,
 *   AcceptedTerms: boolean
 * }}
 */
const buildEventProperties = () => {
  return {
    Phone:
      inputPhoneNumber?.value.trim() || "",

    Email:
      inputEmail?.value.trim() || "",

    DataphoneReason:
      textareaDataphoneReason?.value.trim() || "",

    ReceivesCardPayments:
      normalizeRadioValue(
        readRadioValue(
          "receives_card_payments"
        )
      ),

    MonthlyCardSales:
      getSelectedText(
        selectMonthlyCardSales
      ),

    CardRequestsLast24h:
      getSelectedText(
        selectCardRequestsLast24h
      ),

    AcceptedTerms:
      checkboxTerms?.checked ?? false,
  };
};

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
const main = () => {
  configurePhoneInput(
    "phone_number"
  );

  if (inputEmail) {
    inputEmail.oninput =
      validateEmail;
  }

  setupTextareaCounter({
    textareaId: "dataphone_reason",
    maxCharacters: 300,
    counterId: "dataphone_reason_counter",
  });

  const form =
    inputPhoneNumber?.closest("form");

  if (!form) {
    console.warn(
      "No se encontró el formulario del datáfono"
    );

    return;
  }

  form.addEventListener(
    "submit",
    handleSubmit
  );
};

main();
