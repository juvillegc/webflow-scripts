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

  const isChecked = (formElement, selector) =>
    Boolean(getInput(formElement, selector)?.checked);

  const normalizeDigits = (raw) => String(raw || "").replace(/\D/g, "");

  const normalizePhone10 = (raw) => normalizeDigits(raw).slice(0, 10);

  const isValidPhone10 = (raw) => normalizeDigits(raw).length === 10;

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

    const phone10 = normalizePhone10(phoneInputElement.value);
    if (phone10.length !== 10) {
      phoneInputElement.setCustomValidity("El celular debe tener 10 dígitos.");
      phoneInputElement.reportValidity();
      return false;
    }

    phoneInputElement.setCustomValidity("");
    phoneInputElement.value = phone10; // deja solo dígitos
    return true;
  };

  const requireCheckbox = (checkboxElement, message) => {
    if (!checkboxElement) return false;

    if (!checkboxElement.checked) {
      checkboxElement.setCustomValidity(message);
      checkboxElement.reportValidity?.();
      checkboxElement.setCustomValidity("");
      return false;
    }

    checkboxElement.setCustomValidity("");
    return true;
  };

  const updateSubmitState = (formElement) => {
    const submitBtn = formElement.querySelector(".js-submit");
    if (!submitBtn) return;

    const fullName = getValue(formElement, '[data-ct="full_name"]');
    const documentValue = getValue(formElement, '[data-ct="document"]');
    const phoneRaw = getValue(formElement, '[data-ct="phone"]');

    const termsOk = isChecked(formElement, '[data-ct="terms"]');
    const privacyOk = isChecked(formElement, '[data-ct="privacy"]');

    const canSubmit =
      fullName.length > 0 &&
      documentValue.length > 0 &&
      isValidPhone10(phoneRaw) &&
      termsOk &&
      privacyOk;

    submitBtn.disabled = !canSubmit;
  };

  forms.forEach((formElement) => {
    // Fields (por form, evita conflicto por IDs duplicados)
    const fullNameInput = getInput(formElement, '[data-ct="full_name"]');
    const documentInput = getInput(formElement, '[data-ct="document"]');
    const phoneInput = getInput(formElement, '[data-ct="phone"]');
    const termsCheckbox = getInput(formElement, '[data-ct="terms"]');
    const privacyCheckbox = getInput(formElement, '[data-ct="privacy"]');

    // Botón submit
    const submitBtn = formElement.querySelector(".js-submit");
    if (submitBtn) submitBtn.disabled = true;

    // Documento: valida solo números + máx 15
    if (documentInput) {
      documentInput.onkeypress = validDocumentNumber;
      documentInput.setAttribute("maxlength", "15");
      documentInput.setAttribute("inputmode", "numeric");
      documentInput.addEventListener("paste", (e) => e.preventDefault());
    }

    // Celular: valida solo números + máx 10
    if (phoneInput) {
      phoneInput.onkeypress = validPhoneNumber;
      phoneInput.setAttribute("maxlength", "10");
      phoneInput.setAttribute("inputmode", "numeric");
      phoneInput.addEventListener("paste", (e) => e.preventDefault());

      // Extra: si el usuario escribe, recalculamos estado del botón
      phoneInput.addEventListener("input", () => {
        // Limpieza suave: solo dígitos (sin cortar la escritura brusco)
        const digits = normalizeDigits(phoneInput.value);
        phoneInput.value = digits.slice(0, 10);
      });
    }

    // Recalcular habilitación cuando cambie cualquier campo
    const watchSelectors = [
      '[data-ct="full_name"]',
      '[data-ct="document"]',
      '[data-ct="phone"]',
      '[data-ct="terms"]',
      '[data-ct="privacy"]',
    ];

    watchSelectors.forEach((sel) => {
      const el = getInput(formElement, sel);
      if (!el) return;
      el.addEventListener("input", () => updateSubmitState(formElement));
      el.addEventListener("change", () => updateSubmitState(formElement));
    });

    // Estado inicial
    updateSubmitState(formElement);

    // Submit final (por seguridad)
    formElement.addEventListener("submit", (submitEvent) => {
      // Nombre
      if (!requireValue(fullNameInput, "Ingresa tu nombre y apellido.")) {
        blockSubmit(submitEvent);
        updateSubmitState(formElement);
        return;
      }

      // Documento
      if (!requireValue(documentInput, "Ingresa tu número de documento.")) {
        blockSubmit(submitEvent);
        updateSubmitState(formElement);
        return;
      }

      // Celular 10 dígitos
      if (!requirePhone10(phoneInput)) {
        blockSubmit(submitEvent);
        updateSubmitState(formElement);
        return;
      }

      // Términos
      if (!requireCheckbox(termsCheckbox, "Debes aceptar los términos para continuar.")) {
        blockSubmit(submitEvent);
        updateSubmitState(formElement);
        return;
      }

      // Políticas
      if (!requireCheckbox(privacyCheckbox, "Debes aceptar las políticas para continuar.")) {
        blockSubmit(submitEvent);
        updateSubmitState(formElement);
        return;
      }

      // ✅ Evento CleverTap (Phone como ID + resto como Event props)
      const phone10 = normalizePhone10(getValue(formElement, '[data-ct="phone"]'));

      sendCleverTapEventEventOnly("subele_campana_nn_web", {
        Phone: phone10,
        full_name: getValue(formElement, '[data-ct="full_name"]'),
        document: getValue(formElement, '[data-ct="document"]'),
        termsAccepted: true,
        privacyPolicy: true,
      });

      // No prevenimos submit: dejamos que Webflow muestre el success
    });
  });
});
