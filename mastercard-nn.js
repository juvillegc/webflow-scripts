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

  const normalizeDigits = (raw) => String(raw || "").replace(/\D/g, "");
  const phone10FromRaw = (raw) => normalizeDigits(raw).slice(0, 10);

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

  const requirePhone10Digits = (phoneInputElement) => {
    if (!phoneInputElement) return false;

    const digits = normalizeDigits(phoneInputElement.value);

    // Si el usuario escribió más de 10, lo recortamos (sin bloquear UX)
    if (digits.length > 10) {
      phoneInputElement.value = digits.slice(0, 10);
    } else {
      phoneInputElement.value = digits; // limpia no-dígitos si los hubo
    }

    const finalPhone = phoneInputElement.value;

    if (finalPhone.length !== 10) {
      phoneInputElement.setCustomValidity("El celular debe tener 10 dígitos.");
      phoneInputElement.reportValidity();
      return false;
    }

    phoneInputElement.setCustomValidity("");
    return true;
  };

  const requireCheckboxChecked = (checkboxElement, message) => {
    if (!checkboxElement) return false;

    if (!checkboxElement.checked) {
      // Si el checkbox es required, reportValidity funciona.
      checkboxElement.setCustomValidity(message);
      checkboxElement.reportValidity?.();
      checkboxElement.setCustomValidity("");
      return false;
    }

    checkboxElement.setCustomValidity("");
    return true;
  };

  forms.forEach((formElement) => {
    const fullNameInput = getInput(formElement, '[data-ct="full_name"]');
    const documentInput = getInput(formElement, '[data-ct="document"]');
    const phoneInput = getInput(formElement, '[data-ct="phone"]');
    const termsCheckbox = getInput(formElement, '[data-ct="terms"]');
    const privacyCheckbox = getInput(formElement, '[data-ct="privacy"]');

    // Documento: reutiliza tu validador (solo números, máx 15)
    if (documentInput) {
      documentInput.onkeypress = validDocumentNumber;
      documentInput.setAttribute("maxlength", "15");
      documentInput.setAttribute("inputmode", "numeric");
      documentInput.addEventListener("paste", (e) => e.preventDefault());
    }

    // Celular: reutiliza tu validador (solo números, máx 10)
    if (phoneInput) {
      phoneInput.onkeypress = validPhoneNumber; // tu validador de utils
      phoneInput.setAttribute("maxlength", "10");
      phoneInput.setAttribute("inputmode", "numeric");
      phoneInput.addEventListener("paste", (e) => e.preventDefault());

      // Limpieza extra en input (por si el navegador deja meter caracteres raros)
      phoneInput.addEventListener("input", () => {
        phoneInput.value = phone10FromRaw(phoneInput.value);
      });
    }

    // Submit (no toca el success de Webflow)
    formElement.addEventListener("submit", (submitEvent) => {
      // 1) Nombre
      if (!requireValue(fullNameInput, "Ingresa tu nombre y apellido.")) {
        blockSubmit(submitEvent);
        return;
      }

      // 2) Documento
      if (!requireValue(documentInput, "Ingresa tu número de documento.")) {
        blockSubmit(submitEvent);
        return;
      }

      // 3) Celular 10 dígitos (bloquea si no)
      if (!requirePhone10Digits(phoneInput)) {
        blockSubmit(submitEvent);
        return;
      }

      // 4) Términos
      if (!requireCheckboxChecked(termsCheckbox, "Debes aceptar los términos para continuar.")) {
        blockSubmit(submitEvent);
        return;
      }

      // 5) Políticas
      if (!requireCheckboxChecked(privacyCheckbox, "Debes aceptar las políticas para continuar.")) {
        blockSubmit(submitEvent);
        return;
      }

      // ✅ Evento CleverTap
      const phone10 = phone10FromRaw(getValue(formElement, '[data-ct="phone"]'));

      sendCleverTapEventEventOnly("subele_campana_nn_web", {
        Phone: phone10,
        full_name: getValue(formElement, '[data-ct="full_name"]'),
        document: getValue(formElement, '[data-ct="document"]'),
        termsAccepted: true,
        privacyPolicy: true,
      });

      // No prevenimos submit: Webflow muestra success normal
    });
  });
});
