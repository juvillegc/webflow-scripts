import { validDocumentNumber, validPhoneNumber } from "./shared/utils.js";
import { sendCleverTapEventEventOnly } from "./services/event.clevertap.eventOnly.js";

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".js-subele-form form, form.js-subele-form");
  if (!forms.length) return;

  const normalizeDigits = (raw) => String(raw || "").replace(/\D/g, "");
  const phone10FromRaw = (raw) => normalizeDigits(raw).slice(0, 10);

  const blockSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // ✅ Devuelve el control real (input/textarea/select), aunque el data-ct esté en el wrapper
  const getCtControl = (formElement, key) => {
    const node = formElement.querySelector(`[data-ct="${key}"]`);
    if (!node) return null;

    const tag = (node.tagName || "").toLowerCase();
    const isControl = tag === "input" || tag === "textarea" || tag === "select";
    if (isControl) return node;

    return node.querySelector("input, textarea, select");
  };

  const requireValue = (control, message) => {
    if (!control) return false;
    const value = String(control.value || "").trim();

    if (!value) {
      control.setCustomValidity(message);
      control.reportValidity();
      return false;
    }

    control.setCustomValidity("");
    return true;
  };

  const requirePhone10Digits = (phoneControl) => {
    if (!phoneControl) return false;

    const phone10 = phone10FromRaw(phoneControl.value);

    if (phone10.length !== 10) {
      phoneControl.setCustomValidity("El celular debe tener 10 dígitos.");
      phoneControl.reportValidity();
      return false;
    }

    phoneControl.value = phone10; // deja solo dígitos
    phoneControl.setCustomValidity("");
    return true;
  };

  const requireCheckboxChecked = (checkboxControl, message) => {
    if (!checkboxControl) return false;
    if (!checkboxControl.checked) {
      alert(message);
      return false;
    }
    return true;
  };

  forms.forEach((formElement) => {
    const fullNameControl = getCtControl(formElement, "full_name");
    const documentControl = getCtControl(formElement, "document");
    const phoneControl = getCtControl(formElement, "phone");
    const termsControl = getCtControl(formElement, "terms");
    const privacyControl = getCtControl(formElement, "privacy");

    // Documento: solo números + máx 15
    if (documentControl) {
      documentControl.onkeypress = validDocumentNumber;
      documentControl.setAttribute("maxlength", "15");
      documentControl.setAttribute("inputmode", "numeric");
      documentControl.addEventListener("paste", (e) => e.preventDefault());
    }

    // Celular: solo números + máx 10 + limpieza
    if (phoneControl) {
      phoneControl.onkeypress = validPhoneNumber;
      phoneControl.setAttribute("maxlength", "10");
      phoneControl.setAttribute("inputmode", "numeric");
      phoneControl.addEventListener("paste", (e) => e.preventDefault());

      phoneControl.addEventListener("input", () => {
        phoneControl.value = phone10FromRaw(phoneControl.value);
        phoneControl.setCustomValidity(""); // limpia error si el usuario corrige
      });
    }

    formElement.addEventListener("submit", (submitEvent) => {
      // 1) Nombre
      if (!requireValue(fullNameControl, "Ingresa tu nombre y apellido.")) {
        blockSubmit(submitEvent);
        return;
      }

      // 2) Documento
      if (!requireValue(documentControl, "Ingresa tu número de documento.")) {
        blockSubmit(submitEvent);
        return;
      }

      // 3) Celular 10 dígitos (bloquea si no)
      if (!requirePhone10Digits(phoneControl)) {
        blockSubmit(submitEvent);
        return;
      }

      // 4) Términos y políticas
      if (!requireCheckboxChecked(termsControl, "Debes aceptar los términos para continuar.")) {
        blockSubmit(submitEvent);
        return;
      }

      if (!requireCheckboxChecked(privacyControl, "Debes aceptar las políticas para continuar.")) {
        blockSubmit(submitEvent);
        return;
      }

      // ✅ Evento CleverTap (Phone como ID + resto como props)
      const phone10 = phone10FromRaw(phoneControl.value);

      sendCleverTapEventEventOnly("subele_campana_nn_web", {
        Phone: phone10,
        full_name: String(fullNameControl?.value || "").trim(),
        document: String(documentControl?.value || "").trim(),
        termsAccepted: true,
        privacyPolicy: true,
      });

      // No prevenimos submit: Webflow success normal
    });
  });
});
