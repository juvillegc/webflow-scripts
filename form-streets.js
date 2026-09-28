import {
  configurePhoneInput,
} from "./shared/utils.js";

import {
  sendCleverTapEventEventOnly,
} from "./services/event.clevertap.eventOnly.js";

const EVENT_NAME = "form_callejeando_web";

const inputPhoneNumber =
  document.getElementById("phone_number");

/**
 * @returns {{ Phone: string }}
 */
const buildEventProperties = () => ({
  Phone: inputPhoneNumber?.value.trim() || "",
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
const main = () => {
  configurePhoneInput("phone_number");

  const form =
    inputPhoneNumber?.closest("form");

  form?.addEventListener(
    "submit",
    handleSubmit
  );
};

main();
