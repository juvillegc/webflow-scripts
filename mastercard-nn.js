import {
  configurePhoneInput,
  validatePhone,
  validatePrivacyPolicy,
  validateEmail, 
} from "./shared/utils.js";

import { sendCleverTapEventEventOnly } from "./services/event.clevertap.eventOnly.js";

document.addEventListener("DOMContentLoaded", () => {
  const formElement = document.querySelector("#form_usd form");
  if (!formElement) return;

  const nameInputElement = document.getElementById("full_name");
  const emailInputElement = document.getElementById("email"); // ajusta si el ID es distinto

  configurePhoneInput("cell_phone");

  // (Opcional) validación live de email
  if (emailInputElement) {
    emailInputElement.addEventListener("input", validateEmail);
  }

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

    const emailValue = String(emailInputElement?.value || "").trim();
    if (!emailValue) {
      emailInputElement?.setCustomValidity("Ingresa tu correo para continuar.");
      emailInputElement?.reportValidity();
      submitEvent.preventDefault();
      submitEvent.stopPropagation();
      return;
    }
    emailInputElement?.setCustomValidity("");

    sendCleverTapEventEventOnly("subele_campana_nn_web", {
      Phone: phone,
      full_name: String(nameInputElement?.value || "").trim(),
      email: emailValue,
      privacyPolicy: true,
    });
  };

  formElement.addEventListener("submit", handleSubmit);
});
