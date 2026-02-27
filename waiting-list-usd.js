import {
  configurePhoneInput,
  validatePhone,
  validatePrivacyPolicy,
  setupTextareaCounter,
} from "./shared/utils.js";

import { sendCleverTapEventEventOnly } from "./services/event.clevertap.eventOnly.js";  // clevertap


document.addEventListener("DOMContentLoaded", () => {
  const formElement = document.querySelector("#form_usd form");
  const nameInputElement = document.getElementById("full_name");
  const purposeTextAreaElement = document.getElementById("text_area");

  configurePhoneInput("cell_phone");
  setupTextareaCounter({ textareaId: "text_area", maxCharacters: 100 });

  const handleSubmit = (submitEvent) => {
    const phone = validatePhone("cell_phone");
    if (!phone) {
      submitEvent.preventDefault();
      submitEvent.stopPropagation();
      return;
    }

    const accepted = validatePrivacyPolicy("privacyPolicy");
    if (!accepted) {
      submitEvent.preventDefault();
      submitEvent.stopPropagation();
      return;
    }

    submitEvent.preventDefault();
    submitEvent.stopPropagation();

    sendCleverTapEventEventOnly("USD_lista_de_espera_web", {
      Phone: phone,
      full_name: String(nameInputElement?.value || "").trim(),
      purpose: String(purposeTextAreaElement?.value || "").trim(),
      privacyPolicy: true,
    });

    setTimeout(() => {
      formElement?.submit();
    }, 150);
  };

  formElement?.addEventListener("submit", handleSubmit);
});

