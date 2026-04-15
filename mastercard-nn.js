import {
  validDocumentNumber,
  validPhoneNumber,
} from "./shared/utils.js";

import { sendCleverTapEventEventOnly } from "./services/event.clevertap.eventOnly.js";

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".js-subele-form form, form.js-subele-form");
  if (!forms.length) return;

  const getInput = (formElement, selector) => formElement.querySelector(selector);

  const getValue = (formElement, selector) =>
    String(getInput(formElement, selector)?.value || "").trim();

  const isChecked = (formElement, selector) => Boolean(getInput(formElement, selector)?.checked);

  const normalizePhone10 = (raw) => raw.replace(/\D/g, "").slice(0, 10);

  const blockSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    submitEvent.stopPropagation();
  };

  const requireValue = (inputElement, message) => {
    if (!inputElement) return false;
    const value = String(inputElement.value || "").trim();
    if (!value) {
      inputElement.setCustomValidity(message);
      inputElement.reportValidity();
      return false;
    }
    inputElement.setCustomValidity("");
    return true;
  };

  const requirePhone10 = (phoneInputElement) => {
    if (!phoneInputElement) return false;

    const phone10 = normalizePhone10(String(phoneInputElement.value || ""));
    if (phone10.length !== 10) {
      phoneInputElement.setCustomValidity("El celular debe tener 10 dígitos.");
      phoneInputElement.reportValidity();
      return false;
    }

    phoneInputElement.setCustomValidity("");
    // dejamos el input limpio (solo dígitos) para consistencia
    phoneInputElement.value = phone10;
    return true;
  };

  const requireCheckbox = (formElement, selector, message) => {
    const checkbox = getInput(formElement, selector);
    if (!checkbox) return false;

    if (!checkbox.checked) {
      // Para checkboxes, reportValidity funciona si tienen required (Webflow lo puede marcar)
      checkbox.setCustomValidity(message);
      checkbox.reportValidity?.();
      checkbox.setCustomValidity("");
      return false;
    }

    checkbox.setCustomValidity("");
    return true;
  };

  forms.forEach((formElement) => {
    const fullNameInput = getInput(formElement, '[data-ct="full_name"]');
    const documentInput = getInput(formElement, '[data-ct="document"]');
    const phoneInput = getInput(formElement, '[data-ct="phone"]');

    // ✅ Documento: usa tu validador existente (keypress)
    if (documentInput) {
      documentInput.onkeypress = validDocumentNumber;
      documentInput.setAttribute("maxlength", "15");
      documentInput.setAttribute("inputmode", "numeric");
    }

    // ✅ Celular: usa tu validador existente (keypress) sin depender de IDs
    if (phoneInput) {
      phoneInput.onkeypress = validPhoneNumber;
      phoneInput.setAttribute("maxlength", "10");
      phoneInput.setAttribute("inputmode", "numeric");
      phoneInput.addEventListener("paste", (pasteEvent) => pasteEvent.preventDefault());
    }

    formElement.addEventListener("submit", (submitEvent) => {
      // 1) Nombre + apellido
      if (!requireValue(fullNameInput, "Ingresa tu nombre y apellido.")) {
        blockSubmit(submitEvent);
        return;
      }

      // 2) Documento
      if (!requireValue(documentInput, "Ingresa tu número de documento.")) {
        blockSubmit(submitEvent);
        return;
      }

      // 3) Celular 10 dígitos
      if (!requirePhone10(phoneInput)) {
        blockSubmit(submitEvent);
        return;
      }

      // 4) Términos y políticas (checkboxes)
      const termsOk = requireCheckbox(
        formElement,
        '[data-ct="terms"]',
        "Debes aceptar los términos para continuar."
      );

      if (!termsOk) {
        blockSubmit(submitEvent);
        return;
      }

      const privacyOk = requireCheckbox(
        formElement,
        '[data-ct="privacy"]',
        "Debes aceptar las políticas para continuar."
      );

      if (!privacyOk) {
        blockSubmit(submitEvent);
        return;
      }

      // ✅ Evento CleverTap: ID = Phone (wrapper hace Identity=Phone) + resto props del evento
      const phone10 = normalizePhone10(getValue(formElement, '[data-ct="phone"]'));

      sendCleverTapEventEventOnly("subele_campana_nn_web", {
        Phone: phone10,
        full_name: getValue(formElement, '[data-ct="full_name"]'),
        document: getValue(formElement, '[data-ct="document"]'),
        termsAccepted: true,
        privacyPolicy: true,
      });
    });
  });
});
